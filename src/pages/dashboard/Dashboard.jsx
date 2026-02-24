import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { FaPen, FaList, FaClock, FaUserShield } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";

const Dashboard = () => {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const params = useParams();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn]);

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <div className="container py-5">
        {/* WELCOME HEADER */}
        <div
          className="p-4 rounded mb-4 shadow-sm"
          style={{ backgroundColor: "var(--green)", color: "white" }}
        >
          <h4 className="fw-bold mb-1">Welcome back, {user?.firstName}! 👋</h4>
          <p className="mb-0" style={{ fontSize: "14px", color: "#ccffcc" }}>
            {user?.roles === "admin"
              ? "You have full admin access to Amebo Naija"
              : "Manage your posts and write new gist from here"}
          </p>
        </div>

        {/* DASHBOARD CARDS */}
        <div className="row g-4">
          {/* WRITE A POST */}
          <div className="col-md-4">
            <Link to="/dashboard/create" style={{ textDecoration: "none" }}>
              <div
                className="p-4 rounded shadow-sm h-100 bg-white d-flex flex-column align-items-center text-center"
                style={{
                  border: "2px solid var(--light-green)",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "var(--green)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--light-green)")
                }
              >
                <div
                  className="mb-3 d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "var(--light-green)",
                  }}
                >
                  <FaPen size={24} color="var(--green)" />
                </div>
                <h6 className="fw-bold" style={{ color: "var(--text)" }}>
                  Write a Post
                </h6>
                <p style={{ fontSize: "13px", color: "var(--gray)" }}>
                  Create and publish a new article or gist
                </p>
              </div>
            </Link>
          </div>

          {/* MY POSTS */}
          <div className="col-md-4">
            <Link to="/dashboard/my-posts" style={{ textDecoration: "none" }}>
              <div
                className="p-4 rounded shadow-sm h-100 bg-white d-flex flex-column align-items-center text-center"
                style={{
                  border: "2px solid var(--light-green)",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "var(--green)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--light-green)")
                }
              >
                <div
                  className="mb-3 d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "var(--light-green)",
                  }}
                >
                  <FaList size={24} color="var(--green)" />
                </div>
                <h6 className="fw-bold" style={{ color: "var(--text)" }}>
                  My Posts
                </h6>
                <p style={{ fontSize: "13px", color: "var(--gray)" }}>
                  View and manage all your published posts
                </p>
              </div>
            </Link>
          </div>

          <div className="col-md-4">
            <Link to="/dashboard/settings" style={{ textDecoration: "none" }}>
              <div
                className="p-4 rounded shadow-sm h-100 bg-white d-flex flex-column align-items-center text-center"
                style={{
                  border: "2px solid var(--light-green)",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "var(--green)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--light-green)")
                }
              >
                <div
                  className="mb-3 d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "var(--light-green)",
                  }}
                >
                  <CiSettings size={24} color="var(--green)" />
                </div>
                <h6 className="fw-bold" style={{ color: "var(--text)" }}>
                  Settings
                </h6>
                <p style={{ fontSize: "13px", color: "var(--gray)" }}>
                  Manage your account settings and preferences
                </p>
              </div>
            </Link>
          </div>

          {/* ADMIN ONLY - PENDING POSTS */}
          {user?.roles === "admin" && (
            <div className="col-md-4">
              <Link to="/dashboard/pending" style={{ textDecoration: "none" }}>
                <div
                  className="p-4 rounded shadow-sm h-100 bg-white d-flex flex-column align-items-center text-center"
                  style={{
                    border: "2px solid #fff3cd",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "var(--gold)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "#fff3cd")
                  }
                >
                  <div
                    className="mb-3 d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: "60px",
                      height: "60px",
                      backgroundColor: "#fff3cd",
                    }}
                  >
                    <FaUserShield size={24} color="#cc8800" />
                  </div>
                  <h6 className="fw-bold" style={{ color: "var(--text)" }}>
                    Admin Panel
                  </h6>
                  <p style={{ fontSize: "13px", color: "var(--gray)" }}>
                    Review and approve pending posts
                  </p>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
