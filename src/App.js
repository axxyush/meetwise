import "./App.css";
import ChatLog from "./components/ChatLog";
import Home from "./components/Home";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Home />
        <ChatLog />
      </div>
    </>
  );
}

export default App;
