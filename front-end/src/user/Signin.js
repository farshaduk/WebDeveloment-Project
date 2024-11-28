import React, { useState } from "react";
import Swal from "sweetalert2";
import { NavLink, useNavigate } from "react-router-dom";
import { signinUser, authenticate } from "../auth";
import "../assest/css/login.css"; // Custom CSS

const Signin = () => {
  const [state, setState] = useState({
    email: "",
    password: "",
    error: "",
    redirectTo: false,
    loading: false,
  });

  const navigate = useNavigate();

  const handleChange = (name) => (event) => {
    setState({ ...state, [name]: event.target.value, error: "" });
  };

  const clickSignin = async (event) => {
    event.preventDefault();
    setState((prevState) => ({ ...prevState, loading: true }));

    const { email, password } = state;
    const user = { email, password };

    try {
      const data = await signinUser(user);
      if (data.error) {
        setState((prevState) => ({
          ...prevState,
          error: data.error,
          loading: false,
        }));

        // Display error with SweetAlert
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.error,
        });
      } else {
        authenticate(data);
        setState((prevState) => ({
          ...prevState,
          redirectTo: true,
          loading: false,
        }));

        // Navigate to the homepage
        navigate("/");
      }
    } catch (error) {
      console.error("Error during Signin:", error);
      setState((prevState) => ({
        ...prevState,
        error: "Signin failed. Please try again.",
        loading: false,
      }));

      // Display network error with SweetAlert
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Signin failed. Please try again.",
      });
    }
  };

  const { email, password, loading } = state;

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-content text-center">
          <h1 className="mb-4">Welcome back!</h1>
          <div className="login-box mx-auto shadow">
            <h3 className="mb-3">Sign in</h3>
            <p className="mb-3">
              Don't have an account?{" "}
              <NavLink
                to="/signup"
                style={{
                  display: "inline",
                  color: "#0d6efd",
                  textDecoration: "none",
                  fontSize: "1rem",
                  lineHeight: "1.5",
                  cursor: "pointer",
                }}
              >
                Click here to sign up
              </NavLink>
            </p>
            <form>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  onChange={handleChange("email")}
                  placeholder="Email"
                  value={email}
                  required
                />
              </div>
              <div className="mb-3 position-relative">
                <input
                  type="password"
                  className="form-control"
                  onChange={handleChange("password")}
                  value={password}
                  placeholder="Password"
                  required
                />
              </div>
              <button
                disabled={loading}
                onClick={clickSignin}
                className="btn btn-primary w-100"
              >
                {loading ? (
                  <span>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>{" "}
                    Signing in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </form>
            <p className="mt-4 text-muted">©2024. All rights reserved</p>
          </div>
        </div>
      </div>
      <div className="login-footer bg-light text-center py-3">
        <div className="d-flex justify-content-center gap-3">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </div>
  );
};

export default Signin;
