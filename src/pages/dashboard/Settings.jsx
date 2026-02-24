import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { FaCog, FaLock, FaTrashAlt, FaUser } from "react-icons/fa";
import API from "../../api/axios";
import MessageToast from "../../components/ui/MessageToast";
import { FiAlertTriangle } from "react-icons/fi";
import { logout, updateUser } from "../../store/slices/authSlice"; // add updateUser action
import PasswordField from "../../components/ui/PasswordField";

const Settings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState("profile");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showDeletePass, setShowDeletePass] = useState(false);

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => setMessage(""), 4000);
    };

    // ── UPDATE PROFILE ───────────────────────────────
    const profileFormik = useFormik({
        initialValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
        },
        validationSchema: yup.object({
            firstName: yup.string().required("First name is required"),
            lastName: yup.string().required("Last name is required"),
            email: yup.string().email("Enter a valid email").required("Email is required"),
        }),
        onSubmit: async (values) => {
            setLoadingProfile(true);
            try {
                const res = await API.put("/auth/update-profile", values);
                // Update redux store so name reflects immediately across the app
                dispatch(updateUser(res.data.data));
                showMessage(res.data.message, "success");
            } catch (err) {
                showMessage(err.response?.data?.message || "Failed to update profile", "error");
            } finally {
                setLoadingProfile(false);
            }
        },
    });

    // ── CHANGE PASSWORD ──────────────────────────────
    const passwordFormik = useFormik({
        initialValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
        validationSchema: yup.object({
            currentPassword: yup.string().required("Current password is required"),
            newPassword: yup
                .string()
                .required("New password is required")
                .min(6, "Must be at least 6 characters")
                .notOneOf([yup.ref("currentPassword")], "New password must be different"),
            confirmNewPassword: yup
                .string()
                .required("Please confirm your new password")
                .oneOf([yup.ref("newPassword")], "Passwords do not match"),
        }),
        onSubmit: async (values, { resetForm }) => {
            setLoadingPassword(true);
            try {
                const res = await API.put("/auth/change-password", values);
                showMessage(res.data.message, "success");
                resetForm();
            } catch (err) {
                showMessage(err.response?.data?.message || "Failed to change password", "error");
            } finally {
                setLoadingPassword(false);
            }
        },
    });

    // ── DELETE ACCOUNT ───────────────────────────────
    const deleteFormik = useFormik({
        initialValues: { password: "" },
        validationSchema: yup.object({
            password: yup.string().required("Please enter your password to confirm"),
        }),
        onSubmit: async (values) => {
            setLoadingDelete(true);
            try {
                await API.delete("/auth/delete-account", { data: values });
                dispatch(logout());
                navigate("/");
            } catch (err) {
                showMessage(err.response?.data?.message || "Failed to delete account", "error");
                setLoadingDelete(false);
            }
        },
    });

    const tabBtn = (tab, label, icon, danger = false) => (
        <button
            className="btn w-100 text-start mb-1 d-flex align-items-center gap-2"
            style={{
                fontSize: "14px",
                backgroundColor: activeTab === tab
                    ? danger ? "#fff0f0" : "var(--light-green)"
                    : "transparent",
                color: activeTab === tab
                    ? danger ? "#dc2626" : "var(--green)"
                    : "var(--gray)",
                fontWeight: activeTab === tab ? "600" : "400",
            }}
            onClick={() => setActiveTab(tab)}
        >
            {icon} {label}
        </button>
    );

    return (
        <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
            <div className="container py-5">

                {/* HEADER */}
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                        <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
                            <FaCog color="var(--green)" /> Settings
                        </h4>
                        <p style={{ color: "var(--gray)", fontSize: "14px" }}>Manage your account</p>
                    </div>
                    <Link
                        to="/dashboard"
                        className="btn btn-sm fw-semibold"
                        style={{ border: "1px solid var(--green)", color: "var(--green)" }}
                    >
                        ← Back to Dashboard
                    </Link>
                </div>

                {message && (
                    <div className="mb-3">
                        <MessageToast message={message} messageType={messageType} />
                    </div>
                )}

                <div className="row g-4">
                    {/* SIDEBAR TABS */}
                    <div className="col-md-3">
                        <div className="bg-white rounded shadow-sm p-2">
                            {tabBtn("profile", "Edit Profile", <FaUser size={13} />)}
                            {tabBtn("password", "Change Password", <FaLock size={13} />)}
                            {tabBtn("delete", "Delete Account", <FaTrashAlt size={13} />, true)}
                        </div>
                    </div>

                    {/* CONTENT */}
                    <div className="col-md-9">
                        <div className="bg-white rounded shadow-sm p-4">

                            {/* ── EDIT PROFILE ── */}
                            {activeTab === "profile" && (
                                <>
                                    <h6 className="fw-bold mb-1">Edit Profile</h6>
                                    <p style={{ color: "var(--gray)", fontSize: "13px" }} className="mb-4">
                                        Update your personal information.
                                    </p>
                                    <form onSubmit={profileFormik.handleSubmit} style={{ maxWidth: "460px" }}>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold" style={{ fontSize: "13px" }}>First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                className={`form-control ${profileFormik.touched.firstName && profileFormik.errors.firstName ? "is-invalid" : ""}`}
                                                value={profileFormik.values.firstName}
                                                onChange={profileFormik.handleChange}
                                                onBlur={profileFormik.handleBlur}
                                                style={{ fontSize: "14px" }}
                                            />
                                            {profileFormik.touched.firstName && profileFormik.errors.firstName && (
                                                <div className="invalid-feedback">{profileFormik.errors.firstName}</div>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold" style={{ fontSize: "13px" }}>Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                className={`form-control ${profileFormik.touched.lastName && profileFormik.errors.lastName ? "is-invalid" : ""}`}
                                                value={profileFormik.values.lastName}
                                                onChange={profileFormik.handleChange}
                                                onBlur={profileFormik.handleBlur}
                                                style={{ fontSize: "14px" }}
                                            />
                                            {profileFormik.touched.lastName && profileFormik.errors.lastName && (
                                                <div className="invalid-feedback">{profileFormik.errors.lastName}</div>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-semibold" style={{ fontSize: "13px" }}>Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                className={`form-control ${profileFormik.touched.email && profileFormik.errors.email ? "is-invalid" : ""}`}
                                                value={profileFormik.values.email}
                                                onChange={profileFormik.handleChange}
                                                onBlur={profileFormik.handleBlur}
                                                style={{ fontSize: "14px" }}
                                            />
                                            {profileFormik.touched.email && profileFormik.errors.email && (
                                                <div className="invalid-feedback">{profileFormik.errors.email}</div>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn fw-bold px-4"
                                            disabled={loadingProfile}
                                            style={{ backgroundColor: "var(--green)", color: "white", fontSize: "14px" }}
                                        >
                                            {loadingProfile ? (
                                                <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                                            ) : "Save Changes"}
                                        </button>
                                    </form>
                                </>
                            )}

                            {/* ── CHANGE PASSWORD ── */}
                            {activeTab === "password" && (
                                <>
                                    <h6 className="fw-bold mb-1">Change Password</h6>
                                    <p style={{ color: "var(--gray)", fontSize: "13px" }} className="mb-4">
                                        Choose a strong password you haven't used before.
                                    </p>
                                    <form onSubmit={passwordFormik.handleSubmit} style={{ maxWidth: "460px" }}>
                                        <PasswordField
                                            label="Current Password"
                                            name="currentPassword"
                                            formik={passwordFormik}
                                            show={showCurrent}
                                            setShow={setShowCurrent}
                                        />
                                        <PasswordField
                                            label="New Password"
                                            name="newPassword"
                                            formik={passwordFormik}
                                            show={showNew}
                                            setShow={setShowNew}
                                            placeholder="At least 6 characters"
                                        />
                                        <PasswordField
                                            label="Confirm New Password"
                                            name="confirmNewPassword"
                                            formik={passwordFormik}
                                            show={showConfirm}
                                            setShow={setShowConfirm}
                                        />
                                        <button
                                            type="submit"
                                            className="btn fw-bold px-4 mt-2"
                                            disabled={loadingPassword}
                                            style={{ backgroundColor: "var(--green)", color: "white", fontSize: "14px" }}
                                        >
                                            {loadingPassword ? (
                                                <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                                            ) : "Update Password"}
                                        </button>
                                    </form>
                                </>
                            )}

                            {/* ── DELETE ACCOUNT ── */}
                            {activeTab === "delete" && (
                                <>
                                    <h6 className="fw-bold mb-1" style={{ color: "#dc2626" }}>Delete Account</h6>
                                    <p style={{ color: "var(--gray)", fontSize: "13px" }} className="mb-3">
                                        This permanently deletes your account and all your posts. This cannot be undone.
                                    </p>
                                    <div
                                        className="rounded p-3 mb-4"
                                        style={{ backgroundColor: "#fff5f5", border: "1px solid #fecaca", fontSize: "13px", color: "#dc2626" }}
                                    >
                                        <FiAlertTriangle /> You are about to delete <strong>{user?.firstName || "your account"}</strong>. All your posts will also be permanently removed.
                                    </div>
                                    <form onSubmit={deleteFormik.handleSubmit} style={{ maxWidth: "460px" }}>
                                        <PasswordField
                                            label="Enter your password to confirm"
                                            name="password"
                                            formik={deleteFormik}
                                            show={showDeletePass}
                                            setShow={setShowDeletePass}
                                            placeholder="Your current password"
                                        />
                                        <button
                                            type="submit"
                                            className="btn fw-bold px-4"
                                            disabled={loadingDelete}
                                            style={{ backgroundColor: "#dc2626", color: "white", fontSize: "14px" }}
                                        >
                                            {loadingDelete ? (
                                                <><span className="spinner-border spinner-border-sm me-2" />Deleting...</>
                                            ) : "Yes, Delete My Account"}
                                        </button>
                                    </form>
                                </>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;