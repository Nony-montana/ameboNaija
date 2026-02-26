import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import API from "../../api/axios";
import MessageToast from "../../components/ui/MessageToast";
import { FaEdit, FaImage } from "react-icons/fa";
import { useFormik } from "formik";
import * as yup from "yup";
import Spinner from "../../components/Spinner";

const EditPost = () => {
    const { slug } = useParams();
    const { isLoggedIn } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [imagePreview, setImagePreview] = useState(null);


    // Redirect if not logged in
    useEffect(() => {
        if (!isLoggedIn) navigate("/login");
    }, [isLoggedIn]);

    const formik = useFormik({
        initialValues: {
            title: "",
            content: "",
            category: "",
            tags: "",
            status: "draft",
            image: null,
        },

        validationSchema: yup.object({
            title: yup.string().required("Title is required"),
            content: yup.string().required("Content is required").min(50, "Content must be at least 50 characters"),
            category: yup.string().required("Category is required"),
        }),

        onSubmit: async (values) => {
            setLoading(true);
            setMessage("");
            try {
                const formData = new FormData();
                formData.append("title", values.title);
                formData.append("content", values.content);
                formData.append("category", values.category);
                formData.append("status", values.status);

                if (values.tags) {
                    const tagsArray = values.tags.split(",").map((t) => t.trim()).filter(Boolean);
                    // FIX: Send tags as a JSON string instead of repeated keys,
                    // so the backend can reliably parse it as an array regardless of multer config.
                    formData.append("tags", JSON.stringify(tagsArray));
                }

                if (values.image) {
                    formData.append("image", values.image);
                }

                // FIX: Let the browser set the Content-Type boundary automatically
                // by NOT manually setting "Content-Type": "multipart/form-data".
                // Manually setting it omits the boundary and breaks file uploads.
                await API.put(`/posts/${slug}`, formData);

                setMessage("Post updated! It will be reviewed by admin before publishing");
                setMessageType("success");
                setTimeout(() => navigate("/dashboard/my-posts"), 2000);

            } catch (err) {
                setMessage(err.response?.data?.message || "Failed to update post");
                setMessageType("error");
            } finally {
                setLoading(false);
            }
        },
    });

    // Fetch existing post data and populate form
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await API.get(`/posts/${slug}`);
                const post = res.data.data;

                // Fill the form with existing post data
                formik.setValues({
                    title: post.title || "",
                    content: post.content || "",
                    category: post.category || "",
                    tags: post.tags?.join(", ") || "",
                    // FIX: If a post was previously approved/published and is being
                    // re-edited, reset to "draft" so the user consciously re-submits.
                    // For posts already in draft or pending, preserve their status.
                    status: post.status === "published" ? "draft" : (post.status || "draft"),
                    image: null,
                });

                // Show existing image as preview
                if (post.image) setImagePreview(post.image);

            } catch (err) {
                setMessage("Failed to load post");
                setMessageType("error");
            } finally {
                setFetchLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            formik.setFieldValue("image", file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // FIX: Clean up object URLs to avoid memory leaks when component unmounts
    // or when a new image is selected.
    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    if (fetchLoading) return <Spinner />;

    return (
        <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
            <div className="container py-5">

                {/* HEADER */}
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                        <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
                            <FaEdit color="var(--green)" /> Edit Post
                        </h4>
                        <p style={{ color: "var(--gray)", fontSize: "14px" }}>
                            After editing, your post will be re-reviewed by admin
                        </p>
                    </div>
                    <Link
                        to="/dashboard/my-posts"
                        className="btn btn-sm fw-semibold"
                        style={{ border: "1px solid var(--green)", color: "var(--green)" }}
                    >
                        ← Back to My Posts
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
                                    {["news", "gist", "gossip", "entertainment", "lifestyle", "sports"].map((cat) => (
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
                                Tags <span style={{ color: "var(--gray)", fontWeight: "400" }}>(separate with commas)</span>
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
                                Cover Image
                                <span style={{ color: "var(--gray)", fontWeight: "400" }}>
                                    {imagePreview ? " (click to change)" : " (optional)"}
                                </span>
                            </label>

                            {/* IMAGE PREVIEW */}
                            {imagePreview && (
                                <div className="mb-2">
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
                                onClick={() => document.getElementById("editImageInput").click()}
                            >
                                <div className="text-center">
                                    <FaImage size={24} color="var(--green)" />
                                    <p className="mb-0 mt-2" style={{ fontSize: "13px", color: "var(--gray)" }}>
                                        {imagePreview ? "Click to change image" : "Click to upload image"}
                                    </p>
                                </div>
                            </div>
                            <input
                                type="file"
                                id="editImageInput"
                                accept="image/*"
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
                                ) : "Save Changes"}
                            </button>
                            <Link
                                to="/dashboard/my-posts"
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

export default EditPost;