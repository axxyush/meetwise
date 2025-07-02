import "./App.css";
import Logs from "./components/Logs";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Sidebar from "./components/Siderbar";
import NewMeeting from "./components/NewMeeting";
import MeetingDetail from "./components/MeetingDetail";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <div className="d-flex">
          <Sidebar />
          <div className="flex-grow-1">
            <Navbar />
            <div className="p-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/new-meeting" element={<NewMeeting />} />
                <Route path="/meeting/:id" element={<MeetingDetail />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
