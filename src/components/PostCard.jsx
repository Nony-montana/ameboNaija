import { Link } from "react-router-dom";
import { FaEye, FaHeart, FaClock } from "react-icons/fa";

const PostCard = ({ post }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-NG", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
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
                        backgroundColor: "var(--green)",
                        fontSize: "11px",
                        padding: "3px 8px",
                        borderRadius: "4px"
                    }}
                >
                    {post.category}
                </span>
            </div>

            {/* POST BODY */}
            <div className="card-body d-flex flex-column">
                {/* TITLE */}
                <Link to={`/post/${post.slug}`}>
                    <h6
                        className="card-title fw-bold"
                        style={{
                            color: "var(--text)",
                            fontSize: "15px",
                            lineHeight: "1.5",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden"
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