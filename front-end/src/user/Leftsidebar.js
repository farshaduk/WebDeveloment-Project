import React from "react";
import { Link } from "react-router-dom";
import avatar from "../assest/avatar7.png";
import "../assest/css/main.css"; // Custom CSS
import Swal from "sweetalert2";
import { IsAuthenticated } from "../auth";


const Leftsidebar = ({ user = {}, onSignout }) => {
   const isAuthenticated = IsAuthenticated();
    if (!user || Object.keys(user).length === 0) {
      // Render a fallback if user is null or empty
      return <div>Loading Sidebar...</div>;
    }
    const handleDelete = () => {
      Swal.fire({
        title: "Are you sure?",
        text: "This action will delete your profile!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const token = localStorage.getItem("token");
            const response = await fetch(
              `${process.env.REACT_APP_API_URL}/user/${user._id}`,
              {
                method: "DELETE",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${isAuthenticated.token}`,
                },
              }
            );  
            const data = await response.json();
            if (response.ok) {
              Swal.fire("Deleted!", data.message || "Your account has been deleted.", "success");
              localStorage.removeItem("token");
              onSignout(); // Sign out the user
            } else {
              Swal.fire("Error!", data.error || "Failed to delete account.", "error");
            }
          } catch (err) {
            Swal.fire("Error!", "Network error: " + err.message, "error");
          }
        }
      });
    };    

  return (
    <div className="col-md-3">
      <div className="profile-card">
        <div className="cover-photo"></div>
        <img src={avatar} alt="Profile Photo" className="profile-photo" />
        <h2>{user.name}</h2>
        <p>Joined:</p>
        <p>{new Date(user.createddate).toDateString()}</p>
        <div className="stats">
          <div>
            <span>256</span> Post
          </div>
          <div>
            <span>2.5K</span> Followers
          </div>
          <div>
            <span>365</span> Following
          </div>
        </div>
        <ul>
          <li className="disabled">
            <i className="fas fa-home"></i> Feed
          </li>
          <li className="disabled">
            <i className="fas fa-user-friends"></i> Connections
          </li>
          <li className="disabled">
            <i className="fas fa-globe"></i> Latest News
          </li>
          <li className="disabled">
            <i className="fas fa-calendar-alt"></i> Events
          </li>
          <li className="disabled">
            <i className="fas fa-users"></i> Groups
          </li>
          <li className="disabled">
            <i className="fas fa-bell text-red"></i> Notifications
          </li>
          <li>
            <i className="fas fa-cog"></i>
            <Link
              className="text-dark text-decoration-none"
              to={`/user/edit/${user._id}`}
            >
              Edit Profile
            </Link>
          </li>    
          <li>
            <i className="fas fa-trash"></i>{" "}
            <a onClick={handleDelete} style={{ cursor: "pointer" }}>
              Delete my profile
            </a>
          </li>  
          <li>
       
            <i className="fas fa-sign-out-alt"></i>{" "}
            <a
              onClick={onSignout}
              style={{ cursor: "pointer" }}
            >
              Signout
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Leftsidebar;
