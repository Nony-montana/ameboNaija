import { Link } from "react-router-dom";
import { FaEye, FaHeart, FaClock, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useState } from "react";
import { useSelector } from "react-redux";
import API from "../api/axios";

const PostCard = ({ post, savedIds = [] }) => {
    const { isLoggedIn } = useSelector((state) => state.auth);
    const [bookmarked, setBookmarked] = useState(savedIds.includes(post._id));
    const [bookmarkLoading, setBookmarkLoading] = useState(false);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-NG", {
            day: "numeric", month: "short", year: "numeric",
        });
    };

    const handleBookmark = async (e) => {
        e.preventDefault(); // prevent navigating to post
        if (!isLoggedIn) return;
        setBookmarkLoading(true);
        try {
            const res = await API.post(`/bookmark/${post._id}`);
            setBookmarked(res.data.bookmarked);
        } catch {
            console.log("Bookmark failed");
        } finally {
            setBookmarkLoading(false);
        }
    };

    return (
        <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: "10px", overflow: "hidden" }}>
            {/* POST IMAGE */}
            <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
                <img
                    src={post.image || "https://placehold.co/400x200?text=Amebo+Naija"}
                    alt={post.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }}
                    onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                    onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                />
                {/* CATEGORY BADGE */}
                <span
                    className="position-absolute top-0 start-0 m-2 text-white text-capitalize fw-bold"
                    style={{
                        backgroundColor: "var(--green)", fontSize: "11px",
                        padding: "3px 8px", borderRadius: "4px",
                    }}
                >
                    {post.category}
                </span>

                {/* BOOKMARK BUTTON */}
                {isLoggedIn && (
                    <button
                        onClick={handleBookmark}
                        disabled={bookmarkLoading}
                        title={bookmarked ? "Remove bookmark" : "Save post"}
                        className="position-absolute top-0 end-0 m-2 btn btn-sm"
                        style={{
                            backgroundColor: "rgba(0,0,0,0.55)", border: "none",
                            color: bookmarked ? "#fbbf24" : "white",
                            borderRadius: "6px", padding: "4px 8px",
                            transition: "color 0.2s",
                        }}
                    >
                        {bookmarked ? <FaBookmark size={13} /> : <FaRegBookmark size={13} />}
                    </button>
                )}
            </div>

            {/* POST BODY */}
            <div className="card-body d-flex flex-column">
                {/* TITLE */}
                <Link to={`/post/${post.slug}`}>
                    <h6
                        className="card-title fw-bold"
                        style={{
                            color: "var(--text)", fontSize: "15px", lineHeight: "1.5",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                        onMouseEnter={(e) => e.target.style.color = "var(--green)"}
                        onMouseLeave={(e) => e.target.style.color = "var(--text)"}
                    >
                        {post.title}
                    </h6>
                </Link>

                {/* AUTHOR & DATE */}
                <p style={{ fontSize: "12px", color: "var(--gray)" }} className="mt-1">
                    By <span className="fw-semibold" style={{ color: "var(--green)" }}>
                        {post.author?.firstName} {post.author?.lastName}
                    </span> &nbsp;·&nbsp;
                    <FaClock size={10} /> {formatDate(post.createdAt)}
                </p>

                {/* STATS */}
                <div className="d-flex gap-3 mt-auto pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                    <small style={{ color: "var(--gray)", fontSize: "12px" }}>
                        <FaEye size={12} /> {post.views} views
                    </small>
                    <small style={{ color: "var(--gray)", fontSize: "12px" }}>
                        <FaHeart size={12} /> {post.likes?.length} likes
                    </small>
                </div>
            </div>
        </div>
    );
};

export default PostCard;