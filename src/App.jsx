import Projects from "./Components/Projects/Projects";
import Issues from "./Components/Issues/Issues";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import IssueDetails from "./Components/IssueDetails/IssueDetails";
import Profile from "./Components/Profile/Profile";
import Layout from "./Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

function App() {
  const [userstate, setUserState] = useState({});
  
  return (
    <div className="App">
      <Router>
        <Layout>
          <Routes>
            <Route
              path="/"
              element={
                <Projects/>
              }
            ></Route>
            <Route
              path="/projects"
              element={
                <Projects/>
              }
            ></Route>
            <Route
              path="/issues"
              element={
                <Issues />
              }
            ></Route>
            <Route
              path="/issueDetails"
              element={
                <IssueDetails/>
              }
            ></Route>
            <Route
              path="/profile"
              element={
                <Profile/>
              }
            ></Route>
            <Route
              path="/login"
              element={<Login setUserState={setUserState} />}
            ></Route>
            <Route path="/signup" element={<Register />}></Route>
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
