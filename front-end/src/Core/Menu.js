import React from "react";
import logo from "../assest/logo.png";
import avatar from "../assest/avatar7.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../assest/css/main.css"; // Custom CSS
import { NavLink, useNavigate } from "react-router-dom";
import { IsAuthenticated, signout } from "../auth";

const Menu = () => {
  const navigate = useNavigate();
  const isAuthenticated = IsAuthenticated();

  const handleSignout = () => {
    signout(() => {
      navigate("/signin");
    });
  };

  return (
    <>  
  <div className="secondary-nav d-flex justify-content-center align-items-center">
  <div className="search-container me-3">
    <div className="px-3">
    <img src={logo} alt="logo" height="60" />
    </div>
    <input type="text" placeholder="Search..." />
  </div>
  {!isAuthenticated && (
    <div className="menu d-flex align-items-center gap-3">
  <ul className="navbar-nav ms-auto d-flex flex-row align-items-center gap-3">
    <li className="nav-item">
      <NavLink
        className="nav-link icon-style fs-5"
        to="/signup"
      >
        <i className="fas fa-user-plus mx-3"></i>
      </NavLink>
    </li>
    <li className="nav-item">
      <NavLink
        className="nav-link icon-style fs-5"
        to="/signin"
      >
        <i className="fas fa-sign-in-alt mx-3"></i>
      </NavLink>
    </li>
  </ul>
</div>


             
     )}
     {isAuthenticated && (
        <div className="menu d-flex align-items-center gap-3">         
          <div className="icon">
            <i className="fas fa-comments"></i>
          </div>
          <div className="icon">
            <i className="fas fa-bell"></i>
          </div>
       
          <div className="dropdown">
            <button
              className="btn dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ background: "transparent", border: "none" }}>
               <img src={avatar} alt="Profile Photo" className="profile-photo" />
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="dropdownMenuButton"
              style={{ width: "250px" }}>
              {/* Profile Header */}
              <li className="p-3 text-center">
              <img src={avatar} alt="Profile Photo" className="profile-photo" />
                <h6 className="mb-0">{isAuthenticated.user.name}</h6>
                <small className="text-muted">Web Developer</small>
                <div>
                <NavLink className={({ isActive }) =>
                      isActive ? "btn btn-primary btn-sm mt-2 active" : "btn btn-primary btn-sm mt-2"
                    }  to={`/user/:${isAuthenticated.user._id}`}>
                        my profile
                      </NavLink>                
                </div>
              </li>
              <hr />
              {/* Menu Items */}
              <li>
                <a href="#" className="dropdown-item">
                  <i className="fas fa-cog me-2"></i> Settings
                </a>
              </li>
              <hr />
              <li>
                <button
                  className="dropdown-item"
                  onClick={handleSignout}
                  style={{ cursor: "pointer" }}>
                  <i className="fas fa-sign-out-alt me-2"></i> Sign Out
                </button>
              </li>                    
            </ul>
          </div>
        </div>
        )}
      </div>
    </>
  );
};

export default Menu;
