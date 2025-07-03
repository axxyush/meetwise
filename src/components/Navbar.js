import React from "react";
import { useNavigate, Link } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const userEmail = localStorage.getItem("email");

  const handleNewMeeting = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/new-meeting");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <nav
        className="navbar navbar-dark bg-dark  navbar-expand-lg"
        aria-label="Thirteenth navbar example"
      >
        {" "}
        <div className="container-fluid">
          {" "}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarsExample11"
            aria-controls="navbarsExample11"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            {" "}
            <span className="navbar-toggler-icon" />{" "}
          </button>{" "}
          <div
            className="collapse navbar-collapse d-lg-flex"
            id="navbarsExample11"
          >
            {" "}
            <ul className="navbar-nav col-lg-6 justify-content-lg-center">
              {" "}
              <li className="nav-item">
                {" "}
                <Link
                  className="nav-link active font"
                  aria-current="page"
                  to="/"
                >
                  Home
                </Link>{" "}
              </li>{" "}
            
              <li className="nav-item dropdown">
                {" "}
                <button
                  className="nav-link dropdown-toggle font btn btn-link border-0 p-0"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Create
                </button>{" "}
                <ul className="dropdown-menu dropdown-menu-dark ">
                  {" "}
                  <li>
                    <button className="dropdown-item font btn btn-link border-0 p-0" onClick={handleNewMeeting}>
                      New Meeting
                    </button>
                  </li>{" "}
                  <li>
                    <button className="dropdown-item font btn btn-link border-0 p-0" disabled>
                      New Group
                    </button>
                  </li>{" "}
                </ul>{" "}
              </li>{" "}
              <li className="nav-item">
                {" "}
                <button className="nav-link font btn btn-link border-0 p-0">
                  About
                </button>{" "}
              </li>{" "}
            </ul>{" "}
            <div className="d-lg-flex col-lg-3 justify-content-lg-end">
              {" "}
              {isLoggedIn ? (
                <div className="d-flex align-items-center gap-2">
                  <span className="text-white small">{userEmail}</span>
                  <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Log Out</button>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <button className="btn btn-outline-light btn-sm" onClick={() => navigate("/login")}>Log In</button>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate("/signup")}>Sign Up</button>
                </div>
              )}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </nav>
    </>
  );
}

export default Navbar;
