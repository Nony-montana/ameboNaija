import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import MessageToast from "../components/ui/MessageToast";
import API from "../api/axios";
import { BiLock } from "react-icons/bi";

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // resetToken was passed from ForgotPassword via navigate state
    const resetToken = location.state?.resetToken;

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [success, setSuccess] = useState(false);

    // Guard: if someone lands here without going through OTP, send them back
    if (!resetToken) {
        return (
            <div
                style={{ backgroundColor: "var(--bg)", minHeight: "60vh" }}
                className="d-flex align-items-center justify-content-center px-3"
            >
                <div className="bg-white rounded shadow-sm p-4 p-md-5 text-center" style={{ maxWidth: "440px" }}>
                    <div style={{ fontSize: "48px" }}><BiLock/></div>
                    <h6 className="fw-bold mt-3">Session Expired or Invalid</h6>
                    <p style={{ color: "var(--gray)", fontSize: "13px" }}>
                        This page can only be accessed after verifying your OTP. Please start over.
                    </p>
                    <Link
                        to="/forgot-password"
                        className="btn fw-bold"
                        style={{ backgroundColor: "var(--green)", color: "white", fontSize: "14px" }}
                    >
                        Start Over
                    </Link>
                </div>
            </div>
        );
    }

    const formik = useFormik({
        initialValues: { password: "", confirmPassword: "" },
        validationSchema: yup.object({
            password: yup.string().required("Password is required").min(6, "Must be at least 6 characters"),
            confirmPassword: yup
                .string()
                .required("Please confirm your password")
                .oneOf([yup.ref("password")], "Passwords do not match"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                await API.post("/auth/reset-password", {
                    resetToken,
                    password: values.password,
                    confirmPassword: values.confirmPassword,
                });
                setSuccess(true);
                setTimeout(() => navigate("/login"), 3000);
            } catch (err) {
                setMessage(err.response?.data?.message || "Failed to reset password. Please start over.");
                setMessageType("error");
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div
            style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}
            className="d-flex align-items-center justify-content-center px-3"
        >
            <div className="bg-white rounded shadow-sm p-4 p-md-5" style={{ width: "100%", maxWidth: "440px" }}>

                <div className="text-center mb-4">
                    <h4 className="fw-bold mb-0" style={{ color: "var(--green)" }}>TheAmeboNaija</h4>
                    <p style={{ color: "var(--gray)", fontSize: "13px" }}>Set a new password</p>
                </div>

                {message && (
                    <div className="mb-3">
                        <MessageToast message={message} messageType={messageType} />
                    </div>
                )}

                {success ? (
                    <div className="text-center">
                        <div style={{ fontSize: "48px" }}>✅</div>
                        <h6 className="fw-bold mt-3">Password Reset!</h6>
                        <p style={{ color: "var(--gray)", fontSize: "13px" }}>
                            Your password has been updated. Redirecting you to login...
                        </p>
                        <Link to="/login" className="btn fw-semibold" style={{ color: "var(--green)", fontSize: "14px" }}>
                            Go to Login →
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={formik.handleSubmit}>
                        {/* NEW PASSWORD */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold" style={{ fontSize: "13px" }}>New Password</label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className={`form-control ${formik.touched.password && formik.errors.password ? "is-invalid" : ""}`}
                                    placeholder="At least 6 characters"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{ fontSize: "14px" }}
                                />
                                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                                    {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                </button>
                                {formik.touched.password && formik.errors.password && (
                                    <div className="invalid-feedback">{formik.errors.password}</div>
                                )}
                            </div>
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold" style={{ fontSize: "13px" }}>Confirm New Password</label>
                            <div className="input-group">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    name="confirmPassword"
                                    className={`form-control ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "is-invalid" : ""}`}
                                    placeholder="Repeat your new password"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{ fontSize: "14px" }}
                                />
                                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>
                                    {showConfirm ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                </button>
                                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                    <div className="invalid-feedback">{formik.errors.confirmPassword}</div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn w-100 fw-bold"
                            disabled={loading}
                            style={{ backgroundColor: "var(--green)", color: "white", fontSize: "14px" }}
                        >
                            {loading ? (
                                <><span className="spinner-border spinner-border-sm me-2" />Resetting...</>
                            ) : "Reset Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;