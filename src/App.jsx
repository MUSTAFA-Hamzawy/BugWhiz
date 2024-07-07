import Projects from "./Components/Projects/Projects";
import Issues from "./Components/Issues/Issues";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import IssueDetails from "./Components/IssueDetails/IssueDetails";
import Profile from "./Components/Profile/Profile";
import Header from './Components/Header/Header';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PrivateRoute from "./PrivateRoute";
import axios from "axios";

function App() {
  const [userState, setUserState] = useState(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      return { token };
    }
    return {};
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (userState.token && !userState.userData) {
        try {
          const userProfileRes = await axios.get("http://51.20.81.93/api/user/profile", {
            headers: {
              "Authorization": `Bearer ${userState.token}`
            }
          });
          setUserState(prevState => ({
            ...prevState,
            userData: userProfileRes.data
          }));
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
    fetchUserProfile();
  }, [userState.token]);

  console.log('App User State:', userState); // Verify this contains user data after login

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/projects" replace />} />
          <Route
            path="/projects"
            element={
              <PrivateRoute userState={userState}>
                <>
                  <Projects userState={userState}/>
                </>
              </PrivateRoute>
            }
          />
          <Route
            path="/issues"
            element={
              <PrivateRoute userState={userState}>
                <>
                  <Header userState={userState} />
                  <Issues />
                </>
              </PrivateRoute>
            }
          />
          <Route
            path="/issueDetails"
            element={
              <PrivateRoute userState={userState}>
                <>
                  <Header userState={userState} />
                  <IssueDetails userState={userState}/>
                </>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute userState={userState}>
                <>
                  <Header userState={userState} />
                  <Profile userState={userState} setUserState={setUserState}/>
                </>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login setUserState={setUserState} />} />
          <Route path="/signup" element={<Register />} />
          <Route
            path="*"
            element={
              userState.token ? (
                <Navigate to="/projects" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
