import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import Spinner from "../components/Spinner";
import { FaUserCircle, FaClock, FaEye, FaHeart } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

const AuthorProfile = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/users/${id}/profile`);
        setAuthor(res.data.data.author);
        setPosts(res.data.data.posts);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-NG", {
      day: "numeric", month: "long", year: "numeric",
    });

  const getExcerpt = (text, length = 100) => {
    if (!text) return "";
    return text.length > length ? text.slice(0, length).trim() + "..." : text;
  };

  if (loading) return <Spinner />;

  if (notFound) {
    return (
      <div
        style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}
        className="d-flex align-items-center justify-content-center"
      >
        <div className="text-center">
          <h4 className="fw-bold">Author not found</h4>
          <Link to="/" style={{ color: "var(--green)" }}>Back to Home</Link>
        </div>
      </div>
    );
  }

  const fullName = `${author.firstName} ${author.lastName}`;

  return (
    <>
      <Helmet>
        <title>{fullName} | AmeboNaija</title>
        <meta name="description" content={`Read all posts by ${fullName} on AmeboNaija`} />
      </Helmet>

      <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
        <div className="container py-5">

          {/* ── AUTHOR CARD ─────────────────────────────────────── */}
          <div
            className="bg-white rounded shadow-sm p-4 mb-4 d-flex align-items-center gap-4"
            style={{ border: "1px solid var(--border)" }}
          >
            <FaUserCircle size={80} color="var(--green)" className="flex-shrink-0" />
            <div>
              <h3 className="fw-bold mb-1" style={{ color: "var(--text)" }}>
                {fullName}
              </h3>
              <p className="mb-1" style={{ color: "var(--gray)", fontSize: "14px" }}>
                <FaClock size={12} /> Member since {formatDate(author.createdAt)}
              </p>
              <span
                className="fw-semibold"
                style={{
                  backgroundColor: "var(--light-green)",
                  color: "var(--green)",
                  padding: "3px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                }}
              >
                {posts.length} {posts.length === 1 ? "Post" : "Posts"}
              </span>
            </div>
          </div>

          {/* ── POSTS ───────────────────────────────────────────── */}
          <h5 className="fw-bold mb-3" style={{ color: "var(--text)" }}>
            Posts by{" "}
            <span style={{ color: "var(--green)" }}>{author.firstName}</span>
          </h5>

          {posts.length === 0 ? (
            <div
              className="bg-white rounded shadow-sm p-5 text-center"
              style={{ border: "1px solid var(--border)" }}
            >
              <p style={{ color: "var(--gray)", fontSize: "15px" }}>
                This author hasn't published any posts yet.
              </p>
            </div>
          ) : (
            <div className="row g-4">
              {posts.map((post) => (
                <div className="col-md-6 col-lg-4" key={post._id}>
                  <Link to={`/post/${post.slug}`} style={{ textDecoration: "none" }}>
                    <div
                      className="bg-white rounded shadow-sm overflow-hidden h-100"
                      style={{
                        border: "1px solid var(--border)",
                        transition: "transform 0.2s, box-shadow 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "";
                      }}
                    >
                      {/* IMAGE */}
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          style={{ width: "100%", height: "180px", objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%", height: "180px",
                            backgroundColor: "var(--light-green)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >
                          <FaUserCircle size={48} color="var(--green)" />
                        </div>
                      )}

                      {/* CONTENT */}
                      <div className="p-3">
                        {/* CATEGORY */}
                        <span
                          className="text-capitalize fw-bold"
                          style={{
                            backgroundColor: "var(--green)", color: "white",
                            padding: "2px 8px", borderRadius: "4px",
                            fontSize: "11px",
                          }}
                        >
                          {post.category}
                        </span>

                        {/* TITLE */}
                        <p
                          className="fw-bold mt-2 mb-1"
                          style={{
                            fontSize: "14px", color: "var(--text)", lineHeight: "1.4",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {post.title}
                        </p>

                        {/* EXCERPT */}
                        <p style={{ fontSize: "13px", color: "var(--gray)", lineHeight: "1.5" }}>
                          {getExcerpt(post.content)}
                        </p>

                        {/* STATS */}
                        <div className="d-flex align-items-center gap-3 mt-2">
                          <small style={{ color: "var(--gray)", fontSize: "12px" }}>
                            <FaClock size={10} /> {formatDate(post.createdAt)}
                          </small>
                          <small style={{ color: "var(--gray)", fontSize: "12px" }}>
                            <FaEye size={10} /> {post.views || 0}
                          </small>
                          <small style={{ color: "var(--gray)", fontSize: "12px" }}>
                            <FaHeart size={10} /> {post.likes?.length || 0}
                          </small>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthorProfile;