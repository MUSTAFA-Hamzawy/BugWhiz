import React, { useState } from "react";
import styles from "./Register.module.css"; // Importing CSS module
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import HelmetComponent from '../../HelmetComponent';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    jobTitle: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    try {
      const res = await axios.post("http://51.20.81.93:80/api/user/register/", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      navigate("/login", { replace: true });
    } catch (error) {
      if (error.response) {
        setFieldErrors(error.response.data.errorDescription); // Set field-specific error messages from backend
        console.log('Response error:', error.response.data.errorDescription);
      } else if (error.request) {
        setFieldErrors({ general: "Network error. Please try again." });
        console.log('Request error:', error.request);
      } else {
        setFieldErrors({ general: "An unexpected error occurred." });
        console.log('Error', error.message);
      }
      console.log('Error config:', error.config);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <HelmetComponent title="Sign UP - BugWhiz" description="Sign UP" />
      <div className={styles.register}>
        <form onSubmit={handleRegister}>
          <h1>Create your account</h1>
          <input
            type="text"
            name="fullName"
            id="fullName"
            placeholder="Full Name"
            onChange={handleInputChange}
            value={formData.fullName}
          />
          <p className={styles.error}>{fieldErrors.fullName}</p>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            onChange={handleInputChange}
            value={formData.username}
          />
          <p className={styles.error}>{fieldErrors.username}</p>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            onChange={handleInputChange}
            value={formData.email}
          />
          <p className={styles.error}>{fieldErrors.email}</p>
          <input
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            placeholder="Phone Number"
            onChange={handleInputChange}
            value={formData.phoneNumber}
          />
          <p className={styles.error}>{fieldErrors.phoneNumber}</p>
          <input
            type="text"
            name="jobTitle"
            id="jobTitle"
            placeholder="Job Title"
            onChange={handleInputChange}
            value={formData.jobTitle}
          />
          <p className={styles.error}>{fieldErrors.jobTitle}</p>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            onChange={handleInputChange}
            value={formData.password}
          />
          <p className={styles.error}>{fieldErrors.password}</p>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleInputChange}
            value={formData.confirmPassword}
          />
          <p className={styles.error}>{fieldErrors.confirmPassword}</p>
          <button className={styles.button_common} style={{ cursor: 'pointer' }}>
            Register
          </button>
        </form>
        {fieldErrors.general && <p className={styles.error}>{fieldErrors.general}</p>}
        <NavLink to="/login" className={styles.loginLink}>
          Already registered? Login
        </NavLink>
      </div>
    </div>
  );
};

export default Register;
