import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import API from "../../api/axios";
import { setSinglePost, clearSinglePost } from "../../store/slices/postSlice";
import Spinner from "../../components/Spinner";
import {
  FaEye, FaClock, FaUserCircle, FaArrowLeft, FaCheck, FaTimes,
} from "react-icons/fa";
import { FcNews } from "react-icons/fc";
import { BiComment } from "react-icons/bi";
import { FaHeart } from "react-icons/fa6";

const PreviewPost = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { singlePost, loading } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await API.get(`/posts/preview/${slug}`);
        dispatch(setSinglePost(res.data.data));
      } catch (err) {
        navigate("/dashboard/my-posts");
      }
    };

    fetchPost();
    return () => dispatch(clearSinglePost());
  }, [slug]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric", month: "long", year: "numeric",
    });
  };

  const handleApprove = async () => {
    try {
      await API.put(`/posts/${slug}/approve`);
      navigate("/dashboard/pending");
    } catch (err) {
      console.log(err);
    }
  };

  const handleReject = async () => {
    try {
      await API.put(`/posts/${slug}/reject`);
      navigate("/dashboard/pending");
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "published": return { backgroundColor: "#d4edda", color: "#155724" };
      case "pending":   return { backgroundColor: "#fff3cd", color: "#856404" };
      case "draft":     return { backgroundColor: "#e2e3e5", color: "#383d41" };
      case "rejected":  return { backgroundColor: "#f8d7da", color: "#721c24" };
      default:          return {};
    }
  };

  if (loading || !singlePost) return <Spinner />;

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>

      {/* ADMIN ACTION BAR */}
      <div
        className="sticky-top shadow-sm"
        style={{ backgroundColor: "white", borderBottom: "2px solid var(--gold)", zIndex: 100 }}
      >
        <div className="container py-2 d-flex align-items-md-center justify-content-md-between flex-md-row flex-column align-items-start gap-3 gap-md-0">
          <div className="d-flex align-items-center gap-3">
            {user?.roles === "admin" ? (
              <Link
                to="/dashboard/pending"
                className="btn btn-sm fw-semibold d-flex align-items-center gap-1"
                style={{ border: "1px solid var(--border)", color: "var(--gray)" }}
              >
                <FaArrowLeft size={11} /> Back to Pending
              </Link>
            ) : (
              <Link
                to="/dashboard/my-posts"
                className="btn btn-sm fw-semibold d-flex align-items-center gap-1"
                style={{ border: "1px solid var(--border)", color: "var(--gray)" }}
              >
                <FaArrowLeft size={11} /> Back to My Posts
              </Link>
            )}
            <span
              className="text-capitalize fw-bold"
              style={{ ...getStatusStyle(singlePost.status), padding: "2px 8px", borderRadius: "20px", fontSize: "11px" }}
            >
              {singlePost.status}
            </span>
          </div>

          {/* APPROVE & REJECT BUTTONS */}
          {user?.roles === "admin" && (
            <div className="d-flex gap-2">
              <button
                onClick={handleReject}
                className="btn btn-sm fw-semibold d-flex align-items-center gap-1"
                style={{ backgroundColor: "#f8d7da", color: "var(--red)" }}
              >
                <FaTimes size={11} /> Reject
              </button>
              <button
                onClick={handleApprove}
                className="btn btn-sm fw-semibold d-flex align-items-center gap-1"
                style={{ backgroundColor: "var(--green)", color: "white" }}
              >
                <FaCheck size={11} /> Approve & Publish
              </button>
            </div>
          )}
        </div>
      </div>

      {/* POST CONTENT */}
      <div className="container py-4">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="bg-white rounded shadow-sm p-4">

              {/* CATEGORY & DATE */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <span
                  className="text-capitalize fw-bold"
                  style={{ backgroundColor: "var(--green)", color: "white", padding: "3px 10px", borderRadius: "4px", fontSize: "12px" }}
                >
                  {singlePost.category}
                </span>
                <small style={{ color: "var(--gray)", fontSize: "12px" }}>
                  <FaClock size={10} /> {formatDate(singlePost.createdAt)}
                </small>
              </div>

              {/* TITLE */}
              <h1 className="fw-bold" style={{ fontSize: "26px", lineHeight: "1.4", color: "var(--text)" }}>
                {singlePost.title}
              </h1>

              {/* AUTHOR */}
              <div className="d-flex align-items-center gap-2 my-3">
                <FaUserCircle size={32} color="var(--green)" />
                <div>
                  <p className="mb-0 fw-semibold" style={{ fontSize: "14px" }}>
                    {singlePost.author?.firstName} {singlePost.author?.lastName}
                  </p>
                  <small style={{ color: "var(--gray)", fontSize: "12px" }}>
                    {formatDate(singlePost.createdAt)}
                  </small>
                </div>
              </div>

              {/* COVER IMAGE */}
              {singlePost.image && (
                <div className="mb-4" style={{ borderRadius: "8px", overflow: "hidden" }}>
                  <img
                    src={singlePost.image}
                    alt={singlePost.title}
                    style={{ width: "100%", maxHeight: "450px", objectFit: "cover" }}
                  />
                </div>
              )}

              {/* TAGS */}
              {singlePost.tags?.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {singlePost.tags.map((tag, i) => (
                    <span key={i} style={{
                      backgroundColor: "var(--light-green)", color: "var(--green)",
                      padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* CONTENT */}
              <div style={{
                fontSize: "16px", lineHeight: "1.9", color: "var(--text)",
                borderTop: "1px solid var(--border)", paddingTop: "20px",
                whiteSpace: "pre-wrap",
              }}>
                {singlePost.content}
              </div>

              {/* STATS */}
              <div className="d-flex gap-3 mt-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                <small style={{ color: "var(--gray)", fontSize: "13px" }}>
                  <FaEye size={12} /> {singlePost.views} views
                </small>
                <small style={{ color: "var(--gray)", fontSize: "13px" }}>
                  <FaHeart color="red" /> {singlePost.likes?.length} likes
                </small>
                <small style={{ color: "var(--gray)", fontSize: "13px" }}>
                  <BiComment /> {singlePost.comments?.length} comments
                </small>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="col-lg-4">
            <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "white", border: "1px solid var(--border)" }}>
              <h6 className="fw-bold mb-3 pb-2" style={{ borderBottom: "2px solid var(--gold)", color: "var(--text)" }}>
                <FcNews /> Post Details
              </h6>
              <table className="table table-sm mb-0" style={{ fontSize: "13px" }}>
                <tbody>
                  <tr>
                    <td style={{ color: "var(--gray)" }}>Author</td>
                    <td className="fw-semibold">{singlePost.author?.firstName} {singlePost.author?.lastName}</td>
                  </tr>
                  <tr>
                    <td style={{ color: "var(--gray)" }}>Category</td>
                    <td className="fw-semibold text-capitalize">{singlePost.category}</td>
                  </tr>
                  <tr>
                    <td style={{ color: "var(--gray)" }}>Status</td>
                    <td className="fw-semibold text-capitalize">{singlePost.status}</td>
                  </tr>
                  <tr>
                    <td style={{ color: "var(--gray)" }}>Created</td>
                    <td className="fw-semibold">{formatDate(singlePost.createdAt)}</td>
                  </tr>
                  <tr>
                    <td style={{ color: "var(--gray)" }}>Views</td>
                    <td className="fw-semibold">{singlePost.views}</td>
                  </tr>
                  <tr>
                    <td style={{ color: "var(--gray)" }}>Likes</td>
                    <td className="fw-semibold">{singlePost.likes?.length}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPost;