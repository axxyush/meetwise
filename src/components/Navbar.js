import React from "react";

function Navbar() {
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
            <a className="navbar-brand col-lg-3 me-0 font" href="/">
              Meet Wise
            </a>{" "}
            <ul className="navbar-nav col-lg-6 justify-content-lg-center">
              {" "}
              <li className="nav-item">
                {" "}
                <a
                  className="nav-link active font"
                  aria-current="page"
                  href="/"
                >
                  Home
                </a>{" "}
              </li>{" "}
              <li className="nav-item">
                {" "}
                <a
                  className="nav-link active font"
                  aria-current="page"
                  href="/logs"
                >
                  Logs
                </a>{" "}
              </li>{" "}
              <li className="nav-item dropdown">
                {" "}
                <a
                  className="nav-link dropdown-toggle font"
                  href="#"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Create
                </a>{" "}
                <ul className="dropdown-menu dropdown-menu-dark ">
                  {" "}
                  <li>
                    <a className="dropdown-item font" href="#">
                      Meeting
                    </a>
                  </li>{" "}
                  <li>
                    <a className="dropdown-item font" href="#">
                      Meeting Group
                    </a>
                  </li>{" "}
                </ul>{" "}
              </li>{" "}
              <li className="nav-item">
                {" "}
                <a className="nav-link font" href="#">
                  About
                </a>{" "}
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
