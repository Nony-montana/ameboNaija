import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";
import MessageToast from "../../components/ui/MessageToast";
import {
  FaComment,
  FaSearch,
  FaTrash,
  FaUserCircle,
  FaClock,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { TbTrash } from "react-icons/tb";
import { BiInfoCircle } from "react-icons/bi";

const AdminComments = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null); // { slug, commentId, text }
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!user || user.roles !== "admin") {
      navigate("/");
      return;
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [page, search]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/comments", {
        params: { page, limit: 20, search },
      });
      setComments(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch {
      showMessage("Failed to fetch comments", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await API.delete(
        `/admin/posts/${deleteTarget.slug}/comment/${deleteTarget.commentId}`,
      );
      setComments(
        comments.filter((c) => c.comment._id !== deleteTarget.commentId),
      );
      setTotal(total - 1);
      showMessage("Comment deleted", "success");
      setDeleteTarget(null);
      document.getElementById("closeCommentDeleteModal").click();
    } catch {
      showMessage("Failed to delete comment", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (loading && comments.length === 0) return <Spinner />;

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <div className="container py-5">
        {/* HEADER */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <div>
            <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <FaComment color="var(--green)" /> Comments
            </h4>
            <p
              style={{ color: "var(--gray)", fontSize: "14px" }}
              className="mb-0"
            >
              {total} total comments across all posts
            </p>
          </div>
          <Link
            to="/admin/dashboard"
            className="btn btn-sm fw-semibold"
            style={{
              border: "1px solid var(--green)",
              color: "var(--green)",
              fontSize: "13px",
            }}
          >
            ← Admin Dashboard
          </Link>
        </div>

        {message && (
          <div className="mb-3">
            <MessageToast message={message} messageType={messageType} />
          </div>
        )}

        {/* SEARCH */}
        <div className="bg-white rounded shadow-sm p-3 mb-4">
          <div className="position-relative" style={{ maxWidth: "360px" }}>
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
              placeholder="Search by comment or name..."
              value={search}
              onChange={handleSearch}
              style={{ paddingLeft: "32px", fontSize: "14px" }}
            />
          </div>
        </div>

        {/* COMMENTS LIST */}
        {comments.length === 0 && !loading ? (
          <div className="text-center py-5 bg-white rounded shadow-sm">
            <FaComment size={32} color="var(--gray)" className="mb-3" />
            <p style={{ color: "var(--gray)", fontSize: "14px" }}>
              No comments found
            </p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {comments.map((item) => (
              <div
                key={item.comment._id}
                className="bg-white rounded shadow-sm p-3"
              >
                <div className="d-flex gap-3 overflow-hidden">
                  <FaUserCircle
                    size={32}
                    color="var(--green)"
                    className="flex-shrink-0 mt-1"
                  />

                  {/* KEY FIX: replace w-100 with minWidth:0 + flex:1 */}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    {/* TOP ROW */}
                    <div className="d-flex align-items-start justify-content-between gap-2">
                      <div style={{ minWidth: 0, overflow: "hidden" }}>
                        <span
                          className="fw-semibold d-block text-truncate"
                          style={{ fontSize: "13px" }}
                        >
                          {item.commenter?.firstName} {item.commenter?.lastName}
                        </span>
                        <small
                          className="d-block text-truncate"
                          style={{ color: "var(--gray)", fontSize: "11px" }}
                        >
                          {item.commenter?.email}
                        </small>
                      </div>
                      <div className="d-flex align-items-center gap-3 flex-shrink-0">
                        <small
                          style={{
                            color: "var(--gray)",
                            fontSize: "11px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <FaClock size={9} />{" "}
                          {formatDate(item.comment.createdAt)}
                        </small>
                        <button
                          onClick={() =>
                            setDeleteTarget({
                              slug: item.postSlug,
                              commentId: item.comment._id,
                              text: item.comment.text,
                            })
                          }
                          className="btn btn-sm p-0"
                          data-bs-toggle="modal"
                          data-bs-target="#commentDeleteModal"
                          style={{
                            color: "var(--red)",
                            background: "none",
                            border: "none",
                          }}
                          title="Delete comment"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>

                    {/* COMMENT TEXT */}
                    <p
                      className="mt-2 mb-2"
                      style={{
                        fontSize: "14px",
                        color: "var(--text)",
                        wordBreak: "break-word",
                      }}
                    >
                      {item.comment.text}
                    </p>

                    {/* POST LINK */}
                    <div
                      className="d-flex align-items-center gap-1"
                      style={{ fontSize: "12px", minWidth: 0 }}
                    >
                      <span style={{ color: "var(--gray)", flexShrink: 0 }}>
                        On:
                      </span>
                      <Link
                        to={`/post/${item.postSlug}`}
                        target="_blank"
                        className="d-flex align-items-center gap-1"
                        style={{
                          color: "var(--green)",
                          textDecoration: "none",
                          fontWeight: "600",
                          minWidth: 0,
                          overflow: "hidden",
                        }}
                      >
                        <span className="text-truncate d-block">
                          {item.postTitle}
                        </span>
                        <FaExternalLinkAlt
                          size={9}
                          style={{ flexShrink: 0, marginLeft: "3px" }}
                        />
                      </Link>
                    </div>

                    {/* EDITED LABEL */}
                    {item.comment.editedAt && (
                      <small
                        style={{
                          color: "var(--gray)",
                          fontSize: "11px",
                          fontStyle: "italic",
                        }}
                      >
                        edited
                      </small>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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

      {/* DELETE MODAL */}
      <div
        className="modal fade"
        id="commentDeleteModal"
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
                <TbTrash /> Delete Comment
              </h5>
              <button
                type="button"
                className="btn-close"
                id="closeCommentDeleteModal"
                data-bs-dismiss="modal"
              />
            </div>
            <div className="modal-body pt-2">
              <p style={{ color: "var(--gray)", fontSize: "14px" }}>
                Are you sure you want to delete this comment?
              </p>
              {deleteTarget && (
                <div
                  className="p-3 rounded"
                  style={{
                    backgroundColor: "#f8d7da",
                    border: "1px solid #f5c6cb",
                  }}
                >
                  <p
                    className="mb-0"
                    style={{ fontSize: "14px", color: "#721c24" }}
                  >
                    "{deleteTarget.text}"
                  </p>
                </div>
              )}
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
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminComments;
