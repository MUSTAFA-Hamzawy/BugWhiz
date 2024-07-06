import React, { useState, useEffect } from "react";
import styles from "./Login.module.css";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import HelmetComponent from '../../HelmetComponent';

const Login = ({ setUserState }) => {
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
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

  const validateInputs = (values) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.emailOrUsername) {
      errors.emailOrUsername = "Email or Username is required";
    } else if (!emailRegex.test(values.emailOrUsername) && !/^\w+$/.test(values.emailOrUsername)) {
      errors.emailOrUsername = "Please enter a valid email address or username";
    }
    if (!values.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setValidationErrors(validateInputs(users));
    setHasSubmitted(true);
  };

  useEffect(() => {
    const loginUser = async () => {
      if (Object.keys(validationErrors).length === 0 && hasSubmitted) {
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

          setUserState({ token, userData: userProfileRes.data });

          navigate("/projects", { replace: true }); // Redirect to projects page
        } catch (error) {
          if (error.response) {
            console.log(users);
            console.log(error.response.data.message);
          } else if (error.request) {
            console.log("Network error. Please try again.");
          } else {
            console.log("An unexpected error occurred.");
          }
        }
      }
    };
    loginUser();
  }, [validationErrors, hasSubmitted, setUserState, navigate, users]);

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
          <p className={styles.error}>{validationErrors.emailOrUsername}</p>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            onChange={handleInputChange}
            value={users.password}
          />
          <p className={styles.error}>{validationErrors.password}</p>
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
