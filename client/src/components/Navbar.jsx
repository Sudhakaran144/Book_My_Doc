import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/reducers/rootSlice";
import jwt_decode from "jwt-decode";
import "../styles/navbar.css";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(
    localStorage.getItem("token")
      ? jwt_decode(localStorage.getItem("token"))
      : ""
  );

  const logoutFunc = () => {
    dispatch(setUserInfo({}));
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [navigate]);

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <div className="navbar-logo">
          <NavLink to={"/"}>
            <span className="logo-text">MediSwift</span>
          </NavLink>
        </div>

        <div className="navbar-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="icon-close">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="icon-menu">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </div>

        <nav className={`navbar-menu ${mobileMenuOpen ? 'menu-open' : ''}`}>
          <ul className="navbar-links">
            <li className="nav-item">
              <NavLink to={"/"} className={({ isActive }) => isActive ? "active" : ""}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to={"/doctors"} className={({ isActive }) => isActive ? "active" : ""}>
                Doctors
              </NavLink>
            </li>
            {token && user.isAdmin && (
              <li className="nav-item">
                <NavLink to={"/dashboard/users"} className={({ isActive }) => isActive ? "active" : ""}>
                  Dashboard
                </NavLink>
              </li>
            )}
            {token && !user.isAdmin && (
              <>
                <li className="nav-item">
                  <NavLink to={"/appointments"} className={({ isActive }) => isActive ? "active" : ""}>
                    Appointments
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={"/notifications"} className={({ isActive }) => isActive ? "active" : ""}>
                    Notifications
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={"/applyfordoctor"} className={({ isActive }) => isActive ? "active" : ""}>
                    Apply for doctor
                  </NavLink>
                </li>
                <li className="nav-item">
                  <HashLink to={"/#contact"}>Contact Us</HashLink>
                </li>
                <li className="nav-item">
                  <NavLink to={"/profile"} className={({ isActive }) => isActive ? "active" : ""}>
                    Profile
                  </NavLink>
                </li>
              </>
            )}
          </ul>
          <div className="navbar-auth">
            {!token ? (
              <>
                <NavLink to={"/login"} className="btn-login">
                  Login
                </NavLink>
                <NavLink to={"/register"} className="btn-register">
                  Register
                </NavLink>
              </>
            ) : (
              <button className="btn-logout" onClick={logoutFunc}>
                Logout
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;