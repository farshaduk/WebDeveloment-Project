import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assest/css/main.css"; // Custom CSS

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  // Fetch all users from the API
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.error) {
          console.error("Error fetching users:", data.error);
        } else {
          setUsers(data.users); // Access the `users` array from the response
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    };

    fetchAllUsers();
  }, []);

  return (
    <div className="container mt-4">
      <h2>All Users</h2>
      <div className="row">
        {users.length > 0 ? (
          users.map((user) => (
            <div className="col-md-4 mb-4" key={user._id}>
              <div className="card shadow-sm">
                <img
                  src="https://via.placeholder.com/150"
                  alt={user.name}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">{user.name}</h5>
                  <p className="card-text">{user.email}</p>
                  <p className="text-muted">
                    Joined: {new Date(user.createddate).toDateString()}
                  </p>
                  <Link className={({ isActive }) =>
                      isActive ? "btn btn-primary btn-sm mt-2 active" : "btn btn-primary btn-sm mt-2"
                    }  to={`/user/profile/${user._id}`}>
                        view profile
                      </Link>   
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
