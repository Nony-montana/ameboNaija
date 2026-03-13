import { FaEye, FaHeart, FaShareAlt } from "react-icons/fa";

const PostActions = ({ views, liked, likeCount, shareCount, onLike, onShare }) => {
  return (
    <div
      className="d-flex align-items-center gap-3 mt-4 pt-3"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <span style={{ color: "var(--gray)", fontSize: "14px" }}>
        <FaEye size={14} /> {views} views
      </span>

      <button
        onClick={onLike}
        className="btn btn-sm d-flex align-items-center gap-1"
        style={{
          backgroundColor: liked ? "#ffe6e6" : "var(--light-green)",
          color: liked ? "var(--red)" : "var(--green)",
          border: "none",
          fontWeight: "600",
          fontSize: "13px",
        }}
      >
        <FaHeart /> {likeCount} {liked ? "Liked" : "Like"}
      </button>

      <button
        onClick={onShare}
        className="btn btn-sm d-flex align-items-center gap-1"
        style={{
          backgroundColor: "var(--light-green)",
          color: "var(--green)",
          border: "none",
          fontWeight: "600",
          fontSize: "13px",
        }}
      >
        <FaShareAlt /> {shareCount} Share
      </button>
    </div>
  );
};

export default PostActions;