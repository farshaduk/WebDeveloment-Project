import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../auth";

const Signup = () => {
  const [state, setState] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    error: "",
    success: "",
    loading: false,
  });

  const navigate = useNavigate();

  const handleChange = (name) => (event) => {
    setState({ ...state, [name]: event.target.value, error: "", success: "" });
  };

  const clickSignup = async (event) => {
    event.preventDefault();
    const { name, lastname, email, password } = state;
    const user = { name, lastname, email, password };

    try {
      const data = await signup(user);

      if (data.error) {
        setState((prevState) => ({
          ...prevState,
          error: data.error,
          success: "",
        }));
      } else {
        // Show success message and set loading state
        setState({
          name: "",
          lastname: "",
          email: "",
          password: "",
          error: "",
          success: "Signup successful! Redirecting to signin...",
          loading: true,
        });

        // Redirect to Signin page after a short delay (2 seconds)
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setState((prevState) => ({
        ...prevState,
        error: "Signup failed. Please try again.",
        success: "",
        loading: false,
      }));
    }
  };

  const { name, lastname, email, password, error, success, loading } = state;

  return (
    <div className="container">
      <h2 className="mt-5 mb-5">Signup</h2>

      {/* Display error message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Display success message */}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Show spinner if loading */}
      {loading && (
        <div className="text-center my-3">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      <form>
        <div className="form-group">
          <label className="text-muted">Name</label>
          <input
            onChange={handleChange("name")}
            type="text"
            className="form-control"
            value={name}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Lastname</label>
          <input
            onChange={handleChange("lastname")}
            type="text"
            className="form-control"
            value={lastname}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Email</label>
          <input
            onChange={handleChange("email")}
            type="email"
            className="form-control"
            value={email}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Password</label>
          <input
            onChange={handleChange("password")}
            type="password"
            className="form-control"
            value={password}
          />
        </div>
        <button onClick={clickSignup} className="btn btn-raised btn-primary" disabled={loading}>
          {loading ? (
            <span>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Redirecting...
            </span>
          ) : (
            "Signup"
          )}
        </button>
      </form>
    </div>
  );
};

export default Signup;
