import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Leftsidebar from "../user/Leftsidebar";
import { IsAuthenticated, signout } from "../auth";

const EditProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [user, setUser] = useState(null); // Holds original user data
  const [loading, setLoading] = useState(true); // Handles loading state
  const isAuthenticated = IsAuthenticated();

  // Refs for form inputs
  const nameRef = useRef();
  const lastnameRef = useRef();
  const emailRef = useRef();
  const currentPasswordRef = useRef();
  const newPasswordRef = useRef();

  // Sign out handler
  const handleSignout = () => {
    signout(() => {
      navigate("/signin");
    });
  };

  // Fetch user data
  useEffect(() => {
    let isMounted = true; // Prevents state updates on unmounted components

    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${isAuthenticated.token}`,
          },
        });

        const data = await response.json();

        if (isMounted) {
          if (!data.error) {
            setUser(data);
          } else {
            Swal.fire("Error", "Failed to fetch user data", "error");
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          Swal.fire("Error", "An unexpected error occurred while fetching user data.", "error");
          setLoading(false);
        }
      }
    };

    if (isAuthenticated?.user && userId) {
      fetchUser();
    } else {
      navigate("/signin");
    }

    return () => {
      isMounted = false; // Cleanup
    };
  }, [userId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedUser = {
      name: nameRef.current.value,
      lastname: lastnameRef.current.value,
      email: emailRef.current.value,
      currentPassword: currentPasswordRef.current.value,
      newPassword: newPasswordRef.current.value,
    };

    const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;
    if (updatedUser.newPassword && !passwordPolicy.test(updatedUser.newPassword)) {
       Swal.fire(
          "Error",
          "Password must be 8-32 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
          "error"
       );
       return;
    }
    // Validation: Current password provided but new password is empty
    if (updatedUser.currentPassword && !updatedUser.newPassword) {
      Swal.fire("Error", "Please enter a new password.", "error");
      return;
    }

    // Validate password change
    if (updatedUser.newPassword) {
      if (!updatedUser.currentPassword) {
        Swal.fire("Error", "Please enter your current password to set a new password.", "error");
        return;
      }

      try {
        const verifyPasswordResponse = await fetch(`${process.env.REACT_APP_API_URL}/user/verifypassword`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${isAuthenticated.token}`,
          },
          body: JSON.stringify({ currentPassword: updatedUser.currentPassword }),
        });

        const passwordVerifyResult = await verifyPasswordResponse.json();

        if (!passwordVerifyResult.success) {
          Swal.fire("Error", "Current password is incorrect.", "error");
          return;
        }
      } catch (err) {
        Swal.fire("Error", "Failed to verify current password.", "error");
        return;
      }
    }

    // Update profile
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${isAuthenticated.token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      const data = await response.json();

      if (data.error) {
        Swal.fire("Error", data.error, "error");
      } else {
        Swal.fire("Success", "Profile updated successfully!", "success");
        setUser({ ...user, ...updatedUser });
        currentPasswordRef.current.value = ""; // Clear password fields
        newPasswordRef.current.value = "";
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update profile.", "error");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>Error: Unable to load user data.</p>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <Leftsidebar user={isAuthenticated.user} onSignout={handleSignout} />
        <div className="col-md-9">
          <div className="card p-4 shadow-sm">
            <h3 className="mb-4">Edit My Profile</h3>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={user?.name || ""}
                    ref={nameRef}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="lastname" className="form-label">Lastname</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={user?.lastname || ""}
                    ref={lastnameRef}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    defaultValue={user?.email || ""}
                    ref={emailRef}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="createddate" className="form-label">Created Profile</label>
                  <input
                    type="text"
                    className="form-control"
                    value={user?.createddate || ""}
                    disabled
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="currentPassword" className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    ref={currentPasswordRef}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    ref={newPasswordRef}
                    placeholder="Enter new password"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary mt-3">Save Changes</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
