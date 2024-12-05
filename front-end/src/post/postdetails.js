import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To get postId from the URL
import "../assest/css/post.css"; // Custom CSS

const PostDetails = () => {
  const { postId } = useParams(); // Get postId from the URL
  const [postDetails, setPostDetails] = useState(null); // For post data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {
          setPostDetails(data); // Save post details in state
        } else {
          setError(data.error || "Failed to fetch post details.");
        }
      } catch (err) {
        console.log(err);
        setError("Network error. Please try again later.");
      } finally {
        setLoading(false); // Stop loading after data fetch
      }
    };

    fetchPostDetails();
  }, [postId]); 

 
  if (loading) {
    return (
      <div className="text-center mt-4">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  if (error) {
    return <p className="text-danger">{error}</p>;
  }
  return (
    <div className="container mt-4">
      {postDetails && (
        <div className="post-container">
          {/* Post Header */}
          <div className="d-flex align-items-center post-header">
            <img
              src="https://via.placeholder.com/50" 
              alt="User Avatar"
            />
            <div className="ms-3">
              <p className="mb-0 name">{postDetails.postedBy?.name || "Unknown User"}</p>
              <p className="mb-0 time">{new Date(postDetails.created).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Post Body */}
          <div className="post-body mt-3">
            <img
              src={`${process.env.REACT_APP_API_URL}/post/photo/${postId}`}
              onError={(e) => (e.target.src = "https://via.placeholder.com/600x300")}
              alt={postDetails.title}
              className="img-fluid"
            />
            <h5>{postDetails.title}</h5>
            <p>{postDetails.body}</p>
          </div>

          {/* Post Footer */}
          <div className="post-footer d-flex justify-content-between align-items-center">
            <div>
              <span className="me-3">👍 {postDetails.likes || 0}</span>
              <span>💬 {postDetails.comments?.length || 0}</span>
            </div>
            <div>
              <span>↗ Share</span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="comment-section">
            {postDetails.comments && postDetails.comments.length > 0 ? (
              postDetails.comments.map((comment, index) => (
                <div className="d-flex align-items-start mb-3 comment" key={index}>
                  <img
                    src="https://via.placeholder.com/40" // Replace with commenter's avatar if available
                    alt="User Avatar"
                  />
                  <div className="comment-body">
                    <p className="mb-1 name">
                      {comment.postedBy?.name || "Anonymous"}{" "}
                      <span className="time">
                        {new Date(comment.created).toLocaleTimeString()}
                      </span>
                    </p>
                    <p className="mb-0">{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
