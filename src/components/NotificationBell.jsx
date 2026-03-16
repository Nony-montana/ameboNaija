import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { FaBell } from "react-icons/fa";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Poll every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.log(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await API.put("/notifications/read-all");
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.log(err);
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

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* BELL ICON */}
      <button
        onClick={() => setOpen(!open)}
        className="btn d-flex align-items-center justify-content-center"
        style={{ position: "relative", color: "var(--green)", padding: "6px 10px" }}
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "2px", right: "4px",
              backgroundColor: "#dc2626",
              color: "white",
              borderRadius: "50%",
              fontSize: "10px",
              fontWeight: "700",
              width: "16px", height: "16px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "42px", right: "0",
            width: "320px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            border: "1px solid var(--border)",
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          {/* HEADER */}
          <div
            className="d-flex align-items-center justify-content-between px-3 py-2"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <span className="fw-bold" style={{ fontSize: "14px" }}>
              Notifications{" "}
              {unreadCount > 0 && (
                <span style={{ color: "#dc2626", fontSize: "12px" }}>({unreadCount})</span>
              )}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="btn btn-sm"
                style={{ fontSize: "11px", color: "var(--green)", padding: "2px 6px" }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* LIST — 5 most recent */}
          <div style={{ maxHeight: "320px", overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div className="text-center py-4">
                <FaBell size={24} color="var(--gray)" />
                <p style={{ fontSize: "13px", color: "var(--gray)", marginTop: "8px" }}>
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleMarkAsRead(n._id)}
                  style={{
                    padding: "10px 16px",
                    borderBottom: "1px solid var(--border)",
                    backgroundColor: n.isRead ? "white" : "#f0fdf4",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                >
                  <p
                    className="mb-0"
                    style={{ fontSize: "13px", color: "var(--text)", fontWeight: n.isRead ? "400" : "600" }}
                  >
                   {n.sender?.firstName} {n.sender?.lastName} {n.message}
                  </p>
                  {n.postTitle && (
                    <small style={{ color: "var(--gray)", fontSize: "11px" }}>
                      {n.postTitle}
                    </small>
                  )}
                  <br />
                  <small style={{ color: "var(--gray)", fontSize: "11px" }}>
                    {formattedDate(n.createdAt)}
                  </small>
                </div>
              ))
            )}
          </div>

          {/* FOOTER */}
          <div style={{ borderTop: "1px solid var(--border)", padding: "10px 16px", textAlign: "center" }}>
            <Link
              to="/dashboard/notifications"
              onClick={() => setOpen(false)}
              style={{ fontSize: "13px", color: "var(--green)", fontWeight: "600", textDecoration: "none" }}
            >
              See all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;