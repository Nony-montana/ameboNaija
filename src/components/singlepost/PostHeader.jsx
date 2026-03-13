import { Link } from "react-router-dom";
import { FaClock, FaUserCircle } from "react-icons/fa";

const PostHeader = ({ post, formatDate, readingTime }) => {
  return (
    <>
      {/* CATEGORY, DATE & READING TIME */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <Link
          to={`/category/${post.category}`}
          className="text-capitalize fw-bold"
          style={{
            backgroundColor: "var(--green)",
            color: "white",
            padding: "3px 10px",
            borderRadius: "4px",
            fontSize: "12px",
            textDecoration: "none",
          }}
        >
          {post.category}
        </Link>
        <small style={{ color: "var(--gray)", fontSize: "12px" }}>
          <FaClock size={10} /> {formatDate(post.createdAt)}
        </small>
        <small style={{ color: "var(--gray)", fontSize: "12px" }}>
          · {readingTime}
        </small>
      </div>

      {/* TITLE */}
      <h1
        className="fw-bold"
        style={{ fontSize: "26px", lineHeight: "1.4", color: "var(--text)" }}
      >
        {post.title}
      </h1>

      {/* AUTHOR */}
      <div className="d-flex align-items-center gap-2 my-3">
        <FaUserCircle size={32} color="var(--green)" />
        <div>
          <Link
            to={`/author/${post.author?._id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <p className="mb-0 fw-semibold" style={{ fontSize: "14px" }}>
              {post.author?.firstName} {post.author?.lastName}
            </p>
          </Link>
          <small style={{ color: "var(--gray)", fontSize: "12px" }}>
            {formatDate(post.createdAt)}
          </small>
        </div>
      </div>
    </>
  );
};

export default PostHeader;