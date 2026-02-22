import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";
import MessageToast from "../../components/ui/MessageToast";
import { FaEye, FaEdit, FaTrash, FaClock } from "react-icons/fa";
import { TfiWrite } from "react-icons/tfi";
import { IoNewspaper } from "react-icons/io5";
import { TbTrash } from "react-icons/tb";
import { BiInfoCircle } from "react-icons/bi";

const MyPosts = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [deleteSlug, setDeleteSlug] = useState(null); // stores slug of post to delete
  const [deleteTitle, setDeleteTitle] = useState(""); // stores title for display in modal
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      setLoading(true);
      try {
        const res = await API.get("/my-posts");
        setPosts(res.data.data);
      } catch (err) {
        setMessage("Failed to fetch your posts");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, []);

  // Open modal - just save the slug and title
  const openDeleteModal = (slug, title) => {
    setDeleteSlug(slug);
    setDeleteTitle(title);
  };

  // Confirm delete from modal
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await API.delete(`/posts/${deleteSlug}`);
      setPosts(posts.filter((p) => p.slug !== deleteSlug));
      setMessage("Post deleted successfully");
      setMessageType("success");
      setDeleteSlug(null);
      setDeleteTitle("");
      // Close modal programmatically
      document.getElementById("closeDeleteModal").click();
    } catch (err) {
      setMessage("Failed to delete post");
      setMessageType("error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "published":
        return { backgroundColor: "#d4edda", color: "#155724" };
      case "pending":
        return { backgroundColor: "#fff3cd", color: "#856404" };
      case "draft":
        return { backgroundColor: "#e2e3e5", color: "#383d41" };
      case "rejected":
        return { backgroundColor: "#f8d7da", color: "#721c24" };
      default:
        return {};
    }
  };

  if (loading) return <Spinner />;

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <div className="container py-5">
        {/* HEADER */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h4 className="fw-bold mb-0">
              <IoNewspaper /> My Posts
            </h4>
            <p style={{ color: "var(--gray)", fontSize: "14px" }}>
              Manage all your articles and gist
            </p>
          </div>
          <Link
            to="/dashboard/create"
            className="btn btn-sm fw-semibold text-white"
            style={{ backgroundColor: "var(--green)" }}
          >
            + Write New Post
          </Link>
        </div>

        {/* MESSAGE TOAST */}
        {message && (
          <div className="mb-3">
            <MessageToast message={message} messageType={messageType} />
          </div>
        )}

        {/* EMPTY STATE */}
        {posts.length === 0 && !loading && (
          <div className="text-center p-5 bg-white rounded shadow-sm">
            <p style={{ fontSize: "40px" }}>
              <TfiWrite />
            </p>
            <h6 className="fw-bold">No posts yet!</h6>
            <p style={{ color: "var(--gray)", fontSize: "14px" }}>
              You haven't written any posts yet. Start sharing your gist!
            </p>
            <Link
              to="/dashboard/create"
              className="btn fw-semibold text-white mt-2"
              style={{ backgroundColor: "var(--green)" }}
            >
              Write Your First Post
            </Link>
          </div>
        )}

        {/* POSTS TABLE */}
        {posts.length > 0 && (
          <div className="bg-white rounded shadow-sm overflow-hidden">
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
                    Category
                  </th>
                  <th style={{ fontSize: "13px", color: "var(--green)" }}>
                    Status
                  </th>
                  <th style={{ fontSize: "13px", color: "var(--green)" }}>
                    Views
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
                {posts.map((post) => (
                  <tr key={post._id}>
                    {/* TITLE & IMAGE */}
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
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {post.title}
                        </p>
                      </div>
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
                          ...getStatusStyle(post.status),
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "11px",
                        }}
                      >
                        {post.status}
                      </span>
                    </td>

                    {/* VIEWS */}
                    <td style={{ fontSize: "13px", verticalAlign: "middle" }}>
                      <FaEye size={12} color="var(--gray)" /> {post.views}
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
                      <div className="d-flex gap-2">
                        {user?.roles === "admin" && (
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
                        )}
                        <Link
                          to={`/dashboard/edit/${post.slug}`}
                          className="btn btn-sm"
                          style={{
                            backgroundColor: "#fff3cd",
                            color: "#856404",
                            padding: "4px 8px",
                          }}
                          title="Edit"
                        >
                          <FaEdit size={12} />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(post.slug, post.title)}
                          className="btn btn-sm"
                          style={{
                            backgroundColor: "#f8d7da",
                            color: "var(--red)",
                            padding: "4px 8px",
                          }}
                          title="Delete"
                          data-bs-toggle="modal"
                          data-bs-target="#deleteModal"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <div
        className="modal fade"
        id="deleteModal"
        tabIndex="-1"
        aria-labelledby="deleteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content"
            style={{ borderRadius: "12px", border: "none" }}
          >
            {/* MODAL HEADER */}
            <div className="modal-header border-0 pb-0">
              <h5
                className="modal-title fw-bold"
                id="deleteModalLabel"
                style={{ color: "var(--text)" }}
              >
                <TbTrash /> Delete Post
              </h5>
              <button
                type="button"
                className="btn-close"
                id="closeDeleteModal"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            {/* MODAL BODY */}
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
                style={{ color: "var(--red)", fontSize: "13px" }}
              >
                <BiInfoCircle /> This action cannot be undone!
              </p>
            </div>

            {/* MODAL FOOTER */}
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
                  backgroundColor: "var(--red)",
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

export default MyPosts;
