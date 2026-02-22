import { useState , useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import MessageToast from "../../components/ui/MessageToast";
import { FaPen, FaImage } from "react-icons/fa";
import { useFormik } from "formik";
import * as yup from "yup";

const CreatePost = () => {
    const { isLoggedIn } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [base64Image, setBase64Image] = useState("");

    useEffect(() => {
        if (!isLoggedIn) navigate("/login");
    }, [isLoggedIn]);

    // Convert image file to base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size - max 5MB
            if (file.size > 5 * 1024 * 1024) {
                setMessage("Image size must be less than 5MB");
                setMessageType("error");
                return;
            }
            const base64 = await convertToBase64(file);
            setBase64Image(base64);
            setImagePreview(base64);
        }
    };

    const formik = useFormik({
        initialValues: {
            title: "",
            content: "",
            category: "",
            tags: "",
            status: "draft",
        },

        validationSchema: yup.object({
            title: yup.string().required("Title is required"),
            content: yup
                .string()
                .required("Content is required")
                .min(50, "Content must be at least 50 characters"),
            category: yup.string().required("Category is required"),
            status: yup.string().required("Status is required"),
        }),

        onSubmit: async (values) => {
            setLoading(true);
            setMessage("");
            try {
                // Convert tags string to array
                const tagsArray = values.tags
                    ? values.tags.split(",").map((t) => t.trim()).filter(Boolean)
                    : [];

                // Send as regular JSON now, no FormData needed
                const payload = {
                    title: values.title,
                    content: values.content,
                    category: values.category,
                    status: values.status,
                    tags: tagsArray,
                    image: base64Image || "",
                };

                await API.post("/posts", payload);

                setMessage("Post created successfully! It will be reviewed by an admin before publishing.");
                setMessageType("success");
                setTimeout(() => navigate("/dashboard/my-posts"), 2000);

            } catch (err) {
                console.log("Error:", err.response?.data);
                setMessage(err.response?.data?.message || "Failed to create post");
                setMessageType("error");
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
            <div className="container py-5">

                {/* HEADER */}
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                        <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
                            <FaPen color="var(--green)" /> Write a New Post
                        </h4>
                        <p style={{ color: "var(--gray)", fontSize: "14px" }}>
                            Your post will be reviewed by an admin before going live
                        </p>
                    </div>
                    <Link
                        to="/dashboard"
                        className="btn btn-sm fw-semibold"
                        style={{ border: "1px solid var(--green)", color: "var(--green)" }}
                    >
                        ← Back to Dashboard
                    </Link>
                </div>

                {/* MESSAGE TOAST */}
                {message && (
                    <div className="mb-3">
                        <MessageToast message={message} messageType={messageType} />
                    </div>
                )}

                <div className="bg-white rounded shadow-sm p-4">
                    <form onSubmit={formik.handleSubmit}>

                        {/* TITLE */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold" style={{ fontSize: "13px" }}>
                                Post Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                className={`form-control ${formik.touched.title && formik.errors.title ? "is-invalid" : ""}`}
                                placeholder="e.g. Davido surprises fans at Lekki concert"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                style={{ fontSize: "14px" }}
                            />
                            {formik.touched.title && formik.errors.title && (
                                <div className="invalid-feedback">{formik.errors.title}</div>
                            )}
                        </div>

                        {/* CATEGORY & STATUS */}
                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold" style={{ fontSize: "13px" }}>
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    className={`form-select ${formik.touched.category && formik.errors.category ? "is-invalid" : ""}`}
                                    value={formik.values.category}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{ fontSize: "14px" }}
                                >
                                    <option value="">Select a category</option>
                                    {["news", "gist", "gossip", "entertainment", "lifestyle"].map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                {formik.touched.category && formik.errors.category && (
                                    <div className="invalid-feedback">{formik.errors.category}</div>
                                )}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold" style={{ fontSize: "13px" }}>
                                    Status *
                                </label>
                                <select
                                    name="status"
                                    className="form-select"
                                    value={formik.values.status}
                                    onChange={formik.handleChange}
                                    style={{ fontSize: "14px" }}
                                >
                                    <option value="draft">Draft (save for later)</option>
                                    <option value="pending">Submit for Review</option>
                                </select>
                            </div>
                        </div>

                        {/* TAGS */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold" style={{ fontSize: "13px" }}>
                                Tags{" "}
                                <span style={{ color: "var(--gray)", fontWeight: "400" }}>
                                    (optional — separate with commas)
                                </span>
                            </label>
                            <input
                                type="text"
                                name="tags"
                                className="form-control"
                                placeholder="e.g. davido, music, concert, lagos"
                                value={formik.values.tags}
                                onChange={formik.handleChange}
                                style={{ fontSize: "14px" }}
                            />
                        </div>

                        {/* IMAGE UPLOAD */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold" style={{ fontSize: "13px" }}>
                                Cover Image{" "}
                                <span style={{ color: "var(--gray)", fontWeight: "400" }}>(optional, max 5MB)</span>
                            </label>

                            {/* IMAGE PREVIEW */}
                            {imagePreview && (
                                <div className="mb-2 position-relative">
                                    <img
                                        src={imagePreview}
                                        alt="preview"
                                        style={{
                                            width: "100%",
                                            maxHeight: "250px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            border: "1px solid var(--border)"
                                        }}
                                    />
                                    {/* REMOVE IMAGE BUTTON */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImagePreview(null);
                                            setBase64Image("");
                                        }}
                                        className="btn btn-sm position-absolute top-0 end-0 m-2"
                                        style={{ backgroundColor: "var(--red)", color: "white", fontSize: "11px" }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}

                            <div
                                className="d-flex align-items-center justify-content-center rounded"
                                style={{
                                    border: "2px dashed var(--border)",
                                    padding: "20px",
                                    cursor: "pointer",
                                    backgroundColor: "var(--light-green)"
                                }}
                                onClick={() => document.getElementById("imageInput").click()}
                            >
                                <div className="text-center">
                                    <FaImage size={24} color="var(--green)" />
                                    <p className="mb-0 mt-2" style={{ fontSize: "13px", color: "var(--gray)" }}>
                                        {imagePreview ? "Click to change image" : "Click to upload image (JPG, PNG, WEBP)"}
                                    </p>
                                </div>
                            </div>
                            <input
                                type="file"
                                id="imageInput"
                                accept="image/jpeg, image/png, image/webp"
                                style={{ display: "none" }}
                                onChange={handleImageChange}
                            />
                        </div>

                        {/* CONTENT */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold" style={{ fontSize: "13px" }}>
                                Content *
                            </label>
                            <textarea
                                name="content"
                                className={`form-control ${formik.touched.content && formik.errors.content ? "is-invalid" : ""}`}
                                rows={12}
                                placeholder="Write your full gist here..."
                                value={formik.values.content}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                style={{ fontSize: "14px", resize: "vertical" }}
                            />
                            {formik.touched.content && formik.errors.content && (
                                <div className="invalid-feedback">{formik.errors.content}</div>
                            )}
                            <small style={{ color: "var(--gray)", fontSize: "12px" }}>
                                {formik.values.content.length} characters
                            </small>
                        </div>

                        {/* SUBMIT BUTTONS */}
                        <div className="d-flex gap-3">
                            <button
                                type="submit"
                                className="btn fw-bold px-4"
                                disabled={loading}
                                style={{
                                    backgroundColor: "var(--green)",
                                    color: "white",
                                    fontSize: "14px"
                                }}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Saving...
                                    </>
                                ) : "Save Post"}
                            </button>
                            <Link
                                to="/dashboard"
                                className="btn fw-semibold px-4"
                                style={{
                                    border: "1px solid var(--border)",
                                    color: "var(--gray)",
                                    fontSize: "14px"
                                }}
                            >
                                Cancel
                            </Link>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;