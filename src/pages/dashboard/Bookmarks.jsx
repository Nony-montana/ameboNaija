import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";
import { FaBookmark, FaEye, FaHeart, FaClock } from "react-icons/fa";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      const res = await API.get("/bookmarks");
      setBookmarks(res.data.data);
    } catch {
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleRemove = async (postId) => {
    try {
      await API.post(`/bookmark/${postId}`);
      setBookmarks((prev) => prev.filter((p) => p._id !== postId));
    } catch {
      console.log("Failed to remove bookmark");
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-NG", {
      day: "numeric", month: "short", year: "numeric",
    });

  const getExcerpt = (text, length = 100) => {
    if (!text) return "";
    return text.length > length ? text.slice(0, length).trim() + "..." : text;
  };

  if (loading) return <Spinner />;

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <div className="container py-4">

        {/* HEADER */}
        <div className="d-flex align-items-center gap-2 mb-4">
          <FaBookmark color="var(--green)" size={20} />
          <h5 className="fw-bold mb-0" style={{ color: "var(--text)" }}>
            My Bookmarks
            <span
              className="ms-2"
              style={{
                backgroundColor: "var(--light-green)", color: "var(--green)",
                padding: "2px 10px", borderRadius: "20px",
                fontSize: "13px", fontWeight: "600",
              }}
            >
              {bookmarks.length}
            </span>
          </h5>
        </div>

        {/* EMPTY STATE */}
        {bookmarks.length === 0 && (
          <div className="bg-white rounded shadow-sm p-5 text-center"
            style={{ border: "1px solid var(--border)" }}>
            <FaBookmark size={48} color="var(--border)" className="mb-3" />
            <h6 className="fw-bold" style={{ color: "var(--text)" }}>No bookmarks yet</h6>
            <p style={{ color: "var(--gray)", fontSize: "14px" }}>
              Save posts you want to read later by clicking the bookmark icon on any post.
            </p>
            <Link to="/" className="btn btn-sm fw-semibold"
              style={{ backgroundColor: "var(--green)", color: "white" }}>
              Browse Posts
            </Link>
          </div>
        )}

        {/* BOOKMARKS GRID */}
        {bookmarks.length > 0 && (
          <div className="row g-4">
            {bookmarks.map((post) => (
              <div className="col-md-6 col-lg-4" key={post._id}>
                <div className="bg-white rounded shadow-sm overflow-hidden h-100"
                  style={{ border: "1px solid var(--border)" }}>

                  {/* IMAGE */}
                  <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
                    <img
                      src={post.image || "https://placehold.co/400x180?text=Amebo+Naija"}
                      alt={post.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <span
                      className="position-absolute top-0 start-0 m-2 text-white text-capitalize fw-bold"
                      style={{
                        backgroundColor: "var(--green)", fontSize: "11px",
                        padding: "3px 8px", borderRadius: "4px",
                      }}
                    >
                      {post.category}
                    </span>
                    {/* REMOVE BOOKMARK BUTTON */}
                    <button
                      onClick={() => handleRemove(post._id)}
                      className="position-absolute top-0 end-0 m-2 btn btn-sm"
                      title="Remove bookmark"
                      style={{
                        backgroundColor: "rgba(0,0,0,0.55)", border: "none",
                        color: "#fbbf24", borderRadius: "6px", padding: "4px 8px",
                      }}
                    >
                      <FaBookmark size={13} />
                    </button>
                  </div>

                  {/* CONTENT */}
                  <div className="p-3 d-flex flex-column h-100">
                    <Link to={`/post/${post.slug}`} style={{ textDecoration: "none" }}>
                      <p className="fw-bold mb-1"
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
                    </Link>

                    <p style={{ fontSize: "13px", color: "var(--gray)", lineHeight: "1.5" }}>
                      {getExcerpt(post.content)}
                    </p>

                    <div className="d-flex align-items-center justify-content-between mt-auto pt-2"
                      style={{ borderTop: "1px solid var(--border)" }}>
                      <small style={{ color: "var(--gray)", fontSize: "12px" }}>
                        <FaClock size={10} /> {formatDate(post.createdAt)}
                      </small>
                      <div className="d-flex gap-2">
                        <small style={{ color: "var(--gray)", fontSize: "12px" }}>
                          <FaEye size={10} /> {post.views || 0}
                        </small>
                        <small style={{ color: "var(--gray)", fontSize: "12px" }}>
                          <FaHeart size={10} /> {post.likes?.length || 0}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;