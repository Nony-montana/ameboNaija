import { useEffect, useState, useRef } from "react";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";
import { FaBell, FaEllipsisH, FaTrash } from "react-icons/fa";
import { BsCheckAll } from "react-icons/bs";
import MessageToast from "../../components/ui/MessageToast";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "single" or "all"
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data.data);
    } catch (err) {
      showMessage("Failed to fetch notifications", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      setOpenMenu(null);
    } catch (err) {
      showMessage("Failed to mark as read", "error");
    }
  };

  const handleMarkAsUnread = async (id) => {
    try {
      await API.put(`/notifications/${id}/unread`);
      setNotifications(notifications.map((n) => (n._id === id ? { ...n, isRead: false } : n)));
      setOpenMenu(null);
    } catch (err) {
      showMessage("Failed to mark as unread", "error");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await API.put("/notifications/read-all");
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      showMessage("All notifications marked as read", "success");
    } catch (err) {
      showMessage("Failed to mark all as read", "error");
    }
  };

  // Open modal for single delete
  const confirmDelete = (id) => {
    setDeleteTargetId(id);
    setModalType("single");
    setOpenMenu(null);
    setShowModal(true);
  };

  // Open modal for clear all
  const confirmDeleteAll = () => {
    setModalType("all");
    setShowModal(true);
  };

  // Execute delete after confirmation
  const handleConfirm = async () => {
    setDeleteLoading(true);
    try {
      if (modalType === "single") {
        await API.delete(`/notifications/${deleteTargetId}`);
        setNotifications(notifications.filter((n) => n._id !== deleteTargetId));
        showMessage("Notification deleted", "success");
      } else {
        await API.delete("/notifications/all");
        setNotifications([]);
        showMessage("All notifications deleted", "success");
      }
    } catch (err) {
      showMessage("Failed to delete notification(s)", "error");
    } finally {
      setDeleteLoading(false);
      setShowModal(false);
      setDeleteTargetId(null);
    }
  };

  const formattedDate = (createdAt) => {
    const today = new Date();
    const pastDay = new Date(createdAt);
    const seconds = Math.floor((today - pastDay) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute(s) ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour(s) ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day(s) ago`;
    return pastDay.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case "approved": return { bg: "#d4edda", color: "#155724" };
      case "rejected": return { bg: "#f8d7da", color: "#721c24" };
      case "like": return { bg: "#fde8e8", color: "#dc2626" };
      case "comment": return { bg: "#e8f4fd", color: "#1d4ed8" };
      default: return { bg: "#f3f4f6", color: "var(--gray)" };
    }
  };

  const getNotificationText = (n) => {
    if (n.type === "approved" || n.type === "rejected") {
      return n.message;
    }
    return `${n.sender?.firstName} ${n.sender?.lastName} ${n.message}`;
  };

  if (loading) return <Spinner />;

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <div className="container py-5">
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <div>
            <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <FaBell color="var(--green)" /> Notifications
            </h4>
            <p style={{ color: "var(--gray)", fontSize: "14px" }} className="mb-0">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
            </p>
          </div>
          <div className="d-flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="btn btn-sm fw-semibold d-flex align-items-center gap-1"
                style={{ border: "1px solid var(--green)", color: "var(--green)", fontSize: "13px" }}
              >
                <BsCheckAll size={16} /> Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={confirmDeleteAll}
                className="btn btn-sm fw-semibold d-flex align-items-center gap-1"
                style={{ border: "1px solid #dc2626", color: "#dc2626", fontSize: "13px" }}
              >
                <FaTrash size={11} /> Clear all
              </button>
            )}
          </div>
        </div>

        {message && (
          <div className="mb-3">
            <MessageToast message={message} messageType={messageType} />
          </div>
        )}

        {notifications.length === 0 && (
          <div className="text-center py-5 bg-white rounded shadow-sm" style={{ border: "1px solid var(--border)" }}>
            <FaBell size={40} color="var(--gray)" />
            <h6 className="fw-bold mt-3">No notifications yet</h6>
            <p style={{ color: "var(--gray)", fontSize: "14px" }}>
              When someone likes or comments on your post, you'll see it here.
            </p>
          </div>
        )}

        <div className="d-flex flex-column gap-2">
          {notifications.map((n) => {
            const typeStyle = getTypeStyle(n.type);
            return (
              <div
                key={n._id}
                className="bg-white rounded shadow-sm"
                style={{
                  border: "1px solid var(--border)",
                  borderLeft: n.isRead ? "1px solid var(--border)" : "4px solid var(--green)",
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "12px",
                  backgroundColor: n.isRead ? "white" : "#f0fdf4",
                }}
              >
                <div onClick={() => handleMarkAsRead(n._id)} style={{ flex: 1 }}>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span
                      className="text-capitalize fw-semibold"
                      style={{
                        fontSize: "10px", padding: "2px 8px", borderRadius: "20px",
                        backgroundColor: typeStyle.bg, color: typeStyle.color,
                      }}
                    >
                      {n.type}
                    </span>
                    {!n.isRead && (
                      <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "var(--green)", display: "inline-block" }} />
                    )}
                  </div>
                  <p
                    className="mb-0"
                    style={{ fontSize: "14px", color: "var(--text)", fontWeight: n.isRead ? "400" : "600" }}
                  >
                    {getNotificationText(n)}
                  </p>
                  {n.postTitle && (
                    <small style={{ color: "var(--gray)", fontSize: "12px" }}>📝 {n.postTitle}</small>
                  )}
                  <br />
                  <small style={{ color: "var(--gray)", fontSize: "11px" }}>{formattedDate(n.createdAt)}</small>
                </div>

                <div style={{ position: "relative" }} ref={openMenu === n._id ? menuRef : null}>
                  <button
                    onClick={() => setOpenMenu(openMenu === n._id ? null : n._id)}
                    className="btn btn-sm"
                    style={{ color: "var(--gray)", padding: "4px 8px" }}
                  >
                    <FaEllipsisH size={13} className="outline-0 border-0" />
                  </button>
                  {openMenu === n._id && (
                    <div
                      style={{
                        position: "absolute", right: "0", top: "30px",
                        backgroundColor: "white", border: "1px solid var(--border)",
                        borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        zIndex: 100, minWidth: "160px", overflow: "hidden",
                      }}
                    >
                      {n.isRead ? (
                        <button
                          onClick={() => handleMarkAsUnread(n._id)}
                          className="btn btn-sm w-100 text-start"
                          style={{ padding: "8px 14px", fontSize: "13px", borderBottom: "1px solid var(--border)" }}
                        >
                          Mark as unread
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarkAsRead(n._id)}
                          className="btn btn-sm w-100 text-start"
                          style={{ padding: "8px 14px", fontSize: "13px", borderBottom: "1px solid var(--border)" }}
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => confirmDelete(n._id)}
                        className="btn btn-sm w-100 text-start"
                        style={{ padding: "8px 14px", fontSize: "13px", color: "#dc2626" }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {showModal && (
        <div
          style={{
            position: "fixed", inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "16px",
          }}
          onClick={() => !deleteLoading && setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "28px 24px",
              width: "100%",
              maxWidth: "400px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ICON */}
            <div
              className="d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: "52px", height: "52px", borderRadius: "50%",
                backgroundColor: "#fff5f5",
              }}
            >
              <FaTrash size={20} color="#dc2626" />
            </div>

            {/* TEXT */}
            <h6 className="fw-bold text-center mb-2" style={{ fontSize: "16px" }}>
              {modalType === "all" ? "Clear all notifications?" : "Delete this notification?"}
            </h6>
            <p className="text-center mb-4" style={{ color: "var(--gray)", fontSize: "13px" }}>
              {modalType === "all"
                ? "This will permanently delete all your notifications. This cannot be undone."
                : "This notification will be permanently deleted. This cannot be undone."}
            </p>

            {/* BUTTONS */}
            <div className="d-flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                disabled={deleteLoading}
                className="btn fw-semibold w-50"
                style={{ border: "1px solid var(--border)", color: "var(--gray)", fontSize: "14px" }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={deleteLoading}
                className="btn fw-bold w-50"
                style={{ backgroundColor: "#dc2626", color: "white", fontSize: "14px" }}
              >
                {deleteLoading
                  ? <><span className="spinner-border spinner-border-sm me-2" />Deleting...</>
                  : "Yes, Delete"
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;