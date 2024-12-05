import React, { useEffect, useState } from "react";
import { IsAuthenticated } from "../auth";

const UserPosts = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isAuthenticated = IsAuthenticated();

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        console.log("Fetching posts for User ID:", userId);
        console.log("Auth Token:", isAuthenticated.token);

        const response = await fetch(`${process.env.REACT_APP_API_URL}/posts/by/${userId.replace(":", "")}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${isAuthenticated.token}`,
          },
        });

        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Fetched data:", data);

        if (response.ok) {
          setPosts(data);
        } else {
          setError(data.error || "Failed to fetch posts.");
        }
      } catch (err) {
        console.error("Network error:", err);
        setError("Network error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [userId]);

  if (loading) {
    // Show loading spinner while fetching posts
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading posts...</span>
        </div>
      </div>
    );
  }

  if (error) {
    // Show error message if an error occurs
    return <p className="text-danger">{error}</p>;
  }

  if (posts.length === 0) {
    // Show a message if no posts are available
    return <p>No posts available.</p>;
  }

  return (
    <div>
      <h5 className="text-center">My Posts</h5>
      {posts.map((post) => (
        <div className="feed" key={post._id}>
          <div className="post-card">
            <h5 className="mt-3">{post.title}</h5>
            <img
              src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
              alt={post.title}
              onError={(i) => (i.target.src = `https://via.placeholder.com/150`)}
              className="card-img-top"
            />
            <p className="mt-3 mb-5">{post.body}</p>
          </div>
          <button className="btn btn-outline-primary btn-sm mx-3">Like</button>
          <button className="btn btn-outline-secondary btn-sm">Comment</button>
        </div>
      ))}
    </div>
  );
};

export default UserPosts;
