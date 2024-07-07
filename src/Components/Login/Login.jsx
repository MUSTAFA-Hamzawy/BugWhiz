import React, { useState } from "react";
import styles from "./Login.module.css";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import HelmetComponent from '../../HelmetComponent';

const Login = ({ setUserState }) => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(""); // New state for login error message
  const [users, setUsers] = useState({
    emailOrUsername: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUsers({
      ...users,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://51.20.81.93/api/user/login/", users, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res.data)
      const { token } = res.data;
      localStorage.setItem("authToken", token);

      const userProfileRes = await axios.get("http://51.20.81.93/api/user/profile", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      console.log(userProfileRes.data);

      localStorage.setItem("userId", userProfileRes.data._id);
      setUserState({ token, userData: userProfileRes.data });

      navigate("/projects", { replace: true }); // Redirect to projects page
    } catch (error) {
      if (error.response) {
        setLoginError(error.response.data.errorDescription); // Set the error message from backend
        console.log(error.response.data.errorDescription);
      } else if (error.request) {
        setLoginError("Network error. Please try again.");
        console.log("Network error. Please try again.");
      } else {
        setLoginError("An unexpected error occurred.");
        console.log("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <HelmetComponent title="Login - BugWhiz" description="Login" />
      <div className={styles.login}>
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <input
            type="text"
            name="emailOrUsername"
            id="emailOrUsername"
            placeholder="Email or Username"
            onChange={handleInputChange}
            value={users.emailOrUsername}
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            onChange={handleInputChange}
            value={users.password}
          />
          {loginError && <p className={styles.error}>{loginError}</p>}
          <button type="submit" className={styles.buttonCommon} style={{cursor:'pointer'}}>
            Login
          </button>
        </form>
        <div>
          <NavLink to="/signup" className={styles.signupLink}>
            Not yet registered? Register Now
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Login;
