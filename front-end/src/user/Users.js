import React from "react";
import { Link } from "react-router-dom";
import "../assest/css/main.css"; // Custom CSS
import { IsAuthenticated } from "../auth";

const Users = () => {
  const [users, setUsers] = React.useState([]);
  const isAuthenticated = IsAuthenticated();

  React.useEffect(() => {
    const fetchUsers = async () => {
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

          const filteredUsers = data.users.filter(
            (user) => user._id !== isAuthenticated.user._id 
          );
          setUsers(filteredUsers.slice(0, 5)); // Limit to the first 5 users
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="col-md-3">
      <div className="follow-card">
        <h3>Who to follow</h3>
        {users.length > 0 ? (
          users.map((user) => (
            <div className="user" key={user.email}>
              <img
                src="https://via.placeholder.com/50"
                alt={user.name}
              />
              <div className="info">
                <h4>{user.name}</h4>
                {/* <p>{user.email}</p> */}
                <p>{new Date(user.createddate).toDateString()}</p>
              </div>
              <div className="action">
                <i className="fas fa-plus"></i>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No users found.</p>
        )}
        <Link to="/all-users" className="view-more">
          View more
        </Link>
      </div>
    </div>
  );
};

export default Users;
