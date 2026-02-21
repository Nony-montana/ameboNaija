import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import API from "../api/axios";
import { loginSuccess } from "../store/slices/authSlice";
import { FaEye, FaEyeSlash, FaUserPlus } from "react-icons/fa";
import logo from "../assets/Logo.png";
import { useFormik } from "formik";
import * as yup from "yup";
import MessageToast from "../components/ui/MessageToast";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },

        validationSchema: yup.object({
            firstName: yup.string().required("First name is required"),
            lastName: yup.string().required("Last name is required"),
            email: yup
                .string()
                .required("Email is required")
                .email("Invalid email format"),
            password: yup
                .string()
                .required("Password is required")
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                    "Password must have 6+ characters, uppercase, lowercase, number & special character"
                ),
            confirmPassword: yup
                .string()
                .required("Please confirm your password")
                .oneOf([yup.ref("password")], "Passwords do not match"),
        }),

        onSubmit: async (values) => {
            setLoading(true);
            setMessage("");
            try {
                const res = await API.post("/register", {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    password: values.password,
                });

                dispatch(loginSuccess({
                    user: res.data.data,
                    token: res.data.token,
                }));

                setMessage("Account created successfully! Redirecting...");
                setMessageType("success");
                setTimeout(() => navigate("/"), 1500);

            } catch (err) {
                setMessage(err.response?.data?.message || "Registration failed, please try again");
                setMessageType("error");
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div
            style={{
                minHeight: "80vh",
                backgroundColor: "var(--bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 16px",
            }}
        >
            <div
                className="shadow-sm rounded p-4 p-md-5 bg-white w-100"
                style={{ maxWidth: "480px" }}
            >
                {/* LOGO */}
                <div className="text-center mb-4">
                    <img
                        src={logo}
                        alt="logo"
                        style={{ height: "150px", objectFit: "contain" }}
                    />
                    <p style={{ color: "var(--gray)", fontSize: "14px", marginTop: "8px" }}>
                        Join Nigeria's hottest gist community 🇳🇬
                    </p>
                </div>

                {/* HEADER */}
                <div className="d-flex align-items-center gap-2 mb-4">
                    <FaUserPlus color="var(--green)" size={20} />
                    <h5 className="fw-bold mb-0" style={{ color: "var(--text)" }}>
                        Create an Account
                    </h5>
                </div>

                {/* MESSAGE TOAST */}
                {message && (
                    <div className="mb-3">
                        <MessageToast
                            message={message}
                            messageType={messageType}
                        />
                    </div>
                )}

                {/* FORM */}
                <form onSubmit={formik.handleSubmit}>

                    {/* FIRST & LAST NAME */}
                    <div className="row g-3 mb-3">
                        <div className="col-6">
                            <label className="form-label fw-semibold" style={{ fontSize: "13px" }}>
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                className={`form-control ${formik.touched.firstName && formik.errors.firstName ? "is-invalid" : ""}`}
                                placeholder="e.g. Chidi"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                style={{ fontSize: "14px" }}
                            />
                            {formik.touched.firstName && formik.errors.firstName && (
                                <div className="invalid-feedback" style={{ fontSize: "11px" }}>
                                    {formik.errors.firstName}
                                </div>
                            )}
                        </div>
                        <div className="col-6">
                            <label className="form-label fw-semibold" style={{ fontSize: "13px" }}>
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                className={`form-control ${formik.touched.lastName && formik.errors.lastName ? "is-invalid" : ""}`}
                                placeholder="e.g. Okafor"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                style={{ fontSize: "14px" }}
                            />
                            {formik.touched.lastName && formik.errors.lastName && (
                                <div className="invalid-feedback" style={{ fontSize: "11px" }}>
                                    {formik.errors.lastName}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* EMAIL */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold" style={{ fontSize: "13px" }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            className={`form-control ${formik.touched.email && formik.errors.email ? "is-invalid" : ""}`}
                            placeholder="e.g. chidi@gmail.com"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{ fontSize: "14px" }}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <div className="invalid-feedback" style={{ fontSize: "11px" }}>
                                {formik.errors.email}
                            </div>
                        )}
                    </div>

                    {/* PASSWORD */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold" style={{ fontSize: "13px" }}>
                            Password
                        </label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className={`form-control ${formik.touched.password && formik.errors.password ? "is-invalid" : ""}`}
                                placeholder="Min. 6 characters"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                style={{ fontSize: "14px" }}
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            {formik.touched.password && formik.errors.password && (
                                <div className="invalid-feedback" style={{ fontSize: "11px" }}>
                                    {formik.errors.password}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="mb-4">
                        <label className="form-label fw-semibold" style={{ fontSize: "13px" }}>
                            Confirm Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            className={`form-control ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "is-invalid" : ""}`}
                            placeholder="Repeat your password"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{ fontSize: "14px" }}
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                            <div className="invalid-feedback" style={{ fontSize: "11px" }}>
                                {formik.errors.confirmPassword}
                            </div>
                        )}
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        className="btn w-100 fw-bold"
                        disabled={loading}
                        style={{
                            backgroundColor: "var(--green)",
                            color: "white",
                            padding: "10px",
                            fontSize: "15px",
                        }}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Creating Account...
                            </>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                {/* DIVIDER */}
                <div className="text-center my-3">
                    <small style={{ color: "var(--gray)" }}>Already have an account?</small>
                </div>

                {/* LOGIN LINK */}
                <Link
                    to="/login"
                    className="btn w-100 fw-semibold"
                    style={{
                        border: "1px solid var(--green)",
                        color: "var(--green)",
                        fontSize: "14px",
                    }}
                >
                    Login Instead
                </Link>
            </div>
        </div>
    );
};

export default Register;