import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ userState, children }) => {
  return userState?.token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
