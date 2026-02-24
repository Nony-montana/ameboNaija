import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import MessageToast from "../../components/ui/MessageToast";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1 = enter email, 2 = enter OTP
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [otpError, setOtpError] = useState("");

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
    };

    // ── STEP 1: Submit email ──────────────────────
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setEmailError("");
        if (!email) return setEmailError("Email is required");
        if (!/\S+@\S+\.\S+/.test(email)) return setEmailError("Enter a valid email");

        setLoading(true);
        try {
            await API.post("/auth/forgot-password", { email });
            // Always move to step 2 regardless of whether email exists (security)
            setStep(2);
            showMessage("", "");
        } catch (err) {
            showMessage(err.response?.data?.message || "Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    // ── OTP input handlers ────────────────────────
    const handleOtpChange = (value, index) => {
        // Only allow digits
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // only one digit per box
        setOtp(newOtp);
        // Auto-focus next box
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleOtpKeyDown = (e, index) => {
        // Move back on backspace if current box is empty
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otp];
        pasted.split("").forEach((char, i) => { newOtp[i] = char; });
        setOtp(newOtp);
        document.getElementById(`otp-${Math.min(pasted.length, 5)}`)?.focus();
    };

    // ── STEP 2: Verify OTP ────────────────────────
    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setOtpError("");
        const otpValue = otp.join("");
        if (otpValue.length < 6) return setOtpError("Enter the full 6-digit OTP");

        setLoading(true);
        try {
            const res = await API.post("/auth/verify-otp", { email, otp: otpValue });
            // Pass resetToken to the next page via state
            navigate("/reset-password", { state: { resetToken: res.data.resetToken } });
        } catch (err) {
            setOtpError(err.response?.data?.message || "Invalid or expired OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        setOtpError("");
        setOtp(["", "", "", "", "", ""]);
        try {
            await API.post("/auth/forgot-password", { email });
            showMessage("A new OTP has been sent to your email", "success");
        } catch {
            showMessage("Failed to resend OTP", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}
            className="d-flex align-items-center justify-content-center px-3"
        >
            <div className="bg-white rounded shadow-sm p-4 p-md-5" style={{ width: "100%", maxWidth: "440px" }}>

                {/* BRAND */}
                <div className="text-center mb-4">
                    <h4 className="fw-bold mb-0" style={{ color: "var(--green)" }}>TheAmeboNaija</h4>
                    <p style={{ color: "var(--gray)", fontSize: "13px" }}>
                        {step === 1 ? "Forgot your password?" : "Check your email"}
                    </p>
                </div>

                {message && (
                    <div className="mb-3">
                        <MessageToast message={message} messageType={messageType} />
                    </div>
                )}

                {/* ── STEP 1: EMAIL ── */}
                {step === 1 && (
                    <form onSubmit={handleEmailSubmit}>
                        <p style={{ color: "var(--gray)", fontSize: "13px" }} className="mb-4">
                            Enter your email address and we'll send you a 6-digit OTP to reset your password.
                        </p>

                        <div className="mb-3">
                            <label className="form-label fw-semibold" style={{ fontSize: "13px" }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                className={`form-control ${emailError ? "is-invalid" : ""}`}
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ fontSize: "14px" }}
                            />
                            {emailError && <div className="invalid-feedback">{emailError}</div>}
                        </div>

                        <button
                            type="submit"
                            className="btn w-100 fw-bold"
                            disabled={loading}
                            style={{ backgroundColor: "var(--green)", color: "white", fontSize: "14px" }}
                        >
                            {loading ? (
                                <><span className="spinner-border spinner-border-sm me-2" />Sending OTP...</>
                            ) : "Send OTP"}
                        </button>

                        <p className="text-center mt-4 mb-0" style={{ fontSize: "13px", color: "var(--gray)" }}>
                            Remember your password?{" "}
                            <Link to="/login" style={{ color: "var(--green)", fontWeight: "600" }}>Log in</Link>
                        </p>
                    </form>
                )}

                {/* ── STEP 2: OTP ── */}
                {step === 2 && (
                    <form onSubmit={handleOtpSubmit}>
                        <p style={{ color: "var(--gray)", fontSize: "13px" }} className="mb-4">
                            We sent a 6-digit OTP to <strong>{email}</strong>. Enter it below. It expires in 10 minutes.
                        </p>

                        {/* OTP BOXES */}
                        <div className="d-flex gap-2 justify-content-center mb-3" onPaste={handleOtpPaste}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e.target.value, index)}
                                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                    className={`form-control text-center fw-bold ${otpError ? "is-invalid" : ""}`}
                                    style={{
                                        width: "48px",
                                        height: "56px",
                                        fontSize: "22px",
                                        borderColor: digit ? "var(--green)" : undefined,
                                        borderWidth: digit ? "2px" : "1px",
                                    }}
                                />
                            ))}
                        </div>

                        {otpError && (
                            <p className="text-center" style={{ color: "#dc2626", fontSize: "13px" }}>{otpError}</p>
                        )}

                        <button
                            type="submit"
                            className="btn w-100 fw-bold mt-2"
                            disabled={loading}
                            style={{ backgroundColor: "var(--green)", color: "white", fontSize: "14px" }}
                        >
                            {loading ? (
                                <><span className="spinner-border spinner-border-sm me-2" />Verifying...</>
                            ) : "Verify OTP"}
                        </button>

                        <div className="d-flex justify-content-between mt-3" style={{ fontSize: "13px" }}>
                            <button
                                type="button"
                                className="btn btn-link p-0"
                                style={{ color: "var(--gray)", fontSize: "13px" }}
                                onClick={() => { setStep(1); setOtp(["", "", "", "", "", ""]); setOtpError(""); }}
                            >
                                ← Change email
                            </button>
                            <button
                                type="button"
                                className="btn btn-link p-0"
                                style={{ color: "var(--green)", fontSize: "13px" }}
                                onClick={handleResendOtp}
                                disabled={loading}
                            >
                                Resend OTP
                            </button>
                        </div>
                    </form>
                )}

            </div>
        </div>
    );
};

export default ForgotPassword;