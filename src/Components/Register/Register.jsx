import React, { useEffect, useState } from "react";
import styles from "./Register.module.css"; // Importing CSS module
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import HelmetComponent from '../../HelmetComponent';

const Register = () => {
  const navigate = useNavigate();

  const [validationErrors, setValidationErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    jobTitle: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateInputs = (values) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const phoneRegex = /^(010|011|012|015)\d{8}$/;

    if (!values.fullName) {
      errors.fullName = "Full Name is required";
    }
    if (!values.username) {
      errors.username = "Username is required";
    }
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }
    if (!values.phoneNumber) {
      errors.phoneNumber = "Phone Number is required";
    } else if (!phoneRegex.test(values.phoneNumber)) {
      errors.phoneNumber = "This is not a valid phone number format!";
    }
    if (!values.jobTitle) {
      errors.jobTitle = "Job Title is required";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 4) {
      errors.password = "Password must be more than 4 characters";
    } else if (values.password.length > 10) {
      errors.password = "Password cannot exceed more than 10 characters";
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Confirm password and password should be the same";
    }
    return errors;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setValidationErrors(validateInputs(formData));
    setHasSubmitted(true);
  };

  useEffect(() => {
    if (Object.keys(validationErrors).length === 0 && hasSubmitted) {
      axios.post("http://51.20.81.93:80/api/user/register/", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        navigate("/login", { replace: true });
      })
      .catch((error) => {
        if (error.response) {
          console.log('Response error:', error.response.data);
        } else if (error.request) {
          console.log('Request error:', error.request);
        } else {
          console.log('Error', error.message);
        }
        console.log('Error config:', error.config);
      });
    }
  }, [validationErrors]);

  return (
    <div className={styles.registerContainer}>
      <HelmetComponent title="Sign UP - BugWhiz" description="Sign UP" />
      <div className={styles.register}>
        <form>
          <h1>Create your account</h1>
          <input
            type="text"
            name="fullName"
            id="fullName"
            placeholder="Full Name"
            onChange={handleInputChange}
            value={formData.fullName}
          />
          <p className={styles.error}>{validationErrors.fullName}</p>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            onChange={handleInputChange}
            value={formData.username}
          />
          <p className={styles.error}>{validationErrors.username}</p>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            onChange={handleInputChange}
            value={formData.email}
          />
          <p className={styles.error}>{validationErrors.email}</p>
          <input
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            placeholder="Phone Number"
            onChange={handleInputChange}
            value={formData.phoneNumber}
          />
          <p className={styles.error}>{validationErrors.phoneNumber}</p>
          <input
            type="text"
            name="jobTitle"
            id="jobTitle"
            placeholder="Job Title"
            onChange={handleInputChange}
            value={formData.jobTitle}
          />
          <p className={styles.error}>{validationErrors.jobTitle}</p>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            onChange={handleInputChange}
            value={formData.password}
          />
          <p className={styles.error}>{validationErrors.password}</p>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleInputChange}
            value={formData.confirmPassword}
          />
          <p className={styles.error}>{validationErrors.confirmPassword}</p>
          <button className={styles.button_common} onClick={handleRegister} style={{cursor:'pointer'}}>
            Register
          </button>
        </form>
        <NavLink to="/login" className={styles.loginLink}>
          Already registered? Login
        </NavLink>
      </div>
    </div>
  );
};

export default Register;
