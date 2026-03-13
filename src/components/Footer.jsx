import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaTiktok, FaWhatsapp, FaHeart } from "react-icons/fa";
import logo from "../assets/Logo.png";

const Footer = () => {
    return (
        <footer style={{ backgroundColor: "var(--green)", color: "white" }}>

            {/* MAIN FOOTER */}
            <div className="container py-5">
                <div className="row g-4">

                    {/* BRAND COLUMN */}
                    <div className="col-md-4">
                        <img
                            src={logo}
                            alt="logo"
                            style={{ height: "100px", objectFit: "contain", marginBottom: "12px" }}
                        />
                        <p style={{ fontSize: "14px", color: "#cccccc", lineHeight: "1.8" }}>
                            Amebo Naija is Nigeria's hottest destination for the latest gist,
                            gossip, entertainment news and lifestyle content. We stay on top
                            so you don't miss a thing! 🇳🇬
                        </p>
                        {/* SOCIAL ICONS */}
                        <div className="d-flex gap-3 mt-3">
                            <a href="#" style={{ color: "var(--gold)", fontSize: "20px" }}>
                                <FaFacebook />
                            </a>
                            <a href="#" style={{ color: "var(--gold)", fontSize: "20px" }}>
                                <FaTwitter />
                            </a>
                            <a href="#" style={{ color: "var(--gold)", fontSize: "20px" }}>
                                <FaInstagram />
                            </a>
                            <a href="#" style={{ color: "var(--gold)", fontSize: "20px" }}>
                                <FaTiktok />
                            </a>
                            <a href="#" style={{ color: "var(--gold)", fontSize: "20px" }}>
                                <FaWhatsapp />
                            </a>
                        </div>
                    </div>

                    {/* CATEGORIES COLUMN */}
                    <div className="col-md-2 col-6">
                        <h6
                            className="fw-bold mb-3 text-uppercase"
                            style={{ color: "var(--gold)", letterSpacing: "1px" }}
                        >
                            Categories
                        </h6>
                        <ul className="list-unstyled">
                            {["news", "gist", "gossip", "entertainment", "lifestyle","sports","tech"].map((cat) => (
                                <li key={cat} className="mb-2">
                                    <Link
                                        to={`/category/${cat}`}
                                        className="text-capitalize"
                                        style={{
                                            color: "#cccccc",
                                            fontSize: "14px",
                                            textDecoration: "none"
                                        }}
                                        onMouseEnter={(e) => e.target.style.color = "var(--gold)"}
                                        onMouseLeave={(e) => e.target.style.color = "#cccccc"}
                                    >
                                        → {cat}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* QUICK LINKS COLUMN */}
                    <div className="col-md-2 col-6">
                        <h6
                            className="fw-bold mb-3 text-uppercase"
                            style={{ color: "var(--gold)", letterSpacing: "1px" }}
                        >
                            Quick Links
                        </h6>
                        <ul className="list-unstyled">
                            {[
                                { label: "Home", path: "/" },
                                { label: "Trending", path: "/" },
                                { label: "Login", path: "/login" },
                                { label: "Register", path: "/register" },
                                { label: "Write a Post", path: "/dashboard/create" },
                            ].map((link) => (
                                <li key={link.label} className="mb-2">
                                    <Link
                                        to={link.path}
                                        style={{
                                            color: "#cccccc",
                                            fontSize: "14px",
                                            textDecoration: "none"
                                        }}
                                        onMouseEnter={(e) => e.target.style.color = "var(--gold)"}
                                        onMouseLeave={(e) => e.target.style.color = "#cccccc"}
                                    >
                                        → {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* NEWSLETTER COLUMN */}
                    <div className="col-md-4">
                        <h6
                            className="fw-bold mb-3 text-uppercase"
                            style={{ color: "var(--gold)", letterSpacing: "1px" }}
                        >
                            Get The Latest Gist
                        </h6>
                        <p style={{ fontSize: "14px", color: "#cccccc" }}>
                            Subscribe to our newsletter and never miss a hot story!
                        </p>
                        <div className="input-group mt-2">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter your email..."
                                style={{ fontSize: "14px" }}
                            />
                            <button
                                className="btn fw-bold"
                                style={{ backgroundColor: "var(--gold)", color: "var(--text)" }}
                            >
                                Subscribe
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* BOTTOM BAR */}
            <div style={{ backgroundColor: "#004d00", borderTop: "1px solid #005500" }}>
                <div className="container py-3 d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <small style={{ color: "#aaaaaa", fontSize: "13px" }}>
                        © {new Date().getFullYear()} Amebonaija 🇳🇬. All rights reserved.
                    </small>
                </div>
            </div>

        </footer>
    );
};

export default Footer;