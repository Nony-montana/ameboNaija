import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";
import MessageToast from "../../components/ui/MessageToast";
import {
  FaNewspaper,
  FaSearch,
  FaTrash,
  FaEye,
  FaCheck,
  FaTimes,
  FaClock,
  FaFilter,
  FaHeart,
} from "react-icons/fa";
import { TbTrash } from "react-icons/tb";
import { BiInfoCircle, BiShare } from "react-icons/bi";

const CATEGORIES = [
  "",
  "news",
  "gist",
  "gossip",
  "entertainment",
  "lifestyle",
  "sports",
];
const STATUSES = ["", "draft", "pending", "published", "rejected"];

const AdminPosts = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Delete modal
  const [deleteSlug, setDeleteSlug] = useState(null);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Reject modal
  const [rejectSlug, setRejectSlug] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);

  useEffect(() => {
    if (!user || user.roles !== "admin") {
      navigate("/");
      return;
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [page, search, category, status]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/posts", {
        params: { page, limit: 15, search, category, status },
      });
      setPosts(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch {
      showMessage("Failed to fetch posts", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  // ── APPROVE ──
  const handleApprove = async (slug) => {
    try {
      await API.put(`/posts/admin/approve/${slug}`);
      setPosts(
        posts.map((p) => (p.slug === slug ? { ...p, status: "published" } : p)),
      );
      showMessage("Post approved and published!", "success");
    } catch {
      showMessage("Failed to approve post", "error");
    }
  };

  // ── REJECT ──
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      showMessage("Please provide a reason for rejection", "error");
      return;
    }
    setRejectLoading(true);
    try {
      await API.put(`/posts/admin/reject/${rejectSlug}`, {
        reason: rejectReason,
      });
      setPosts(
        posts.map((p) =>
          p.slug === rejectSlug ? { ...p, status: "rejected" } : p,
        ),
      );
      showMessage("Post rejected", "success");
      setRejectSlug(null);
      setRejectReason("");
      document.getElementById("closeRejectModal").click();
    } catch {
      showMessage("Failed to reject post", "error");
    } finally {
      setRejectLoading(false);
    }
  };

  // ── DELETE ──
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await API.delete(`/admin/posts/${deleteSlug}`);
      setPosts(posts.filter((p) => p.slug !== deleteSlug));
      setTotal(total - 1);
      showMessage("Post deleted", "success");
      setDeleteSlug(null);
      document.getElementById("closeDeletePostModal").click();
    } catch {
      showMessage("Failed to delete post", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusStyle = (s) => {
    switch (s) {
      case "published":
        return { bg: "#d4edda", color: "#155724" };
      case "pending":
        return { bg: "#fff3cd", color: "#856404" };
      case "draft":
        return { bg: "#e2e3e5", color: "#383d41" };
      case "rejected":
        return { bg: "#f8d7da", color: "#721c24" };
      default:
        return { bg: "#e2e3e5", color: "#383d41" };
    }
  };

  if (loading && posts.length === 0) return <Spinner />;

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <div className="container py-5">
        {/* HEADER */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <div>
            <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <FaNewspaper color="var(--green)" /> Posts Management
            </h4>
            <p
              style={{ color: "var(--gray)", fontSize: "14px" }}
              className="mb-0"
            >
              {total} total posts
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-sm fw-semibold"
            style={{
              border: "1px solid var(--green)",
              color: "var(--green)",
              fontSize: "13px",
            }}
          >
            ← Back
          </button>
        </div>

        {message && (
          <div className="mb-3">
            <MessageToast message={message} messageType={messageType} />
          </div>
        )}

        {/* FILTERS */}
        <div className="bg-white rounded shadow-sm p-3 mb-4">
          <div className="row g-2 align-items-center">
            {/* SEARCH */}
            <div className="col-12 col-md-5">
              <div className="position-relative">
                <FaSearch
                  size={12}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--gray)",
                  }}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by title..."
                  value={search}
                  onChange={handleFilterChange(setSearch)}
                  style={{ paddingLeft: "32px", fontSize: "14px" }}
                />
              </div>
            </div>
            {/* CATEGORY */}
            <div className="col-6 col-md-3">
              <select
                className="form-select"
                value={category}
                onChange={handleFilterChange(setCategory)}
                style={{ fontSize: "14px" }}
              >
                <option value="">All Categories</option>
                {CATEGORIES.filter(Boolean).map((c) => (
                  <option key={c} value={c} className="text-capitalize">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            {/* STATUS */}
            <div className="col-6 col-md-3">
              <select
                className="form-select"
                value={status}
                onChange={handleFilterChange(setStatus)}
                style={{ fontSize: "14px" }}
              >
                <option value="">All Statuses</option>
                {STATUSES.filter(Boolean).map((s) => (
                  <option key={s} value={s} className="text-capitalize">
                    {s}
                  </option>
                ))}
              </select>
            </div>
            {/* RESET */}
            <div className="col-12 col-md-1">
              <button
                className="btn btn-sm w-100"
                onClick={() => {
                  setSearch("");
                  setCategory("");
                  setStatus("");
                  setPage(1);
                }}
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--gray)",
                  fontSize: "12px",
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* ── DESKTOP TABLE ── */}
        <div className="d-none d-md-block bg-white rounded shadow-sm overflow-hidden">
          <table className="table table-hover mb-0">
            <thead style={{ backgroundColor: "var(--light-green)" }}>
              <tr>
                <th
                  style={{
                    fontSize: "13px",
                    color: "var(--green)",
                    padding: "14px",
                  }}
                >
                  Post
                </th>
                <th style={{ fontSize: "13px", color: "var(--green)" }}>
                  Author
                </th>
                <th style={{ fontSize: "13px", color: "var(--green)" }}>
                  Category
                </th>
                <th style={{ fontSize: "13px", color: "var(--green)" }}>
                  Status
                </th>
                <th style={{ fontSize: "13px", color: "var(--green)" }}>
                  Stats
                </th>
                <th style={{ fontSize: "13px", color: "var(--green)" }}>
                  Date
                </th>
                <th style={{ fontSize: "13px", color: "var(--green)" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => {
                const s = getStatusStyle(post.status);
                return (
                  <tr key={post._id}>
                    {/* TITLE + IMAGE */}
                    <td style={{ padding: "14px" }}>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={
                            post.image ||
                            "https://placehold.co/60x40?text=No+Img"
                          }
                          alt={post.title}
                          style={{
                            width: "60px",
                            height: "40px",
                            objectFit: "cover",
                            borderRadius: "4px",
                            flexShrink: 0,
                          }}
                        />
                        <p
                          className="mb-0 fw-semibold"
                          style={{
                            fontSize: "13px",
                            maxWidth: "180px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {post.title}
                        </p>
                      </div>
                    </td>
                    {/* AUTHOR */}
                    <td
                      style={{
                        fontSize: "13px",
                        verticalAlign: "middle",
                        color: "var(--gray)",
                      }}
                    >
                      {post.author?.firstName} {post.author?.lastName}
                    </td>
                    {/* CATEGORY */}
                    <td style={{ fontSize: "13px", verticalAlign: "middle" }}>
                      <span className="text-capitalize">{post.category}</span>
                    </td>
                    {/* STATUS */}
                    <td style={{ verticalAlign: "middle" }}>
                      <span
                        className="text-capitalize fw-semibold"
                        style={{
                          fontSize: "11px",
                          padding: "3px 10px",
                          borderRadius: "20px",
                          backgroundColor: s.bg,
                          color: s.color,
                        }}
                      >
                        {post.status}
                      </span>
                    </td>
                    {/* STATS */}
                    <td
                      style={{
                        fontSize: "12px",
                        color: "var(--gray)",
                        verticalAlign: "middle",
                      }}
                    >
                      <div>
                        <FaEye /> {post.views} &nbsp;
                        <FaHeart color="var(--red)" /> {post.likes?.length || 0}{" "}
                        &nbsp; 💬 {post.comments?.length || 0} &nbsp;
                        <BiShare /> {post.shares || 0}
                      </div>
                    </td>
                    {/* DATE */}
                    <td
                      style={{
                        fontSize: "12px",
                        color: "var(--gray)",
                        verticalAlign: "middle",
                      }}
                    >
                      <FaClock size={10} />{" "}
                      {new Date(post.createdAt).toLocaleDateString("en-NG")}
                    </td>
                    {/* ACTIONS */}
                    <td style={{ verticalAlign: "middle" }}>
                      <div className="d-flex gap-1 flex-wrap">
                        {/* VIEW */}
                        <Link
                          to={`/posts/${post.slug}`}
                          target="_blank"
                          className="btn btn-sm d-flex align-items-center"
                          style={{
                            backgroundColor: "#f3f4f6",
                            color: "var(--gray)",
                            padding: "4px 8px",
                          }}
                          title="View post"
                        >
                          <FaEye size={11} />
                        </Link>
                        {/* APPROVE — only for pending posts */}
                        {post.status === "pending" && (
                          <button
                            onClick={() => handleApprove(post.slug)}
                            className="btn btn-sm d-flex align-items-center gap-1 fw-semibold"
                            style={{
                              backgroundColor: "#d4edda",
                              color: "#155724",
                              fontSize: "11px",
                              padding: "4px 8px",
                            }}
                            title="Approve"
                          >
                            <FaCheck size={10} /> Approve
                          </button>
                        )}
                        {/* REJECT — only for pending posts */}
                        {post.status === "pending" && (
                          <button
                            onClick={() => setRejectSlug(post.slug)}
                            className="btn btn-sm d-flex align-items-center gap-1 fw-semibold"
                            data-bs-toggle="modal"
                            data-bs-target="#rejectModal"
                            style={{
                              backgroundColor: "#fff3cd",
                              color: "#856404",
                              fontSize: "11px",
                              padding: "4px 8px",
                            }}
                            title="Reject"
                          >
                            <FaTimes size={10} /> Reject
                          </button>
                        )}
                        {/* DELETE */}
                        <button
                          onClick={() => {
                            setDeleteSlug(post.slug);
                            setDeleteTitle(post.title);
                          }}
                          className="btn btn-sm"
                          data-bs-toggle="modal"
                          data-bs-target="#deletePostModal"
                          style={{
                            backgroundColor: "#f8d7da",
                            color: "#dc2626",
                            padding: "4px 8px",
                          }}
                          title="Delete"
                        >
                          <FaTrash size={11} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {posts.length === 0 && !loading && (
            <div className="text-center py-5">
              <p style={{ color: "var(--gray)", fontSize: "14px" }}>
                No posts found
              </p>
            </div>
          )}
        </div>

        {/* ── MOBILE CARDS ── */}
        <div className="d-md-none d-flex flex-column gap-3">
          {posts.map((post) => {
            const s = getStatusStyle(post.status);
            return (
              <div key={post._id} className="bg-white rounded shadow-sm p-3">
                <div className="d-flex gap-3 mb-2">
                  <img
                    src={post.image || "https://placehold.co/70x50?text=No+Img"}
                    alt={post.title}
                    style={{
                      width: "70px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      flexShrink: 0,
                    }}
                  />
                  <div className="overflow-hidden">
                    <p
                      className="fw-semibold mb-1"
                      style={{
                        fontSize: "13px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {post.title}
                    </p>
                    <small style={{ color: "var(--gray)", fontSize: "11px" }}>
                      By {post.author?.firstName} {post.author?.lastName} ·{" "}
                      {post.category}
                    </small>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span
                    className="text-capitalize fw-semibold"
                    style={{
                      fontSize: "11px",
                      padding: "2px 8px",
                      borderRadius: "20px",
                      backgroundColor: s.bg,
                      color: s.color,
                    }}
                  >
                    {post.status}
                  </span>
                  <small style={{ color: "var(--gray)", fontSize: "11px" }}>
                    <div>
                      <FaEye /> {post.views} &nbsp;
                      <FaHeart color="var(--red)" /> {post.likes?.length || 0}{" "}
                      &nbsp; 💬 {post.comments?.length || 0} &nbsp;
                      <BiShare color="var(--green)" /> {post.shares || 0}
                    </div>
                  </small>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                  {post.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(post.slug)}
                        className="btn btn-sm fw-semibold flex-grow-1"
                        style={{
                          backgroundColor: "#d4edda",
                          color: "#155724",
                          fontSize: "12px",
                        }}
                      >
                        <FaCheck size={10} className="me-1" /> Approve
                      </button>
                      <button
                        onClick={() => setRejectSlug(post.slug)}
                        className="btn btn-sm fw-semibold flex-grow-1"
                        data-bs-toggle="modal"
                        data-bs-target="#rejectModal"
                        style={{
                          backgroundColor: "#fff3cd",
                          color: "#856404",
                          fontSize: "12px",
                        }}
                      >
                        <FaTimes size={10} className="me-1" /> Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      setDeleteSlug(post.slug);
                      setDeleteTitle(post.title);
                    }}
                    className="btn btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#deletePostModal"
                    style={{
                      backgroundColor: "#f8d7da",
                      color: "#dc2626",
                      padding: "6px 12px",
                    }}
                  >
                    <FaTrash size={11} />
                  </button>
                </div>
              </div>
            );
          })}
          {posts.length === 0 && !loading && (
            <div className="text-center py-5 bg-white rounded shadow-sm">
              <p style={{ color: "var(--gray)", fontSize: "14px" }}>
                No posts found
              </p>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
            <button
              className="btn btn-sm fw-semibold"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              style={{
                border: "1px solid var(--border)",
                color: "var(--gray)",
                fontSize: "13px",
              }}
            >
              ← Prev
            </button>
            <span style={{ fontSize: "13px", color: "var(--gray)" }}>
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-sm fw-semibold"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              style={{
                border: "1px solid var(--border)",
                color: "var(--gray)",
                fontSize: "13px",
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* REJECT MODAL */}
      <div
        className="modal fade"
        id="rejectModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content"
            style={{ borderRadius: "12px", border: "none" }}
          >
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">
                <FaTimes color="#856404" /> Reject Post
              </h5>
              <button
                type="button"
                className="btn-close"
                id="closeRejectModal"
                data-bs-dismiss="modal"
              />
            </div>
            <div className="modal-body">
              <p style={{ color: "var(--gray)", fontSize: "14px" }}>
                Please provide a reason so the author knows what to fix.
              </p>
              <textarea
                className="form-control"
                rows={4}
                placeholder="e.g. Content violates community guidelines..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                style={{ fontSize: "14px", resize: "none" }}
              />
            </div>
            <div className="modal-footer border-0 pt-0">
              <button
                type="button"
                className="btn fw-semibold"
                data-bs-dismiss="modal"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--gray)",
                  fontSize: "14px",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn fw-bold"
                onClick={handleReject}
                disabled={rejectLoading}
                style={{
                  backgroundColor: "#856404",
                  color: "white",
                  fontSize: "14px",
                }}
              >
                {rejectLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Rejecting...
                  </>
                ) : (
                  "Reject Post"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      <div
        className="modal fade"
        id="deletePostModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content"
            style={{ borderRadius: "12px", border: "none" }}
          >
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">
                <TbTrash /> Delete Post
              </h5>
              <button
                type="button"
                className="btn-close"
                id="closeDeletePostModal"
                data-bs-dismiss="modal"
              />
            </div>
            <div className="modal-body pt-2">
              <p style={{ color: "var(--gray)", fontSize: "14px" }}>
                Are you sure you want to delete this post?
              </p>
              <div
                className="p-3 rounded"
                style={{
                  backgroundColor: "#f8d7da",
                  border: "1px solid #f5c6cb",
                }}
              >
                <p
                  className="mb-0 fw-semibold"
                  style={{ fontSize: "14px", color: "#721c24" }}
                >
                  "{deleteTitle}"
                </p>
              </div>
              <p
                className="mt-3 mb-0"
                style={{ color: "#dc2626", fontSize: "13px" }}
              >
                <BiInfoCircle /> This action cannot be undone!
              </p>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button
                type="button"
                className="btn fw-semibold"
                data-bs-dismiss="modal"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--gray)",
                  fontSize: "14px",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn fw-bold"
                onClick={handleDelete}
                disabled={deleteLoading}
                style={{
                  backgroundColor: "#dc2626",
                  color: "white",
                  fontSize: "14px",
                }}
              >
                {deleteLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete Post"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPosts;
