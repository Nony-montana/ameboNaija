import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import API from "../api/axios";
import { setSinglePost, clearSinglePost, setError } from "../store/slices/postSlice";
import Spinner from "../components/Spinner";
import MessageToast from "../components/ui/MessageToast";
import {
    FaEye, FaHeart, FaShareAlt, FaClock,
    FaUserCircle, FaTrash, FaComment
} from "react-icons/fa";

const SinglePost = () => {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { singlePost, loading } = useSelector((state) => state.posts);
    const { user, isLoggedIn } = useSelector((state) => state.auth);

    const [comment, setComment] = useState("");
    const [commentLoading, setCommentLoading] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [shareCount, setShareCount] = useState(0);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    // =====================
    // FETCH SINGLE POST
    // =====================
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await API.get(`/posts/${slug}`);
                dispatch(setSinglePost(res.data.data));
                setLikeCount(res.data.data.likes?.length || 0);
                setShareCount(res.data.data.shares || 0);

                // Check if current user already liked this post
                if (user && res.data.data.likes?.includes(user._id)) {
                    setLiked(true);
                }
            } catch (err) {
                dispatch(setError("Post not found"));
                navigate("/404");
            }
        };

        fetchPost();

        // Clear post when leaving the page
        return () => dispatch(clearSinglePost());
    }, [slug]);

    // =====================
    // FORMAT DATE
    // =====================
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-NG", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // =====================
    // LIKE / UNLIKE
    // =====================
    const handleLike = async () => {
        if (!isLoggedIn) {
            setMessage("Please login to like this post");
            setMessageType("error");
            return;
        }
        try {
            const res = await API.post(`/posts/${slug}/like`);
            setLiked(!liked);
            setLikeCount(res.data.totalLikes);
        } catch (err) {
            setMessage("Failed to like post");
            setMessageType("error");
        }
    };

    // =====================
    // SHARE
    // =====================
    const handleShare = async () => {
        try {
            await API.post(`/posts/${slug}/share`);
            setShareCount(shareCount + 1);
            // Copy link to clipboard
            navigator.clipboard.writeText(window.location.href);
            setMessage("Link copied to clipboard!");
            setMessageType("success");
        } catch (err) {
            setMessage("Failed to share post");
            setMessageType("error");
        }
    };

    // =====================
    // ADD COMMENT
    // =====================
    const handleComment = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            setMessage("Please login to comment");
            setMessageType("error");
            return;
        }
        if (!comment.trim()) {
            setMessage("Comment cannot be empty");
            setMessageType("error");
            return;
        }
        setCommentLoading(true);
        try {
            await API.post(`/posts/${slug}/comment`, { text: comment });
            setComment("");
            setMessage("Comment added successfully!");
            setMessageType("success");
            // Refresh post to show new comment
            const res = await API.get(`/posts/${slug}`);
            dispatch(setSinglePost(res.data.data));
        } catch (err) {
            setMessage("Failed to add comment");
            setMessageType("error");
        } finally {
            setCommentLoading(false);
        }
    };

    // =====================
    // DELETE COMMENT
    // =====================
    const handleDeleteComment = async (commentId) => {
        try {
            await API.delete(`/posts/${slug}/comment/${commentId}`);
            setMessage("Comment deleted");
            setMessageType("success");
            // Refresh post
            const res = await API.get(`/posts/${slug}`);
            dispatch(setSinglePost(res.data.data));
        } catch (err) {
            setMessage("Failed to delete comment");
            setMessageType("error");
        }
    };

    if (loading || !singlePost) return <Spinner />;

    return (
        <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
            <div className="container py-4">
                <div className="row g-4">

                    {/* LEFT - MAIN CONTENT */}
                    <div className="col-lg-8">
                        <div className="bg-white rounded shadow-sm p-4">

                            {/* CATEGORY & DATE */}
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <Link
                                    to={`/category/${singlePost.category}`}
                                    className="text-capitalize fw-bold"
                                    style={{
                                        backgroundColor: "var(--green)",
                                        color: "white",
                                        padding: "3px 10px",
                                        borderRadius: "4px",
                                        fontSize: "12px",
                                        textDecoration: "none"
                                    }}
                                >
                                    {singlePost.category}
                                </Link>
                                <small style={{ color: "var(--gray)", fontSize: "12px" }}>
                                    <FaClock size={10} /> {formatDate(singlePost.createdAt)}
                                </small>
                            </div>

                            {/* TITLE */}
                            <h1
                                className="fw-bold"
                                style={{
                                    fontSize: "26px",
                                    lineHeight: "1.4",
                                    color: "var(--text)"
                                }}
                            >
                                {singlePost.title}
                            </h1>

                            {/* AUTHOR */}
                            <div className="d-flex align-items-center gap-2 my-3">
                                <FaUserCircle size={32} color="var(--green)" />
                                <div>
                                    <p className="mb-0 fw-semibold" style={{ fontSize: "14px" }}>
                                        {singlePost.author?.firstName} {singlePost.author?.lastName}
                                    </p>
                                    <small style={{ color: "var(--gray)", fontSize: "12px" }}>
                                        {formatDate(singlePost.createdAt)}
                                    </small>
                                </div>
                            </div>

                            {/* COVER IMAGE */}
                            {singlePost.image && (
                                <div className="mb-4" style={{ borderRadius: "8px", overflow: "hidden" }}>
                                    <img
                                        src={singlePost.image}
                                        alt={singlePost.title}
                                        style={{ width: "100%", maxHeight: "450px", objectFit: "cover" }}
                                    />
                                </div>
                            )}

                            {/* TAGS */}
                            {singlePost.tags?.length > 0 && (
                                <div className="d-flex flex-wrap gap-2 mb-3">
                                    {singlePost.tags.map((tag, i) => (
                                        <span
                                            key={i}
                                            style={{
                                                backgroundColor: "var(--light-green)",
                                                color: "var(--green)",
                                                padding: "3px 10px",
                                                borderRadius: "20px",
                                                fontSize: "12px",
                                                fontWeight: "600"
                                            }}
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* CONTENT */}
                            <div
                                style={{
                                    fontSize: "16px",
                                    lineHeight: "1.9",
                                    color: "var(--text)",
                                    borderTop: "1px solid var(--border)",
                                    paddingTop: "20px"
                                }}
                            >
                                {singlePost.content}
                            </div>

                            {/* STATS & ACTIONS */}
                            <div
                                className="d-flex align-items-center gap-3 mt-4 pt-3"
                                style={{ borderTop: "1px solid var(--border)" }}
                            >
                                {/* VIEWS */}
                                <span style={{ color: "var(--gray)", fontSize: "14px" }}>
                                    <FaEye size={14} /> {singlePost.views} views
                                </span>

                                {/* LIKE BUTTON */}
                                <button
                                    onClick={handleLike}
                                    className="btn btn-sm d-flex align-items-center gap-1"
                                    style={{
                                        backgroundColor: liked ? "#ffe6e6" : "var(--light-green)",
                                        color: liked ? "var(--red)" : "var(--green)",
                                        border: "none",
                                        fontWeight: "600",
                                        fontSize: "13px"
                                    }}
                                >
                                    <FaHeart /> {likeCount} {liked ? "Liked" : "Like"}
                                </button>

                                {/* SHARE BUTTON */}
                                <button
                                    onClick={handleShare}
                                    className="btn btn-sm d-flex align-items-center gap-1"
                                    style={{
                                        backgroundColor: "var(--light-green)",
                                        color: "var(--green)",
                                        border: "none",
                                        fontWeight: "600",
                                        fontSize: "13px"
                                    }}
                                >
                                    <FaShareAlt /> {shareCount} Share
                                </button>
                            </div>

                            {/* MESSAGE TOAST */}
                            {message && (
                                <div className="mt-3">
                                    <MessageToast
                                        message={message}
                                        messageType={messageType}
                                    />
                                </div>
                            )}

                            {/* COMMENTS SECTION */}
                            <div className="mt-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                    <FaComment color="var(--green)" />
                                    Comments ({singlePost.comments?.length || 0})
                                </h6>

                                {/* COMMENT FORM */}
                                <form onSubmit={handleComment} className="mb-4">
                                    <textarea
                                        className="form-control mb-2"
                                        rows={3}
                                        placeholder={isLoggedIn ? "Share your thoughts..." : "Login to leave a comment"}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        disabled={!isLoggedIn}
                                        style={{
                                            fontSize: "14px",
                                            borderColor: "var(--border)",
                                            resize: "none"
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-sm fw-semibold"
                                        disabled={commentLoading || !isLoggedIn}
                                        style={{
                                            backgroundColor: "var(--green)",
                                            color: "white"
                                        }}
                                    >
                                        {commentLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-1" />
                                                Posting...
                                            </>
                                        ) : "Post Comment"}
                                    </button>
                                </form>

                                {/* COMMENTS LIST */}
                                {singlePost.comments?.length === 0 && (
                                    <p style={{ color: "var(--gray)", fontSize: "14px" }}>
                                        No comments yet. Be the first to share your thoughts! 💬
                                    </p>
                                )}

                                {singlePost.comments?.map((c) => (
                                    <div
                                        key={c._id}
                                        className="d-flex gap-3 mb-3 p-3 rounded"
                                        style={{ backgroundColor: "var(--light-green)" }}
                                    >
                                        <FaUserCircle size={28} color="var(--green)" className="flex-shrink-0 mt-1" />
                                        <div className="w-100">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="mb-0 fw-semibold" style={{ fontSize: "13px" }}>
                                                    {c.user?.firstName} {c.user?.lastName}
                                                </p>
                                                <div className="d-flex align-items-center gap-2">
                                                    <small style={{ color: "var(--gray)", fontSize: "11px" }}>
                                                        {formatDate(c.createdAt)}
                                                    </small>
                                                    {/* Show delete only to comment owner or admin */}
                                                    {(user?._id === c.user?._id || user?.roles === "admin") && (
                                                        <button
                                                            onClick={() => handleDeleteComment(c._id)}
                                                            className="btn btn-sm p-0"
                                                            style={{ color: "var(--red)", border: "none", background: "none" }}
                                                        >
                                                            <FaTrash size={11} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="mb-0 mt-1" style={{ fontSize: "14px", color: "var(--text)" }}>
                                                {c.text}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT - SIDEBAR */}
                    <div className="col-lg-4">

                        {/* TAGS WIDGET */}
                        {singlePost.tags?.length > 0 && (
                            <div
                                className="p-3 rounded shadow-sm mb-4"
                                style={{ backgroundColor: "white", border: "1px solid var(--border)" }}
                            >
                                <h6
                                    className="fw-bold mb-3 pb-2"
                                    style={{ borderBottom: "2px solid var(--green)" }}
                                >
                                    Tags
                                </h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {singlePost.tags.map((tag, i) => (
                                        <span
                                            key={i}
                                            style={{
                                                backgroundColor: "var(--light-green)",
                                                color: "var(--green)",
                                                padding: "4px 12px",
                                                borderRadius: "20px",
                                                fontSize: "12px",
                                                fontWeight: "600"
                                            }}
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CATEGORIES WIDGET */}
                        <div
                            className="p-3 rounded shadow-sm"
                            style={{ backgroundColor: "white", border: "1px solid var(--border)" }}
                        >
                            <h6
                                className="fw-bold mb-3 pb-2"
                                style={{ borderBottom: "2px solid var(--green)" }}
                            >
                                Browse Categories
                            </h6>
                            <div className="d-flex flex-wrap gap-2">
                                {["news", "gist", "gossip", "entertainment", "lifestyle"].map((cat) => (
                                    <Link
                                        key={cat}
                                        to={`/category/${cat}`}
                                        className="text-capitalize"
                                        style={{
                                            backgroundColor: singlePost.category === cat ? "var(--green)" : "var(--light-green)",
                                            color: singlePost.category === cat ? "white" : "var(--green)",
                                            padding: "5px 12px",
                                            borderRadius: "20px",
                                            fontSize: "13px",
                                            fontWeight: "600",
                                            textDecoration: "none",
                                            border: "1px solid var(--green)"
                                        }}
                                    >
                                        {cat}
                                    </Link>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SinglePost;