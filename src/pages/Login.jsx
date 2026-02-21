import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import API from "../api/axios";
import { loginSuccess } from "../store/slices/authSlice";
import { FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";
import logo from "../assets/Logo.png";
import { useFormik } from "formik";
import * as yup from "yup";
import MessageToast from "../components/ui/MessageToast";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },

        validationSchema: yup.object({
            email: yup
                .string()
                .required("Email is required")
                .email("Invalid email format"),
            password: yup
                .string()
                .required("Password is required"),
        }),

        onSubmit: async (values) => {
            setLoading(true);
            setMessage("");
            try {
                const res = await API.post("/login", {
                    email: values.email,
                    password: values.password,
                });

                dispatch(loginSuccess({
                    user: res.data.data,
                    token: res.data.token,
                }));

                setMessage("Login successful! Redirecting...");
                setMessageType("success");
                setTimeout(() => navigate("/"), 1500);

            } catch (err) {
                setMessage(err.response?.data?.message || "Invalid credentials, please try again");
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
                        Welcome back! The gist is waiting 🔥
                    </p>
                </div>

                {/* HEADER */}
                <div className="d-flex align-items-center gap-2 mb-4">
                    <FaSignInAlt color="var(--green)" size={20} />
                    <h5 className="fw-bold mb-0" style={{ color: "var(--text)" }}>
                        Login to Your Account
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
                    <div className="mb-2">
                        <label className="form-label fw-semibold" style={{ fontSize: "13px" }}>
                            Password
                        </label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className={`form-control ${formik.touched.password && formik.errors.password ? "is-invalid" : ""}`}
                                placeholder="Enter your password"
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

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        className="btn w-100 fw-bold mt-4"
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
                                Logging in...
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>

                {/* DIVIDER */}
                <div className="text-center my-3">
                    <small style={{ color: "var(--gray)" }}>Don't have an account?</small>
                </div>

                {/* REGISTER LINK */}
                <Link
                    to="/register"
                    className="btn w-100 fw-semibold"
                    style={{
                        border: "1px solid var(--green)",
                        color: "var(--green)",
                        fontSize: "14px",
                    }}
                >
                   Register
                </Link>
            </div>
        </div>
    );
};

export default Login;