import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";
import MessageToast from "../../components/ui/MessageToast";
import {
    FaUsers, FaUserShield, FaTrash, FaSearch,
    FaBan, FaCheckCircle, FaClock, FaUserCog
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { BiInfoCircle } from "react-icons/bi";
import { TbTrash } from "react-icons/tb";

const AdminUsers = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    // Delete modal state
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [deleteUserName, setDeleteUserName] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        if (!user || user.roles !== "admin") { navigate("/"); return; }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await API.get("/admin/users", {
                params: { page, limit: 15, search }
            });
            setUsers(res.data.data);
            setTotalPages(res.data.totalPages);
            setTotal(res.data.total);
        } catch (err) {
            showMessage("Failed to fetch users", "error");
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => setMessage(""), 4000);
    };

    // ── MAKE / REMOVE ADMIN ──
    const handleRoleChange = async (userId, currentRole) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        try {
            const res = await API.put(`/admin/users/${userId}/role`, { roles: newRole });
            setUsers(users.map((u) => u._id === userId ? { ...u, roles: newRole } : u));
            showMessage(res.data.message, "success");
        } catch (err) {
            showMessage(err.response?.data?.message || "Failed to update role", "error");
        }
    };

    // ── DEACTIVATE / REACTIVATE ──
    const handleStatusChange = async (userId, currentStatus) => {
        const newStatus = !currentStatus;
        try {
            const res = await API.put(`/admin/users/${userId}/status`, { isActive: newStatus });
            setUsers(users.map((u) => u._id === userId ? { ...u, isActive: newStatus } : u));
            showMessage(res.data.message, "success");
        } catch (err) {
            showMessage(err.response?.data?.message || "Failed to update status", "error");
        }
    };

    // ── DELETE ──
    const openDeleteModal = (userId, name) => {
        setDeleteUserId(userId);
        setDeleteUserName(name);
    };

    const handleDeleteUser = async () => {
        setDeleteLoading(true);
        try {
            await API.delete(`/admin/users/${deleteUserId}`);
            setUsers(users.filter((u) => u._id !== deleteUserId));
            setTotal(total - 1);
            showMessage("User deleted successfully", "success");
            setDeleteUserId(null);
            document.getElementById("closeUserDeleteModal").click();
        } catch (err) {
            showMessage(err.response?.data?.message || "Failed to delete user", "error");
        } finally {
            setDeleteLoading(false);
        }
    };

    // Search with debounce
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    if (loading && users.length === 0) return <Spinner />;

    return (
        <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
            <div className="container py-5">

                {/* HEADER */}
                <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
                    <div>
                        <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
                            <FaUsers color="var(--green)" /> Users Management
                        </h4>
                        <p style={{ color: "var(--gray)", fontSize: "14px" }} className="mb-0">
                            {total} total users
                        </p>
                    </div>
                    <Link to="/admin/overview" className="btn btn-sm fw-semibold"
                        style={{ border: "1px solid var(--green)", color: "var(--green)", fontSize: "13px" }}>
                        ← Back to Overview
                    </Link>
                </div>

                {message && <div className="mb-3"><MessageToast message={message} messageType={messageType} /></div>}

                {/* SEARCH */}
                <div className="bg-white rounded shadow-sm p-3 mb-4">
                    <div className="position-relative" style={{ maxWidth: "360px" }}>
                        <FaSearch size={12} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--gray)" }} />
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={handleSearch}
                            style={{ paddingLeft: "32px", fontSize: "14px" }}
                        />
                    </div>
                </div>

                {/* ── DESKTOP TABLE ── */}
                <div className="d-none d-md-block bg-white rounded shadow-sm overflow-hidden">
                    <table className="table table-hover mb-0">
                        <thead style={{ backgroundColor: "var(--light-green)" }}>
                            <tr>
                                <th style={{ fontSize: "13px", color: "var(--green)", padding: "14px" }}>User</th>
                                <th style={{ fontSize: "13px", color: "var(--green)" }}>Email</th>
                                <th style={{ fontSize: "13px", color: "var(--green)" }}>Role</th>
                                <th style={{ fontSize: "13px", color: "var(--green)" }}>Status</th>
                                <th style={{ fontSize: "13px", color: "var(--green)" }}>Joined</th>
                                <th style={{ fontSize: "13px", color: "var(--green)" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id} style={{ opacity: u.isActive === false ? 0.5 : 1 }}>
                                    <td style={{ padding: "14px", fontSize: "13px" }}>
                                        <div className="d-flex align-items-center gap-2">
                                            {u.roles === "admin" && <FaUserShield size={13} color="var(--green)" />}
                                            <span className="fw-semibold">{u.firstName} {u.lastName}</span>
                                        </div>
                                    </td>
                                    <td style={{ fontSize: "13px", color: "var(--gray)", verticalAlign: "middle" }}>{u.email}</td>
                                    <td style={{ verticalAlign: "middle" }}>
                                        <span className="text-capitalize fw-semibold" style={{
                                            fontSize: "11px", padding: "3px 10px", borderRadius: "20px",
                                            backgroundColor: u.roles === "admin" ? "#f0fdf4" : "#f3f4f6",
                                            color: u.roles === "admin" ? "var(--green)" : "var(--gray)"
                                        }}>
                                            {u.roles}
                                        </span>
                                    </td>
                                    <td style={{ verticalAlign: "middle" }}>
                                        <span className="fw-semibold" style={{
                                            fontSize: "11px", padding: "3px 10px", borderRadius: "20px",
                                            backgroundColor: u.isActive === false ? "#fff5f5" : "#f0fdf4",
                                            color: u.isActive === false ? "#dc2626" : "var(--green)"
                                        }}>
                                            {u.isActive === false ? "Deactivated" : "Active"}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: "12px", color: "var(--gray)", verticalAlign: "middle" }}>
                                        <FaClock size={10} /> {new Date(u.createdAt).toLocaleDateString("en-NG")}
                                    </td>
                                    <td style={{ verticalAlign: "middle" }}>
                                        {/* Don't show action buttons on the logged in admin's own row */}
                                        {u._id !== user.id && (
                                            <div className="d-flex gap-2 flex-wrap">
                                                {/* MAKE / REMOVE ADMIN */}
                                                <button
                                                    onClick={() => handleRoleChange(u._id, u.roles)}
                                                    className="btn btn-sm fw-semibold d-flex align-items-center gap-1"
                                                    title={u.roles === "admin" ? "Remove admin" : "Make admin"}
                                                    style={{
                                                        fontSize: "11px",
                                                        backgroundColor: u.roles === "admin" ? "#f3f4f6" : "#f0fdf4",
                                                        color: u.roles === "admin" ? "var(--gray)" : "var(--green)",
                                                        border: "1px solid var(--border)"
                                                    }}
                                                >
                                                    <FaUserCog size={11} />
                                                    {u.roles === "admin" ? "Remove Admin" : "Make Admin"}
                                                </button>

                                                {/* DEACTIVATE / REACTIVATE */}
                                                <button
                                                    onClick={() => handleStatusChange(u._id, u.isActive !== false)}
                                                    className="btn btn-sm fw-semibold d-flex align-items-center gap-1"
                                                    style={{
                                                        fontSize: "11px",
                                                        backgroundColor: u.isActive === false ? "#f0fdf4" : "#fff5f5",
                                                        color: u.isActive === false ? "var(--green)" : "#dc2626",
                                                        border: "1px solid var(--border)"
                                                    }}
                                                >
                                                    {u.isActive === false
                                                        ? <><FaCheckCircle size={11} /> Reactivate</>
                                                        : <><FaBan size={11} /> Deactivate</>
                                                    }
                                                </button>

                                                {/* DELETE */}
                                                <button
                                                    onClick={() => openDeleteModal(u._id, `${u.firstName} ${u.lastName}`)}
                                                    className="btn btn-sm"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#userDeleteModal"
                                                    style={{ backgroundColor: "#f8d7da", color: "#dc2626", padding: "4px 8px" }}
                                                    title="Delete user"
                                                >
                                                    <FaTrash size={11} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── MOBILE CARDS ── */}
                <div className="d-md-none d-flex flex-column gap-3">
                    {users.map((u) => (
                        <div key={u._id} className="bg-white rounded shadow-sm p-3" style={{ opacity: u.isActive === false ? 0.6 : 1 }}>
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <div className="d-flex align-items-center gap-2">
                                    {u.roles === "admin" && <FaUserShield size={13} color="var(--green)" />}
                                    <span className="fw-semibold" style={{ fontSize: "14px" }}>{u.firstName} {u.lastName}</span>
                                </div>
                                <div className="d-flex gap-2">
                                    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "20px", backgroundColor: u.roles === "admin" ? "#f0fdf4" : "#f3f4f6", color: u.roles === "admin" ? "var(--green)" : "var(--gray)" }}>
                                        {u.roles}
                                    </span>
                                    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "20px", backgroundColor: u.isActive === false ? "#fff5f5" : "#f0fdf4", color: u.isActive === false ? "#dc2626" : "var(--green)" }}>
                                        {u.isActive === false ? "Deactivated" : "Active"}
                                    </span>
                                </div>
                            </div>
                            <p style={{ fontSize: "12px", color: "var(--gray)", marginBottom: "10px" }}>{u.email}</p>
                            {u._id !== user.id && (
                                <div className="d-flex gap-2 flex-wrap">
                                    <button onClick={() => handleRoleChange(u._id, u.roles)} className="btn btn-sm fw-semibold flex-grow-1"
                                        style={{ fontSize: "11px", backgroundColor: u.roles === "admin" ? "#f3f4f6" : "#f0fdf4", color: u.roles === "admin" ? "var(--gray)" : "var(--green)", border: "1px solid var(--border)" }}>
                                        <FaUserCog size={11} className="me-1" />
                                        {u.roles === "admin" ? "Remove Admin" : "Make Admin"}
                                    </button>
                                    <button onClick={() => handleStatusChange(u._id, u.isActive !== false)} className="btn btn-sm fw-semibold flex-grow-1"
                                        style={{ fontSize: "11px", backgroundColor: u.isActive === false ? "#f0fdf4" : "#fff5f5", color: u.isActive === false ? "var(--green)" : "#dc2626", border: "1px solid var(--border)" }}>
                                        {u.isActive === false ? <><FaCheckCircle size={11} className="me-1" />Reactivate</> : <><FaBan size={11} className="me-1" />Deactivate</>}
                                    </button>
                                    <button onClick={() => openDeleteModal(u._id, `${u.firstName} ${u.lastName}`)}
                                        className="btn btn-sm" data-bs-toggle="modal" data-bs-target="#userDeleteModal"
                                        style={{ backgroundColor: "#f8d7da", color: "#dc2626", padding: "6px 12px" }}>
                                        <FaTrash size={11} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
                        <button className="btn btn-sm fw-semibold" onClick={() => setPage(page - 1)} disabled={page === 1}
                            style={{ border: "1px solid var(--border)", color: "var(--gray)", fontSize: "13px" }}>
                            ← Prev
                        </button>
                        <span style={{ fontSize: "13px", color: "var(--gray)" }}>Page {page} of {totalPages}</span>
                        <button className="btn btn-sm fw-semibold" onClick={() => setPage(page + 1)} disabled={page === totalPages}
                            style={{ border: "1px solid var(--border)", color: "var(--gray)", fontSize: "13px" }}>
                            Next →
                        </button>
                    </div>
                )}

            </div>

            {/* DELETE MODAL */}
            <div className="modal fade" id="userDeleteModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content" style={{ borderRadius: "12px", border: "none" }}>
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title fw-bold" style={{ color: "var(--text)" }}>
                                <TbTrash /> Delete User
                            </h5>
                            <button type="button" className="btn-close" id="closeUserDeleteModal" data-bs-dismiss="modal" />
                        </div>
                        <div className="modal-body pt-2">
                            <p style={{ color: "var(--gray)", fontSize: "14px" }}>Are you sure you want to permanently delete this user?</p>
                            <div className="p-3 rounded" style={{ backgroundColor: "#f8d7da", border: "1px solid #f5c6cb" }}>
                                <p className="mb-0 fw-semibold" style={{ fontSize: "14px", color: "#721c24" }}>"{deleteUserName}"</p>
                            </div>
                            <p className="mt-3 mb-0" style={{ color: "#dc2626", fontSize: "13px" }}>
                                <BiInfoCircle /> This will also delete all their posts. This cannot be undone!
                            </p>
                        </div>
                        <div className="modal-footer border-0 pt-0">
                            <button type="button" className="btn fw-semibold" data-bs-dismiss="modal"
                                style={{ border: "1px solid var(--border)", color: "var(--gray)", fontSize: "14px" }}>
                                Cancel
                            </button>
                            <button type="button" className="btn fw-bold" onClick={handleDeleteUser} disabled={deleteLoading}
                                style={{ backgroundColor: "#dc2626", color: "white", fontSize: "14px" }}>
                                {deleteLoading ? <><span className="spinner-border spinner-border-sm me-2" />Deleting...</> : "Yes, Delete User"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminUsers;