import React from "react";
import { useNavigate, Link } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleNewMeeting = () => {
    navigate("/new-meeting");
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
            <Link className="navbar-brand col-lg-3 me-0 font" to="/">
              Meet Wise
            </Link>{" "}
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
                    <button className="dropdown-item font btn btn-link border-0 p-0">
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
              <div
                aria-label="User Login Button"
                tabIndex={0}
                role="button"
                className="user-profile"
              >
                <div className="user-profile-inner">
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <g data-name="Layer 2" id="Layer_2">
                      <path d="m15.626 11.769a6 6 0 1 0 -7.252 0 9.008 9.008 0 0 0 -5.374 8.231 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 9.008 9.008 0 0 0 -5.374-8.231zm-7.626-4.769a4 4 0 1 1 4 4 4 4 0 0 1 -4-4zm10 14h-12a1 1 0 0 1 -1-1 7 7 0 0 1 14 0 1 1 0 0 1 -1 1z" />
                    </g>
                  </svg>
                  <p className="m-0 font">Sign Up</p>
                </div>
              </div>
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </nav>
    </>
  );
}

export default Navbar;
