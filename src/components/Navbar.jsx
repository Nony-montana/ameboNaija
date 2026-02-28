import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { FaSearch, FaUserCircle, FaPen } from "react-icons/fa";
import { MdDashboard, MdLogout } from "react-icons/md";
import { useState } from "react";
import logo from "../assets/Logo.png";

const Navbar = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  const tabs = ["news", "gist", "gossip", "entertainment", "lifestyle", "sports"];

  const activeTab = location.pathname.split("/category/")[1] || "";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`);
      setSearchTerm("");
    }
  };

  return (
    <>
      {/* TOP BAR */}
      <div style={{ backgroundColor: "var(--green)", color: "white" }}>
        <div className="container d-flex justify-content-between align-items-center py-1">
          <small style={{ fontSize: "12px" }}>
            🇳🇬 Nigeria's #1 Gist & Entertainment Blog
          </small>
          <small style={{ fontSize: "12px" }}>
            {new Date().toDateString()}
          </small>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
        <div className="container">
          {/* LOGO */}
          <Link className="navbar-brand" to="/">
            <img
              src={logo}
              alt="logo"
              style={{ width: "120px", objectFit: "contain" }}
            />
          </Link>

          {/* MOBILE TOGGLE */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            {/* SEARCH BAR */}
            <form
              className="d-flex mx-auto my-2 my-lg-0"
              style={{ width: "300px" }}
              onSubmit={handleSearch}
            >
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search gist, news, gossip..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ borderColor: "var(--green)" }}
                />
                <button
                  className="btn"
                  type="submit"
                  style={{
                    backgroundColor: "var(--green)",
                    color: "white",
                  }}
                >
                  <FaSearch />
                </button>
              </div>
            </form>

            {/* RIGHT SIDE - AUTH BUTTONS OR USER MENU */}
            <div className="d-flex align-items-center gap-2 justify-content-center">
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/login"
                    className="btn btn-outline-success btn-sm"
                    style={{
                      borderColor: "var(--green)",
                      color: "var(--green)",
                    }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-sm text-white"
                    style={{ backgroundColor: "var(--green)" }}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <div className="dropdown">
                  <button
                    className="btn dropdown-toggle d-flex align-items-center gap-2"
                    type="button"
                    data-bs-toggle="dropdown"
                    style={{ color: "var(--green)", fontWeight: "600" }}
                  >
                    <FaUserCircle size={22} />
                    {user?.firstName}
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end shadow">
                    <li>
                      <Link
                        className="dropdown-item d-flex align-items-center gap-2"
                        to="/dashboard"
                      >
                        <MdDashboard /> Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item d-flex align-items-center gap-2"
                        to="/dashboard/create"
                      >
                        <FaPen /> Write a Post
                      </Link>
                    </li>
                    {user?.roles === "admin" && (
                      <li>
                        <Link
                          className="dropdown-item d-flex align-items-center gap-2"
                          to="/dashboard/pending"
                        >
                          <MdDashboard /> Admin Panel
                        </Link>
                      </li>
                    )}
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item d-flex align-items-center gap-2 text-danger"
                        onClick={handleLogout}
                      >
                        <MdLogout /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* CATEGORY NAV BAR */}
      <div style={{ backgroundColor: "var(--gold)" }}>
        <div className="container">
          <ul className="nav justify-content-center py-1" >
            {tabs.map((cat) => (
              <li className="nav-item" key={cat}>
                <Link
                  to={`/category/${cat}`}
                  className="nav-link fw-semibold text-capitalize"
                  style={{
                    fontSize: "14px",
                    color: activeTab === cat ? "var(--green)" : "var(--text)",
                    transition: "all 0.2s ease"
                  }}
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
