// auth.js

// Signup Function
export const signup = async (user) => {
    try {   
      const response = await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
  
      const responseData = await response.json();
  
      if (response.status === 400 || response.status === 409) {
        return { error: responseData.error || responseData.message || "Validation error occurred" };
      }
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return responseData;
    } catch (error) {
      console.error("Network error:", error);
      return { error: "Network error. Please try again later." };
    }
  };
  
  // Signin Function
  export const signinUser = async (user) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/signin`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
  
      const responseData = await response.json();
  
      if (response.status === 400 || response.status === 409) {
        return { error: responseData.error || responseData.message || "Validation error occurred" };
      }
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return responseData;
    } catch (error) {
      console.error("Network error:", error);
      return { error: "Network error. Please try again later." };
    }
  };
  
  // Authenticate Function
  export const authenticate = (jwt) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("jwt", JSON.stringify(jwt));
    }
  };
  
  // Check if User is Authenticated
  export const IsAuthenticated = () => {
    if (typeof window === "undefined") {
      return false;
    }
    return localStorage.getItem("jwt") ? JSON.parse(localStorage.getItem("jwt")) : false;
  };
  
  // Signout Function
  export const signout = async (next) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("jwt");
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/signout`, {
        method: "GET",
      });
      await response.json();
      if (next) next();
    } catch (err) {
      console.error("Signout Error:", err);
    }
  };
  