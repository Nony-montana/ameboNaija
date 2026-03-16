import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";
import {
    FaUsers, FaNewspaper, FaComment, FaClock,
    FaCheckCircle, FaTimesCircle, FaHourglass,
    FaChartBar, FaUserShield, FaEdit
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const AdminOverview = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.roles !== "admin") {
            navigate("/");
            return;
        }
        const fetchStats = async () => {
            try {
                const res = await API.get("/admin/stats");
                setStats(res.data.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <Spinner />;

    const { totals, categoryBreakdown, recentPosts, recentUsers } = stats;

    const statCards = [
        { label: "Total Posts",     value: totals.posts,     icon: <FaNewspaper />,   color: "#16a34a", bg: "#f0fdf4" },
        { label: "Total Users",     value: totals.users,     icon: <FaUsers />,       color: "#2563eb", bg: "#eff6ff" },
        { label: "Total Comments",  value: totals.comments,  icon: <FaComment />,     color: "#7c3aed", bg: "#f5f3ff" },
        { label: "Pending Review",  value: totals.pending,   icon: <FaHourglass />,   color: "#d97706", bg: "#fffbeb" },
        { label: "Published",       value: totals.published, icon: <FaCheckCircle />, color: "#16a34a", bg: "#f0fdf4" },
        { label: "Rejected",        value: totals.rejected,  icon: <FaTimesCircle />, color: "#dc2626", bg: "#fff5f5" },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case "published": return { bg: "#d4edda", color: "#155724" };
            case "pending":   return { bg: "#fff3cd", color: "#856404" };
            case "draft":     return { bg: "#e2e3e5", color: "#383d41" };
            case "rejected":  return { bg: "#f8d7da", color: "#721c24" };
            default:          return { bg: "#e2e3e5", color: "#383d41" };
        }
    };

    // Find max category count for progress bar scaling
    const maxCount = Math.max(...categoryBreakdown.map((c) => c.count), 1);

    return (
        <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
            <div className="container py-5">

                {/* HEADER */}
                <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap">
                    <div>
                        <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
                            <MdDashboard color="var(--green)" /> Admin Overview
                        </h4>
                        <p style={{ color: "var(--gray)", fontSize: "14px" }} className="mb-0">
                            Welcome back, {user?.firstName}
                        </p>
                    </div>
                    <Link
                        to="/dashboard/pending"
                        className="btn btn-sm fw-semibold"
                        style={{ backgroundColor: "var(--green)", color: "white", fontSize: "13px" }}
                    >
                        Review Pending ({totals.pending})
                    </Link>
                </div>

                {/* STAT CARDS */}
                <div className="row g-3 mb-4">
                    {statCards.map((card) => (
                        <div key={card.label} className="col-6 col-md-4 col-lg-2">
                            <div className="bg-white rounded shadow-sm p-3 h-100 text-center">
                                <div className="mb-2" style={{ fontSize: "24px", color: card.color }}>
                                    {card.icon}
                                </div>
                                <h4 className="fw-bold mb-0" style={{ color: card.color }}>{card.value}</h4>
                                <p className="mb-0" style={{ fontSize: "12px", color: "var(--gray)" }}>{card.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row g-4">

                    {/* CATEGORY BREAKDOWN */}
                    <div className="col-lg-5">
                        <div className="bg-white rounded shadow-sm p-4 h-100">
                            <h6 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                <FaChartBar color="var(--green)" /> Posts by Category
                            </h6>
                            {categoryBreakdown.length === 0 && (
                                <p style={{ color: "var(--gray)", fontSize: "14px" }}>No posts yet</p>
                            )}
                            {categoryBreakdown.map((cat) => (
                                <div key={cat._id} className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <span className="text-capitalize fw-semibold" style={{ fontSize: "13px" }}>
                                            {cat._id}
                                        </span>
                                        <span className="fw-bold" style={{ fontSize: "13px", color: "var(--green)" }}>
                                            {cat.count}
                                        </span>
                                    </div>
                                    {/* PROGRESS BAR */}
                                    <div style={{ backgroundColor: "#f3f4f6", borderRadius: "99px", height: "8px", overflow: "hidden" }}>
                                        <div style={{
                                            width: `${(cat.count / maxCount) * 100}%`,
                                            backgroundColor: "var(--green)",
                                            height: "100%",
                                            borderRadius: "99px",
                                            transition: "width 0.4s ease"
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RECENT POSTS */}
                    <div className="col-lg-7">
                        <div className="bg-white rounded shadow-sm p-4 h-100">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                                    <FaNewspaper color="var(--green)" /> Recent Posts
                                </h6>
                                <Link to="/admin/posts" style={{ fontSize: "13px", color: "var(--green)" }}>
                                    View all →
                                </Link>
                            </div>
                            {recentPosts.map((post) => {
                                const s = getStatusStyle(post.status);
                                return (
                                    <div key={post._id} className="d-flex align-items-center justify-content-between mb-3 pb-3"
                                        style={{ borderBottom: "1px solid var(--border)" }}>
                                        <div className="overflow-hidden me-2">
                                            <p className="mb-0 fw-semibold" style={{ fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {post.title}
                                            </p>
                                            <small style={{ color: "var(--gray)", fontSize: "11px" }}>
                                                By {post.author?.firstName} {post.author?.lastName} · {post.category}
                                            </small>
                                        </div>
                                        <span className="text-capitalize fw-semibold flex-shrink-0"
                                            style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "20px", backgroundColor: s.bg, color: s.color }}>
                                            {post.status}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RECENT USERS */}
                    <div className="col-12">
                        <div className="bg-white rounded shadow-sm p-4">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                                    <FaUsers color="var(--green)" /> Recent Users
                                </h6>
                                <Link to="/admin/users" style={{ fontSize: "13px", color: "var(--green)" }}>
                                    View all →
                                </Link>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead style={{ backgroundColor: "var(--light-green)" }}>
                                        <tr>
                                            <th style={{ fontSize: "12px", color: "var(--green)", padding: "10px 14px" }}>Name</th>
                                            <th style={{ fontSize: "12px", color: "var(--green)" }}>Email</th>
                                            <th style={{ fontSize: "12px", color: "var(--green)" }}>Role</th>
                                            <th style={{ fontSize: "12px", color: "var(--green)" }}>Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentUsers.map((u) => (
                                            <tr key={u._id}>
                                                <td style={{ fontSize: "13px", padding: "10px 14px" }}>
                                                    <span className="d-flex align-items-center gap-2">
                                                        {u.roles === "admin" && <FaUserShield color="var(--green)" size={13} />}
                                                        {u.firstName} {u.lastName}
                                                    </span>
                                                </td>
                                                <td style={{ fontSize: "13px", color: "var(--gray)" }}>{u.email}</td>
                                                <td>
                                                    <span className="text-capitalize fw-semibold" style={{
                                                        fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
                                                        backgroundColor: u.roles === "admin" ? "#f0fdf4" : "#f3f4f6",
                                                        color: u.roles === "admin" ? "var(--green)" : "var(--gray)"
                                                    }}>
                                                        {u.roles}
                                                    </span>
                                                </td>
                                                <td style={{ fontSize: "12px", color: "var(--gray)" }}>
                                                    <FaClock size={10} /> {new Date(u.createdAt).toLocaleDateString("en-NG")}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminOverview;