import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
    FaUsers, FaNewspaper, FaChartBar,
    FaHourglass, FaUserShield, FaTachometerAlt
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const adminNavItems = [
    {
        to: "/admin/overview",
        icon: <FaChartBar size={24} />,
        label: "Overview",
        description: "Stats, categories & recent activity",
        color: "#16a34a",
        bg: "#f0fdf4",
        border: "#bbf7d0",
    },
    {
        to: "/admin/posts",
        icon: <FaNewspaper size={24} />,
        label: "Posts Management",
        description: "View, approve, reject & delete all posts",
        color: "#2563eb",
        bg: "#eff6ff",
        border: "#bfdbfe",
    },
    {
        to: "/admin/users",
        icon: <FaUsers size={24} />,
        label: "Users Management",
        description: "Manage roles, deactivate or delete users",
        color: "#7c3aed",
        bg: "#f5f3ff",
        border: "#ddd6fe",
    },
    {
        to: "/dashboard/pending",
        icon: <FaHourglass size={24} />,
        label: "Pending Posts",
        description: "Review posts waiting for approval",
        color: "#d97706",
        bg: "#fffbeb",
        border: "#fde68a",
    },
];

const AdminDashboard = () => {
    const { user, isLoggedIn } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) { navigate("/login"); return; }
        if (user?.roles !== "admin") { navigate("/dashboard"); }
    }, [isLoggedIn]);

    return (
        <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
            <div className="container py-5">

                {/* HEADER */}
                <div
                    className="p-4 rounded mb-4 shadow-sm d-flex align-items-center justify-content-between flex-wrap gap-3"
                    style={{ backgroundColor: "#1a1a2e", color: "white" }}
                >
                    <div>
                        <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
                            <FaUserShield /> Admin Dashboard
                        </h4>
                        <p className="mb-0" style={{ fontSize: "14px", color: "#a0aec0" }}>
                            Welcome back, {user?.firstName}. You have full admin access.
                        </p>
                    </div>
                    <Link
                        to="/dashboard"
                        className="btn btn-sm fw-semibold"
                        style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)", fontSize: "13px" }}
                    >
                        ← User Dashboard
                    </Link>
                </div>

                {/* ADMIN NAV CARDS */}
                <div className="row g-4">
                    {adminNavItems.map((item) => (
                        <div key={item.to} className="col-md-6">
                            <Link to={item.to} style={{ textDecoration: "none" }}>
                                <div
                                    className="p-4 rounded shadow-sm h-100 bg-white d-flex align-items-center gap-4"
                                    style={{
                                        border: `2px solid ${item.border}`,
                                        transition: "all 0.2s ease",
                                        cursor: "pointer",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = item.color;
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = item.border;
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "";
                                    }}
                                >
                                    {/* ICON */}
                                    <div
                                        className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                                        style={{ width: "64px", height: "64px", backgroundColor: item.bg, color: item.color }}
                                    >
                                        {item.icon}
                                    </div>

                                    {/* TEXT */}
                                    <div>
                                        <h6 className="fw-bold mb-1" style={{ color: "var(--text)" }}>
                                            {item.label}
                                        </h6>
                                        <p className="mb-0" style={{ fontSize: "13px", color: "var(--gray)" }}>
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* ARROW */}
                                    <div className="ms-auto" style={{ color: item.color, fontSize: "18px", flexShrink: 0 }}>
                                        →
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;