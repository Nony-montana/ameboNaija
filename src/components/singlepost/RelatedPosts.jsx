import { Link } from "react-router-dom";
import { FaClock } from "react-icons/fa";

const getReadingTime = (text) => {
  if (!text) return "1 min read";
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  return `${minutes} min read`;
};

const RelatedPosts = ({ posts, category, formatDate }) => {
  if (!posts?.length) return null;

  return (
    <div className="mt-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
      <h6 className="fw-bold mb-3" style={{ color: "var(--text)" }}>
        More{" "}
        <span className="text-capitalize" style={{ color: "var(--green)" }}>
          {category}
        </span>{" "}
        Gist
      </h6>
      <div className="row g-3">
        {posts.map((post) => (
          <div className="col-12" key={post._id}>
            <Link to={`/post/${post.slug}`} style={{ textDecoration: "none" }}>
              <div
                className="d-flex gap-3 p-2 rounded"
                style={{
                  border: "1px solid var(--border)",
                  transition: "background 0.2s",
                  backgroundColor: "white",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--light-green)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "white")
                }
              >
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    style={{
                      width: "90px",
                      height: "70px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      flexShrink: 0,
                    }}
                  />
                )}
                <div className="d-flex flex-column justify-content-center">
                  <p
                    className="mb-1 fw-semibold"
                    style={{
                      fontSize: "13px",
                      color: "var(--text)",
                      lineHeight: "1.4",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {post.title}
                  </p>
                  <small style={{ color: "var(--gray)", fontSize: "11px" }}>
                    <FaClock size={9} /> {formatDate(post.createdAt)} ·{" "}
                    {getReadingTime(post.content)}
                  </small>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;