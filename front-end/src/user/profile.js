import React, { useEffect, useState } from "react";
import avatar from "../assest/avatar7.png";
import "../assest/css/main.css"; // Custom CSS
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link, useNavigate, useParams } from "react-router-dom";
import Leftsidebar from "../user/Leftsidebar";
import NewPostForm from "../post/NewPostForm"; 
import Users from "../user/Users";
import UserPosts from "../user/UserPosts";
import { IsAuthenticated, signout } from "../auth";

const Profile = () => {
	const navigate = useNavigate();
	const { userId } = useParams(); // Retrieve userId from route params
	const [user, setUser] = useState(null);
	const isAuthenticated = IsAuthenticated();
  
	const handleSignout = () => {
	  signout(() => {
		navigate("/signin");
	  });
	};
  
	useEffect(() => {
	  // Redirect to Sign-in if not authenticated
	  if (!isAuthenticated || !isAuthenticated.user) {
		navigate("/signin");
		return;
	  }
  
	  const fetchUser = async () => {
		try {
		  const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId.replace(":", "")}`, {
			method: "GET",
			headers: {
			  Accept: "application/json",
			  "Content-Type": "application/json",
			  Authorization: `Bearer ${isAuthenticated.token}`,
			},
		  });
		  const data = await response.json();
		  if (data.error) {
			console.error("Error fetching user data:", data.error);
		  } else {
			setUser(data);			
		  }
		} catch (err) {
		  console.error("Network error:", err);
		}
	  };
  
	  fetchUser();
	}, [isAuthenticated, userId, navigate]);
  
	if (!isAuthenticated || !isAuthenticated.user) {
	  // If unauthenticated, return null (redirect already handled in useEffect)
	  return null;
	}

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Left Sidebar */}	
        <Leftsidebar user={isAuthenticated.user} onSignout={handleSignout} />
        {/* Main Feed */}
        <div className="col-md-6">
          <NewPostForm user={isAuthenticated.user} token={isAuthenticated.token} />
		  <UserPosts userId={userId} />
                
        </div>
        {/* Right Sidebar */}
        <div className="col-md-3">
          <Users />
        </div>
      </div>
    </div>
  );
};

export default Profile;