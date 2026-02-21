import { Link } from "react-router-dom";
import { FaHome, FaSearch } from "react-icons/fa";
import logo from "../assets/Logo.png";

const NotFound = () => {
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
            <div className="text-center">

                {/* LOGO */}
                <img
                    src={logo}
                    alt="logo"
                    style={{ height: "150px", objectFit: "contain", marginBottom: "24px" }}
                />

                {/* 404 TEXT */}
                <h1
                    className="fw-bold"
                    style={{
                        fontSize: "120px",
                        lineHeight: "1",
                        color: "var(--green)",
                        letterSpacing: "-4px"
                    }}
                >
                    4
                    <span style={{ color: "var(--gold)" }}>0</span>
                    4
                </h1>

                {/* MESSAGE */}
                <h4 className="fw-bold mt-2" style={{ color: "var(--text)" }}>
                    Eiyah! This page don disappear 😅
                </h4>
                <p style={{ color: "var(--gray)", fontSize: "15px", maxWidth: "400px", margin: "10px auto" }}>
                    The gist you're looking for is either deleted, moved or
                    never existed in the first place. No wahala, we get plenty
                    other hot stories for you! 🔥
                </p>

                {/* BUTTONS */}
                <div className="d-flex justify-content-center gap-3 mt-4">
                    <Link
                        to="/"
                        className="btn fw-semibold d-flex align-items-center gap-2"
                        style={{
                            backgroundColor: "var(--green)",
                            color: "white",
                            padding: "10px 24px"
                        }}
                    >
                        <FaHome /> Back to Home
                    </Link>
                    <Link
                        to="/search"
                        className="btn fw-semibold d-flex align-items-center gap-2"
                        style={{
                            border: "1px solid var(--green)",
                            color: "var(--green)",
                            padding: "10px 24px"
                        }}
                    >
                        <FaSearch /> Search Gist
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default NotFound;