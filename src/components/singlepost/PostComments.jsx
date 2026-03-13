import { useState } from "react";
import { FaUserCircle, FaComment, FaEllipsisV, FaEdit, FaTrash, FaCheck, FaTimes, FaThumbsUp } from "react-icons/fa";

const PostComments = ({
  comments,
  isLoggedIn,
  user,
  comment,
  setComment,
  commentLoading,
  commentLikes,
  onSubmit,
  onDelete,
  onEdit,
  onLike,
  formatDate,
}) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const handleEditComment = (commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditText(currentText);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditText("");
  };

  const handleSaveEdit = async (commentId) => {
    if (!editText.trim()) return;
    setEditLoading(true);
    try {
      await onEdit(commentId, editText);
      setEditingCommentId(null);
      setEditText("");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="mt-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
      <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
        <FaComment color="var(--green)" />
        Comments ({comments?.length || 0})
      </h6>

      {/* COMMENT FORM */}
      <form onSubmit={onSubmit} className="mb-4">
        <textarea
          className="form-control mb-2"
          rows={3}
          placeholder={isLoggedIn ? "Share your thoughts..." : "Login to leave a comment"}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={!isLoggedIn}
          style={{ fontSize: "14px", borderColor: "var(--border)", resize: "none" }}
        />
        <button
          type="submit"
          className="btn btn-sm fw-semibold"
          disabled={commentLoading || !isLoggedIn}
          style={{ backgroundColor: "var(--green)", color: "white" }}
        >
          {commentLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-1" />
              Posting...
            </>
          ) : (
            "Post Comment"
          )}
        </button>
      </form>

      {comments?.length === 0 && (
        <p style={{ color: "var(--gray)", fontSize: "14px" }}>
          No comments yet. Be the first to share your thoughts! 💬
        </p>
      )}

      {/* COMMENTS LIST */}
      {comments?.map((c) => (
        <div
          key={c._id}
          className="d-flex gap-3 mb-3 p-3 rounded"
          style={{ backgroundColor: "var(--light-green)" }}
        >
          <FaUserCircle size={28} color="var(--green)" className="flex-shrink-0 mt-1" />
          <div className="w-100">
            {/* COMMENT HEADER */}
            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-0 fw-semibold" style={{ fontSize: "13px" }}>
                {c.user?.firstName} {c.user?.lastName}
              </p>
              <div className="d-flex align-items-center gap-2">
                <small style={{ color: "var(--gray)", fontSize: "11px" }}>
                  {formatDate(c.createdAt)}
                </small>

                {/* ELLIPSIS MENU — owner/admin only */}
                {(user?.id === c.user?._id || user?.roles === "admin") &&
                  editingCommentId !== c._id && (
                    <div className="position-relative">
                      <FaEllipsisV
                        size={13}
                        style={{ cursor: "pointer", color: "var(--gray)" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === c._id ? null : c._id);
                        }}
                      />
                      {openMenuId === c._id && (
                        <div
                          className="position-absolute bg-white rounded shadow-sm d-flex flex-column"
                          style={{
                            right: 0,
                            top: "20px",
                            zIndex: 10,
                            minWidth: "110px",
                            border: "1px solid var(--border)",
                          }}
                        >
                          {user?.id === c.user?._id &&
                            Date.now() - new Date(c.createdAt).getTime() < 10 * 60 * 1000 && (
                              <button
                                onClick={() => {
                                  handleEditComment(c._id, c.text);
                                  setOpenMenuId(null);
                                }}
                                className="btn btn-sm text-start d-flex justify-content-between align-items-center gap-2 px-3 py-2"
                                style={{
                                  color: "var(--green)",
                                  border: "none",
                                  background: "none",
                                  fontSize: "13px",
                                  borderBottom: "1px solid var(--border)",
                                }}
                              >
                                <span>Edit</span>
                                <FaEdit size={11} />
                              </button>
                            )}
                          {(user?.id === c.user?._id || user?.roles === "admin") && (
                            <button
                              onClick={() => {
                                onDelete(c._id);
                                setOpenMenuId(null);
                              }}
                              className="btn btn-sm text-start justify-content-between d-flex align-items-center gap-2 px-3 py-2"
                              style={{
                                color: "var(--red)",
                                border: "none",
                                background: "none",
                                fontSize: "13px",
                              }}
                            >
                              <span>Delete</span>
                              <FaTrash size={11} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </div>

            {/* COMMENT BODY */}
            {editingCommentId === c._id ? (
              <div className="mt-2">
                <textarea
                  className="form-control mb-2"
                  rows={2}
                  autoFocus
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{ fontSize: "13px", resize: "none" }}
                />
                <div className="d-flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(c._id)}
                    className="btn btn-sm fw-semibold d-flex align-items-center gap-1"
                    disabled={editLoading}
                    style={{ backgroundColor: "var(--green)", color: "white", fontSize: "12px" }}
                  >
                    {editLoading ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      <><FaCheck size={10} /> Save</>
                    )}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="btn btn-sm d-flex align-items-center gap-1"
                    style={{ border: "1px solid var(--border)", color: "var(--gray)", fontSize: "12px" }}
                  >
                    <FaTimes size={10} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-0 mt-1" style={{ fontSize: "14px", color: "var(--text)" }}>
                  {c.text}
                </p>
                {c.editedAt && (
                  <small style={{ color: "var(--gray)", fontSize: "11px", fontStyle: "italic" }}>
                    edited
                  </small>
                )}
                {/* LIKE BUTTON — visible to all */}
                <button
                  onClick={() => onLike(c._id)}
                  className="btn btn-sm d-flex align-items-center gap-1 mt-1"
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: commentLikes[c._id]?.liked ? "var(--green)" : "var(--gray)",
                    fontSize: "12px",
                    padding: "2px 0",
                  }}
                >
                  <FaThumbsUp size={12} /> {commentLikes[c._id]?.count || 0}
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostComments;