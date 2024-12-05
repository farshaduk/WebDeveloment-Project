import React, { useState } from "react";
import Swal from "sweetalert2";
import { IsAuthenticated } from "../auth";

const NewPostForm = ({ user = {}, token }) => {
  const isAuthenticated = IsAuthenticated();
  const [postTitle, setPostTitle] = useState(""); // State for post title
  const [postBody, setPostBody] = useState("");  // State for post body
  const [postPhoto, setPostPhoto] = useState(""); // State for photo

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPostPhoto(e.target.files[0]);
    }
  };
  if (!user || Object.keys(user).length === 0) {
    // Render a fallback if user is null or empty
    return <div>Loading New Post...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!postTitle || !postBody || !postPhoto) {
      Swal.fire("Error", "Title, body, and image are required.", "error");
      return;
    }    
    const formData = new FormData();
    formData.append("title", postTitle);
    formData.append("body", postBody);
    formData.append("postedBy", user._id);
    formData.append("photo", postPhoto);
  
    // console.log("Submitting form data:", { postTitle, postBody, photo: postPhoto });
    try {     
      const response = await fetch(`${process.env.REACT_APP_API_URL}/post/new`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${isAuthenticated.token}`,
        },
        body: formData,
      });     
      const data = await response.json();   
      Swal.fire("Error", response.status, "error");
      if (response.ok ) {
        Swal.fire("Success", "Post created successfully!", "success");
        setPostTitle(""); // Reset title
        setPostBody("");  // Reset body
        setPostPhoto(""); // Reset photo
        window.location.reload();
      } else if (response.status === 400) {
        Swal.fire("Error", data.error, "error");
      } else {
        Swal.fire("Error", "Something went wrong. Please try again", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Network error occurred. Please try again.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="feed">
        <h5>New Post</h5>
        {/* Input for title */}
        <input
          type="text"
          className="form-control"
          placeholder="Post Title"
          value={postTitle} // State for title
          onChange={(e) => setPostTitle(e.target.value)}
        />
        {/* Textarea for post body */}
        <textarea
          className="form-control mt-2"
          rows="3"
          placeholder="What's on your mind?"
          value={postBody} // State for body
          onChange={(e) => setPostBody(e.target.value)}
        ></textarea>
        {/* File input for photo */}
        <input
          type="file"
          accept="image/*"
          className="form-control mt-2"
           onChange={handleFileChange} 
           name="photo"
        />

        {/* Submit button */}
        <button type="submit" className="btn btn-primary btn-sm mt-2">
          Post
        </button>
      </div>
    </form>
  );
};

export default NewPostForm;