import React, { useState } from "react";

function Home() {
  const [activeLink, setActiveLink] = useState("");

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
  };
  return (
    <>
      <div
        className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark font"
        style={{ width: 250, height: "92vh" }}
      >
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <a
              href="#"
              onClick={() => handleLinkClick("Research")}
              className={`nav-link text-white ${
                activeLink === "Research" ? "selected" : ""
              }`}
              aria-current="page"
            >
              Research
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={() => handleLinkClick("CASet")}
              className={`nav-link text-white ${
                activeLink === "CASet" ? "selected" : ""
              }`}
            >
              CASet
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={() => handleLinkClick("Aryan")}
              className={`nav-link text-white ${
                activeLink === "Aryan" ? "selected" : ""
              }`}
            >
              Aryan
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={() => handleLinkClick("MeetWise")}
              className={`nav-link text-white ${
                activeLink === "MeetWise" ? "selected" : ""
              }`}
            >
              MeetWise
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={() => handleLinkClick("Marvel")}
              className={`nav-link text-white ${
                activeLink === "Marvel" ? "selected" : ""
              }`}
            >
              <i className="fa-solid fa-folder m-1"></i> Marvel
            </a>
          </li>

          <li>
            <a
              href="#"
              onClick={() => handleLinkClick("Pehcharm")}
              className={`nav-link text-white ${
                activeLink === "Pehcharm" ? "selected" : ""
              }`}
            >
              Pehcharm
            </a>
          </li>
        </ul>

        <hr />
        <div className="dropdown">
          <a
            href="#"
            className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src="https://github.com/axxyush.png"
              alt=""
              width={32}
              height={32}
              className="rounded-circle me-2"
            />
            <strong>Ayush</strong>
          </a>
          <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
            <li>
              <a className="dropdown-item" href="#">
                New Meeting
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                New Group
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Sign out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Home;
