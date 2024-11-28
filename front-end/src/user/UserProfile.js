import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IsAuthenticated, signout ,useAuthenticatedUser  } from "../auth";
import "../assest/css/Profile.css"; // Custom CSS
const UserProfile = () => {
  const { id } = useParams(); // Get the user ID from the URL
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
	const isAuthenticated = IsAuthenticated();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("jwt"); // Retrieve the token from localStorage or other storage
        if (!token) {
          setError("No authentication token found. Please log in.");
          return;
        }
    
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${id}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${isAuthenticated.token}`, // Include the token in the Authorization header
          },
        });
    
        if (!response.ok) {
          const errorText = await response.text(); // Read raw response
          console.error("Error response:", errorText);
          setError(`Server error: ${response.status} ${response.statusText}`);
          return;
        }
    
        const data = await response.json();
    
        if (data.error) {
          setError(data.error);
        } else {
          setUser(data);
        }
      } catch (err) {
        setError("Network error: " + err.message);
      }
    };

    fetchUser();
  }, [id]);

  if (error) {
    return <div className="container mt-4"><p>Error: {error}</p></div>;
  }

  if (!user) {
    return <div className="container mt-4"><p>Loading...</p></div>;
  }

  return (
    <div className="container mt-4">
    {/* <!-- Profile Header --> */}
    <div className="card shadow-sm">
      <div className="card-body p-0">
        <div className="profile-cover">
          <img src="https://via.placeholder.com/1200x400" className="img-fluid w-100" alt="Cover Image" />
        </div>
        <div className="d-flex align-items-center p-3">
          <img src="https://via.placeholder.com/100" className="rounded-circle border border-3 profile-img" alt="Profile Image" />
          <div className="ms-3">
            <h4>{user.name}'s Profile <i className="fas fa-check-circle text-primary"></i></h4>
            <p className="text-muted mb-1">{user.email}</p>
            <p className="text-muted mb-1">250 connections</p>
            <p className="mb-0 text-muted">
              <i className="fas fa-briefcase me-2"></i>Developer
              <span className="ms-3"><i className="fas fa-map-marker-alt me-2"></i>New Hampshire</span>
            </p>
            <p className="text-muted"><i className="fas fa-calendar-alt me-2"></i>Joined on {new Date(user.createddate).toDateString()}</p>
          </div>
          <button className="btn btn-outline-primary ms-auto">Follow</button>
        </div>
      </div>
    </div>

    {/* <!-- Tabs Section --> */}
    <ul className="nav nav-tabs mt-4" id="profileTabs">
      <li className="nav-item">
        <a className="nav-link active" href="#about" data-bs-toggle="tab">About</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#connections" data-bs-toggle="tab">Connections <span className="badge bg-primary">300</span></a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#media" data-bs-toggle="tab">Media</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#photos" data-bs-toggle="tab">Photos</a>
      </li>
    </ul>

    {/* <!-- Tab Content --> */}
    <div className="tab-content mt-3">
      {/* <!-- About Tab --> */}
      <div className="tab-pane fade show active" id="about">
        <div className="row">
          <div className="col-md-8">
            {/* <!-- Profile Info --> */}
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="mb-3">Profile Info</h5>
                <p>He moonlights difficult engrossed it, sportsmen. Interested has all Devonshire difficulty gay assistance joy.</p>
                <ul className="list-unstyled">
                  <li><strong>Born:</strong> October 20, 1990</li>
                  <li><strong>Status:</strong> Single</li>
                  <li><strong>Email:</strong> abc@xyz.com</li>
                  <li><strong>Location:</strong> New Hampshire</li>
                </ul>
              </div>
            </div>
          </div>
          {/* <!-- Right Column --> */}
          <div className="col-md-4">
            {/* <!-- About Card --> */}
            <div className="card shadow-sm mb-3">
              <div className="card-body">
                <h5 className="mb-3">About</h5>
                <p>He moonlights difficult engrossed it, sportsmen. Interested has all Devonshire difficulty gay assistance joy.</p>
              </div>
            </div>
            {/* <!-- Experience --> */}
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="mb-3">Experience</h5>
                <ul className="list-unstyled">
                  <li><strong>Apple Computer, Inc.</strong> <span className="text-muted">May 2015 – Present</span></li>
                  <li><strong>Microsoft Corporation</strong> <span className="text-muted">May 2017 – May 2019</span></li>
                  <li><strong>Tata Consultancy Services</strong> <span className="text-muted">May 2022 – Present</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Photos Tab --> */}
      <div className="tab-pane fade" id="photos">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="mb-3">Photos</h5>
            <div className="row g-2">
              <div className="col-4"><img src="https://via.placeholder.com/150" className="img-fluid rounded" alt="Photo" /></div>
              <div className="col-4"><img src="https://via.placeholder.com/150" className="img-fluid rounded" alt="Photo" /></div>
              <div className="col-4"><img src="https://via.placeholder.com/150" className="img-fluid rounded" alt="Photo" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  );
};

export default UserProfile;
