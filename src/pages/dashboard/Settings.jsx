import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { FaCog, FaLock, FaTrashAlt, FaUser, FaPaperPlane, FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../../api/axios";
import MessageToast from "../../components/ui/MessageToast";
import { FiAlertTriangle } from "react-icons/fi";
import { logout, updateUser } from "../../store/slices/authSlice";
import PasswordField from "../../components/ui/PasswordField";

const Settings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState("profile");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const [showDeletePass, setShowDeletePass] = useState(false);

    // ── OTP CHANGE PASSWORD STATE ──
    const [otpSent, setOtpSent] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false, new: false, confirm: false,
    });
    const [passwordForm, setPasswordForm] = useState({
        otp: "", currentPassword: "", newPassword: "", confirmNewPassword: "",
    });

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => setMessage(""), 4000);
    };

    // ── START COUNTDOWN ──
    const startCountdown = () => {
        setCountdown(60);
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) { clearInterval(interval); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    // ── SEND OTP ──
    const handleSendOTP = async () => {
        setOtpLoading(true);
        try {
            await API.post("/request-otp", { email: user.email });
            setOtpSent(true);
            startCountdown();
            showMessage("OTP sent to your email", "success");
        } catch (err) {
            showMessage(err.response?.data?.message || "Failed to send OTP", "error");
        } finally {
            setOtpLoading(false);
        }
    };

    // ── CHANGE PASSWORD SUBMIT ──
    const handlePasswordSubmit = async () => {
        const { otp, currentPassword, newPassword, confirmNewPassword } = passwordForm;
        if (!otp || !currentPassword || !newPassword || !confirmNewPassword) {
            showMessage("All fields are required", "error"); return;
        }
        if (newPassword !== confirmNewPassword) {
            showMessage("New passwords do not match", "error"); return;
        }
        if (newPassword.length < 6) {
            showMessage("New password must be at least 6 characters", "error"); return;
        }
        if (currentPassword === newPassword) {
            showMessage("New password must be different from current password", "error"); return;
        }
        setLoadingPassword(true);
        try {
            const res = await API.post("/auth/change-password-otp", passwordForm);
            showMessage(res.data.message, "success");
            setPasswordForm({ otp: "", currentPassword: "", newPassword: "", confirmNewPassword: "" });
            setOtpSent(false);
        } catch (err) {
            showMessage(err.response?.data?.message || "Failed to change password", "error");
        } finally {
            setLoadingPassword(false);
        }
    };

    // ── UPDATE PROFILE ──
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
                dispatch(updateUser(res.data.data));
                showMessage(res.data.message, "success");
            } catch (err) {
                showMessage(err.response?.data?.message || "Failed to update profile", "error");
            } finally {
                setLoadingProfile(false);
            }
        },
    });

    // ── DELETE ACCOUNT ──
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

    const inputStyle = {
        fontSize: "14px",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "10px 14px",
        width: "100%",
        outline: "none",
    };

    const labelStyle = {
        fontSize: "13px",
        fontWeight: "600",
        color: "var(--text)",
        marginBottom: "6px",
        display: "block",
    };

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
                            {tabBtn("profile",  "Edit Profile",      <FaUser size={13} />)}
                            {tabBtn("password", "Change Password",   <FaLock size={13} />)}
                            {tabBtn("delete",   "Delete Account",    <FaTrashAlt size={13} />, true)}
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
                                            {loadingProfile
                                                ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                                                : "Save Changes"}
                                        </button>
                                    </form>
                                </>
                            )}

                            {/* ── CHANGE PASSWORD ── */}
                            {activeTab === "password" && (
                                <>
                                    <h6 className="fw-bold mb-1">Change Password</h6>
                                    <p style={{ color: "var(--gray)", fontSize: "13px", marginBottom: "20px" }}>
                                        We'll send an OTP to your email to verify it's you before changing your password.
                                    </p>

                                    <div style={{ maxWidth: "460px" }}>

                                        {/* STEP 1 — SEND OTP */}
                                        <div className="mb-3">
                                            <label style={labelStyle}>Step 1 — Verify your email</label>
                                            <div className="d-flex gap-2 align-items-center">
                                                <input
                                                    type="text"
                                                    style={{ ...inputStyle, backgroundColor: "#f9fafb", color: "var(--gray)" }}
                                                    value={user?.email}
                                                    disabled
                                                />
                                                <button
                                                    onClick={handleSendOTP}
                                                    disabled={otpLoading || countdown > 0}
                                                    className="btn fw-semibold flex-shrink-0 d-flex align-items-center gap-2"
                                                    style={{
                                                        backgroundColor: countdown > 0 ? "#f3f4f6" : "var(--green)",
                                                        color: countdown > 0 ? "var(--gray)" : "white",
                                                        fontSize: "13px",
                                                        whiteSpace: "nowrap",
                                                        padding: "10px 16px",
                                                        borderRadius: "8px",
                                                    }}
                                                >
                                                    {otpLoading
                                                        ? <><span className="spinner-border spinner-border-sm" /> Sending...</>
                                                        : countdown > 0
                                                            ? `Resend in ${countdown}s`
                                                            : <><FaPaperPlane size={12} /> {otpSent ? "Resend OTP" : "Send OTP"}</>
                                                    }
                                                </button>
                                            </div>
                                            {otpSent && (
                                                <small style={{ color: "var(--green)", fontSize: "12px", marginTop: "4px", display: "block" }}>
                                                    ✓ OTP sent — check your inbox and spam folder
                                                </small>
                                            )}
                                        </div>

                                        {/* STEP 2 — FIELDS (show after OTP sent) */}
                                        {otpSent && (
                                            <>
                                                {/* OTP */}
                                                <div className="mb-3">
                                                    <label style={labelStyle}>Step 2 — Enter OTP</label>
                                                    <input
                                                        type="text"
                                                        style={inputStyle}
                                                        placeholder="Enter 6-digit OTP"
                                                        maxLength={6}
                                                        value={passwordForm.otp}
                                                        onChange={(e) => setPasswordForm({ ...passwordForm, otp: e.target.value })}
                                                    />
                                                </div>

                                                {/* CURRENT PASSWORD */}
                                                <div className="mb-3">
                                                    <label style={labelStyle}>Current Password</label>
                                                    <div className="position-relative">
                                                        <input
                                                            type={showPasswords.current ? "text" : "password"}
                                                            style={{ ...inputStyle, paddingRight: "40px" }}
                                                            placeholder="Enter current password"
                                                            value={passwordForm.currentPassword}
                                                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                                            style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--gray)", cursor: "pointer" }}
                                                        >
                                                            {showPasswords.current ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* NEW PASSWORD */}
                                                <div className="mb-3">
                                                    <label style={labelStyle}>New Password</label>
                                                    <div className="position-relative">
                                                        <input
                                                            type={showPasswords.new ? "text" : "password"}
                                                            style={{ ...inputStyle, paddingRight: "40px" }}
                                                            placeholder="At least 6 characters"
                                                            value={passwordForm.newPassword}
                                                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                                            style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--gray)", cursor: "pointer" }}
                                                        >
                                                            {showPasswords.new ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* CONFIRM NEW PASSWORD */}
                                                <div className="mb-4">
                                                    <label style={labelStyle}>Confirm New Password</label>
                                                    <div className="position-relative">
                                                        <input
                                                            type={showPasswords.confirm ? "text" : "password"}
                                                            style={{ ...inputStyle, paddingRight: "40px" }}
                                                            placeholder="Confirm new password"
                                                            value={passwordForm.confirmNewPassword}
                                                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                                            style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--gray)", cursor: "pointer" }}
                                                        >
                                                            {showPasswords.confirm ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* SUBMIT */}
                                                <button
                                                    onClick={handlePasswordSubmit}
                                                    disabled={loadingPassword}
                                                    className="btn fw-bold w-100"
                                                    style={{ backgroundColor: "var(--green)", color: "white", fontSize: "14px", padding: "12px", borderRadius: "8px" }}
                                                >
                                                    {loadingPassword
                                                        ? <><span className="spinner-border spinner-border-sm me-2" />Changing Password...</>
                                                        : "Change Password"
                                                    }
                                                </button>
                                            </>
                                        )}
                                    </div>
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
                                            {loadingDelete
                                                ? <><span className="spinner-border spinner-border-sm me-2" />Deleting...</>
                                                : "Yes, Delete My Account"}
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