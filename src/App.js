import "./App.css";
import Logs from "./components/Logs";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Sidebar from "./components/Siderbar";
import NewMeeting from "./components/NewMeeting";
import MeetingDetail from "./components/MeetingDetail";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("token");
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
  const isLoggedIn = !!localStorage.getItem("token");
  return (
    <>
      <Router>
        <div className="d-flex">
          <Sidebar />
          <div className="flex-grow-1">
            <Navbar />
            <div className="p-4">
              <Routes>
                <Route path="/" element={isLoggedIn ? <Home /> : <Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/new-meeting" element={<PrivateRoute><NewMeeting /></PrivateRoute>} />
                <Route path="/meeting/:id" element={<PrivateRoute><MeetingDetail /></PrivateRoute>} />
                <Route path="/logs" element={<PrivateRoute><Logs /></PrivateRoute>} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
