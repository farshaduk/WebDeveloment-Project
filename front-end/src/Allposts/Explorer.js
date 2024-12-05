import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assest/css/main.css"; // Custom CSS

const Explorer = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/posts`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.error) {
          console.error("Error fetching posts:", data.error);
        } else {
          setPosts(data.posts); // Save posts in state
        }
      } catch (err) {
        console.error("Network error:", err);
      } finally {
        setLoading(false); // Stop loading indicator after fetch
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Explorer</h2>
      {loading ? ( // Show loading indicator while loading is true
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : posts.length > 0 ? (
        <div className="row">
          {posts.map((post) => (
            <div className="col-md-4 mb-4" key={post._id}>
              <div className="card shadow-sm">
                {/* Image placeholder for the post */}
                <img
                  src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                  alt={post.title}
                  onError={(i) => (i.target.src = `https://via.placeholder.com/150`)}
                  className="card-img-top"
                />
                <div className="card-body">
                  {/* Post Title */}
                  <h5 className="card-title">{post.title}</h5>
                  {/* Post Body */}
                  <div className="card-body">
                    <p className="text-muted">
                      Posted By:{" "}
                      <Link to={`/user/${post.postedBy._id}`}>{post.postedBy.name}</Link>
                    </p>
                    <p className="text-muted">
                      {post.body.substring(0, 10)} . . . .
                    </p>
                    {/* Date Posted */}
                    <p className="text-muted">
                      Date Posted:{" "}
                      {new Date(post.created).toISOString().split("T")[0].replace(/-/g, "/")}
                    </p>
                  </div>
                  {/* Link to Post Details */}
                  <Link
                    to={`/postdetails/${post._id}`}
                    className="btn btn-primary btn-sm mt-2"
                  >
                    View Post
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No posts available.</p>
      )}
    </div>
  );
};

export default Explorer;
