import Projects from "./Components/Projects/Projects";
import Issues from "./Components/Issues/Issues";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import IssueDetails from "./Components/IssueDetails/IssueDetails";
import Profile from "./Components/Profile/Profile";
import Header from './Components/Header/Header';
import Analytics from './Components/Analytics/Analytics'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PrivateRoute from "./PrivateRoute";
import axios from "axios";

const data = {
  totalTickets: 50,
  ticketStatus: {
    todo: 25,
    progress: 15,
    done: 10,
  },
  ticketPriority: {
    P1: 10,
    P2: 5,
    P3: 5,
    P4: 15,
    P5: 15,
  },
  ticketCategory: {
    Frontend: 15,
    Documentation: 10,
    Security: 15,
  },
  developers: [
    {
      _id: '667b1168c906668c01ae611d',
      fullName: 'Karim Mohamed',
      ticketsAssigned: 13,
      todo: 7,
      progress: 5,
      done: 1,
    },
    {
      _id: '668002a4095371defae331cf',
      fullName: 'Mustafa Mahmoud',
      ticketsAssigned: 8,
      todo: 5,
      progress: 2,
      done: 1,
    },
  ],
};

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
          const userProfileRes = await axios.get(`${process.env.REACT_APP_BUGWHIZ_API_URL}/api/user/profile`, {
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

  console.log('App User State:', userState); 

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
          <Route
            path="/analytics"
            element={
              <PrivateRoute userState={userState}>
                <>
                  <Header userState={userState} />
                  <Analytics data={data}/>
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
