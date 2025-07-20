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
                  MeetWise
                </Link>{" "}
              </li>{" "}
              <li className="nav-item">
                {" "}
                <Link
                  className="nav-link active font"
                  aria-current="page"
                  to="/create"
                >
                  Create
                </Link>{" "}
              </li>{" "}
              {/* <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Create
                </a>
                <ul className="dropdown-menu dropdown-menu-dark">
                  <li>
                    <a className="dropdown-item" href="#">
                      Action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </li>
                </ul>
              </li> */}
              <li className="nav-item">
                <a className="nav-link" href="#">
                  About
                </a>
              </li>
            </ul>{" "}
            <div className="d-lg-flex col-lg-3 justify-content-lg-end">
              {" "}
              {isLoggedIn ? (
                <div className="d-flex align-items-center gap-2">
                  <span className="text-white small">{userEmail}</span>
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <Link
                    aria-label="User Login Button"
                    tabIndex={0}
                    role="button"
                    className="user-profile"
                    to="/login"
                  >
                    <div className="user-profile-inner">
                      <p className="m-0 font">Log In</p>
                    </div>
                  </Link>
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
