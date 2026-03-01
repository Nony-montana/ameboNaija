import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import { setPendingPosts } from "../../store/slices/postSlice";
import Spinner from "../../components/Spinner";
import MessageToast from "../../components/ui/MessageToast";
import { FaCheck, FaTimes, FaEye, FaUserShield } from "react-icons/fa";
import { GiPartyPopper } from "react-icons/gi";

const PendingPosts = () => {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const { pendingPosts } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Redirect if not admin
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (user?.roles !== "admin") {
      navigate("/dashboard");
    }
  }, [isLoggedIn, user]);

  // Fetch pending posts
  useEffect(() => {
    const fetchPending = async () => {
      setLoading(true);
      try {
        const res = await API.get("/posts/admin/pending");
        dispatch(setPendingPosts(res.data.data));
      } catch (err) {
        setMessage("Failed to fetch pending posts");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  // Approve post
  const handleApprove = async (slug) => {
    try {
      await API.put(`/posts/${slug}/approve`);
      setMessage("Post approved and published successfully!");
      setMessageType("success");
      // Remove from pending list
      dispatch(setPendingPosts(pendingPosts.filter((p) => p.slug !== slug)));
    } catch (err) {
      setMessage("Failed to approve post");
      setMessageType("error");
    }
  };

  // Reject post
  const handleReject = async (slug) => {
    try {
      await API.put(`/posts/${slug}/reject`);
      setMessage("Post rejected");
      setMessageType("error");
      dispatch(setPendingPosts(pendingPosts.filter((p) => p.slug !== slug)));
    } catch (err) {
      setMessage("Failed to reject post");
      setMessageType("error");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <div className="container py-5">
        {/* HEADER */}
                <div className="d-flex flex-md-row align-items-start flex-column align-items-md-center justify-content-between mb-4">
          <div>
            <h4 className="fw-bold mb-0" style={{ color: "var(--text)" }}>
              <FaUserShield /> Admin Panel
            </h4>
            <p style={{ color: "var(--gray)", fontSize: "14px" }}>
              Review and approve posts before they go live
            </p>
          </div>
          <Link
            to="/admin/dashboard"
            className="btn btn-sm fw-semibold"
            style={{ border: "1px solid var(--green)", color: "var(--green)" }}
          >
            ← Admin Dashboard
          </Link>
        </div>

        {/* MESSAGE TOAST */}
        {message && (
          <div className="mb-3">
            <MessageToast message={message} messageType={messageType} />
          </div>
        )}

        {/* EMPTY STATE */}
        {pendingPosts.length === 0 && !loading && (
          <div
            className="text-center p-5 bg-white rounded shadow-sm"
            style={{ border: "1px solid var(--border)" }}
          >
            <p style={{ fontSize: "40px" }}>
              <GiPartyPopper color="green" />
            </p>
            <h6 className="fw-bold">All clear!</h6>
            <p style={{ color: "var(--gray)", fontSize: "14px" }}>
              No pending posts at the moment. Check back later!
            </p>
          </div>
        )}

        {/* PENDING POSTS LIST */}
        <div className="d-flex flex-column gap-3">
          {pendingPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded shadow-sm p-4"
              style={{ border: "1px solid var(--border)" }}
            >
              <div className="row align-items-center g-3">
                {/* POST IMAGE */}
                <div className="col-md-2">
                  <img
                    src={
                      post.image || "https://placehold.co/150x100?text=No+Image"
                    }
                    alt={post.title}
                    style={{
                      width: "100%",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                </div>

                {/* POST INFO */}
                <div className="col-md-7">
                  <span
                    className="text-capitalize fw-bold"
                    style={{
                      backgroundColor: "var(--light-green)",
                      color: "var(--green)",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                    }}
                  >
                    {post.category}
                  </span>
                  <h6
                    className="fw-bold mt-1 mb-1"
                    style={{ fontSize: "15px" }}
                  >
                    {post.title}
                  </h6>
                  <small style={{ color: "var(--gray)", fontSize: "12px" }}>
                    By {post.author?.firstName} {post.author?.lastName}{" "}
                    &nbsp;·&nbsp;
                    {new Date(post.createdAt).toLocaleDateString("en-NG")}
                  </small>
                </div>

                {/* ACTION BUTTONS */}
                <div className="col-md-3 d-flex flex-column gap-2">
                  <button
                    onClick={() => handleApprove(post.slug)}
                    className="btn btn-sm fw-semibold d-flex align-items-center justify-content-center gap-1"
                    style={{ backgroundColor: "var(--green)", color: "white" }}
                  >
                    <FaCheck size={12} /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(post.slug)}
                    className="btn btn-sm fw-semibold d-flex align-items-center justify-content-center gap-1"
                    style={{ backgroundColor: "var(--red)", color: "white" }}
                  >
                    <FaTimes size={12} /> Reject
                  </button>
                  <Link
                    to={`/dashboard/preview/${post.slug}`}
                    className="btn btn-sm fw-semibold d-flex align-items-center justify-content-center gap-1"
                    style={{
                      border: "1px solid var(--green)",
                      color: "var(--green)",
                    }}
                  >
                    <FaEye size={12} /> Preview
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PendingPosts;
