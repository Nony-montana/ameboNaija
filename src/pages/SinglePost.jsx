import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import API from "../api/axios";
import {
  setSinglePost,
  clearSinglePost,
  setError,
} from "../store/slices/postSlice";
import Spinner from "../components/Spinner";
import MessageToast from "../components/ui/MessageToast";
import {
  FaEye, FaHeart, FaShareAlt, FaClock, FaUserCircle,
  FaTrash, FaComment, FaEdit, FaCheck, FaTimes, FaEllipsisV,
  FaCopy, FaWhatsapp, FaTimes as FaClose,
} from "react-icons/fa";
import { FaXTwitter, FaSnapchat } from "react-icons/fa6";
import { MdMessage } from "react-icons/md";
import { RiInstagramFill } from "react-icons/ri";

const getReadingTime = (text) => {
  if (!text) return "1 min read";
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  return `${minutes} min read`;
};

const getExcerpt = (text, length = 155) => {
  if (!text) return "";
  return text.length > length ? text.slice(0, length).trim() + "..." : text;
};

const SinglePost = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { singlePost, loading } = useSelector((state) => state.posts);
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await API.get(`/posts/${slug}`);
        dispatch(setSinglePost(res.data.data));
        setLikeCount(res.data.data.likes?.length || 0);
        setShareCount(res.data.data.shares || 0);
        if (user && res.data.data.likes?.includes(user._id)) setLiked(true);
      } catch (err) {
        dispatch(setError("Post not found"));
        navigate("/404");
      }
    };
    fetchPost();
    return () => dispatch(clearSinglePost());
  }, [slug]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!singlePost?.category) return;
      try {
        const res = await API.get(`/posts?category=${singlePost.category}&limit=4`);
        const filtered = res.data.data.filter((p) => p.slug !== slug).slice(0, 3);
        setRelatedPosts(filtered);
      } catch {
        setRelatedPosts([]);
      }
    };
    fetchRelated();
  }, [singlePost?.category, slug]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-NG", {
      day: "numeric", month: "long", year: "numeric",
    });

  const refreshPost = async () => {
    const res = await API.get(`/posts/${slug}`);
    dispatch(setSinglePost(res.data.data));
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleLike = async () => {
    if (!isLoggedIn) return showMessage("Please login to like this post", "error");
    try {
      const res = await API.post(`/posts/${slug}/like`);
      setLiked(!liked);
      setLikeCount(res.data.totalLikes);
    } catch {
      showMessage("Failed to like post", "error");
    }
  };

  // Opens share modal and increments share count
  const handleShare = async () => {
    setShowShareModal(true);
    try {
      await API.post(`/posts/${slug}/share`);
      setShareCount((prev) => prev + 1);
    } catch {
      // don't block modal from opening
    }
  };

  const postUrl = `https://amebonaija.vercel.app/post/${slug}`;
  const shareText = singlePost ? `Check out this gist on AmeboNaija: ${singlePost.title}` : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showMessage("Failed to copy link", "error");
    }
  };

  const shareLinks = [
    {
      label: "WhatsApp",
      icon: <FaWhatsapp size={20} color="white" />,
      bg: "#25D366",
      url: `https://wa.me/?text=${encodeURIComponent(shareText + " " + postUrl)}`,
    },
    {
      label: "X (Twitter)",
      icon: <FaXTwitter size={20} color="white" />,
      bg: "#000000",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`,
    },
    {
      label: "Snapchat",
      icon: <FaSnapchat size={20} color="black" />,
      bg: "#FFFC00",
      url: `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(postUrl)}`,
    },
    {
      label: "Instagram",
      icon: <RiInstagramFill size={20} color="white" />,
      bg: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
      url: `https://www.instagram.com/`,
      note: "Copy link first, then paste on IG",
    },
    {
      label: "Messages",
      icon: <MdMessage size={20} color="white" />,
      bg: "#34C759",
      url: `sms:?body=${encodeURIComponent(shareText + " " + postUrl)}`,
    },
  ];

  const handleComment = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return showMessage("Please login to comment", "error");
    if (!comment.trim()) return showMessage("Comment cannot be empty", "error");
    setCommentLoading(true);
    try {
      await API.post(`/posts/${slug}/comment`, { text: comment });
      setComment("");
      showMessage("Comment added successfully!", "success");
      await refreshPost();
    } catch {
      showMessage("Failed to add comment", "error");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/posts/${slug}/comment/${commentId}`);
      showMessage("Comment deleted", "success");
      await refreshPost();
    } catch {
      showMessage("Failed to delete comment", "error");
    }
  };

  const handleEditComment = (commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditText(currentText);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditText("");
  };

  const handleSaveEdit = async (commentId) => {
    if (!editText.trim()) return showMessage("Comment cannot be empty", "error");
    setEditLoading(true);
    try {
      await API.put(`/posts/${slug}/comment/${commentId}`, { text: editText });
      setEditingCommentId(null);
      setEditText("");
      showMessage("Comment updated!", "success");
      await refreshPost();
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to update comment", "error");
    } finally {
      setEditLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (loading || !singlePost) return <Spinner />;

  const pageTitle = `${singlePost.title} | AmeboNaija`;
  const pageDescription = getExcerpt(singlePost.content);
  const pageImage = singlePost.image || "https://amebonaija.vercel.app/logo.png";
  const readingTime = getReadingTime(singlePost.content);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={postUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={singlePost.title} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:url" content={postUrl} />
        <meta property="og:site_name" content="AmeboNaija" />
        <meta property="article:published_time" content={singlePost.createdAt} />
        <meta property="article:author" content={`${singlePost.author?.firstName} ${singlePost.author?.lastName}`} />
        <meta property="article:section" content={singlePost.category} />
        {singlePost.tags?.map((tag, i) => (
          <meta key={i} property="article:tag" content={tag} />
        ))}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={singlePost.title} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
      </Helmet>

      <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
        <div className="container py-4">
          <div className="row g-4">
            {/* LEFT - MAIN CONTENT */}
            <div className="col-lg-8">
              <div className="bg-white rounded shadow-sm p-4">

                {/* CATEGORY, DATE & READING TIME */}
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Link
                    to={`/category/${singlePost.category}`}
                    className="text-capitalize fw-bold"
                    style={{
                      backgroundColor: "var(--green)", color: "white",
                      padding: "3px 10px", borderRadius: "4px",
                      fontSize: "12px", textDecoration: "none",
                    }}
                  >
                    {singlePost.category}
                  </Link>
                  <small style={{ color: "var(--gray)", fontSize: "12px" }}>
                    <FaClock size={10} /> {formatDate(singlePost.createdAt)}
                  </small>
                  <small style={{ color: "var(--gray)", fontSize: "12px" }}>
                    · {readingTime}
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
                    <Link to={`/author/${singlePost.author?._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <p className="mb-0 fw-semibold" style={{ fontSize: "14px" }}>
                        {singlePost.author?.firstName} {singlePost.author?.lastName}
                      </p>
                    </Link>
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
                      <span
                        key={i}
                        style={{
                          backgroundColor: "var(--light-green)", color: "var(--green)",
                          padding: "3px 10px", borderRadius: "20px",
                          fontSize: "12px", fontWeight: "600",
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* CONTENT */}
                <div
                  style={{
                    fontSize: "16px", lineHeight: "1.9", color: "var(--text)",
                    borderTop: "1px solid var(--border)", paddingTop: "20px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {singlePost.content}
                </div>

                {/* STATS & ACTIONS */}
                <div
                  className="d-flex align-items-center gap-3 mt-4 pt-3"
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  <span style={{ color: "var(--gray)", fontSize: "14px" }}>
                    <FaEye size={14} /> {singlePost.views} views
                  </span>
                  <button
                    onClick={handleLike}
                    className="btn btn-sm d-flex align-items-center gap-1"
                    style={{
                      backgroundColor: liked ? "#ffe6e6" : "var(--light-green)",
                      color: liked ? "var(--red)" : "var(--green)",
                      border: "none", fontWeight: "600", fontSize: "13px",
                    }}
                  >
                    <FaHeart /> {likeCount} {liked ? "Liked" : "Like"}
                  </button>
                  <button
                    onClick={handleShare}
                    className="btn btn-sm d-flex align-items-center gap-1"
                    style={{
                      backgroundColor: "var(--light-green)", color: "var(--green)",
                      border: "none", fontWeight: "600", fontSize: "13px",
                    }}
                  >
                    <FaShareAlt /> {shareCount} Share
                  </button>
                </div>

                {message && (
                  <div className="mt-3">
                    <MessageToast message={message} messageType={messageType} />
                  </div>
                )}

                {/* RELATED POSTS */}
                {relatedPosts.length > 0 && (
                  <div className="mt-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                    <h6 className="fw-bold mb-3" style={{ color: "var(--text)" }}>
                      More{" "}
                      <span className="text-capitalize" style={{ color: "var(--green)" }}>
                        {singlePost.category}
                      </span>{" "}
                      Gist
                    </h6>
                    <div className="row g-3">
                      {relatedPosts.map((post) => (
                        <div className="col-12" key={post._id}>
                          <Link to={`/post/${post.slug}`} style={{ textDecoration: "none" }}>
                            <div
                              className="d-flex gap-3 p-2 rounded"
                              style={{ border: "1px solid var(--border)", transition: "background 0.2s", backgroundColor: "white" }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--light-green)")}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                            >
                              {post.image && (
                                <img
                                  src={post.image}
                                  alt={post.title}
                                  style={{ width: "90px", height: "70px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 }}
                                />
                              )}
                              <div className="d-flex flex-column justify-content-center">
                                <p
                                  className="mb-1 fw-semibold"
                                  style={{
                                    fontSize: "13px", color: "var(--text)", lineHeight: "1.4",
                                    display: "-webkit-box", WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical", overflow: "hidden",
                                  }}
                                >
                                  {post.title}
                                </p>
                                <small style={{ color: "var(--gray)", fontSize: "11px" }}>
                                  <FaClock size={9} /> {formatDate(post.createdAt)} · {getReadingTime(post.content)}
                                </small>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* COMMENTS SECTION */}
                <div className="mt-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                  <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <FaComment color="var(--green)" />
                    Comments ({singlePost.comments?.length || 0})
                  </h6>

                  <form onSubmit={handleComment} className="mb-4">
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
                        <><span className="spinner-border spinner-border-sm me-1" />Posting...</>
                      ) : "Post Comment"}
                    </button>
                  </form>

                  {singlePost.comments?.length === 0 && (
                    <p style={{ color: "var(--gray)", fontSize: "14px" }}>
                      No comments yet. Be the first to share your thoughts! 💬
                    </p>
                  )}

                  {singlePost.comments?.map((c) => (
                    <div
                      key={c._id}
                      className="d-flex gap-3 mb-3 p-3 rounded"
                      style={{ backgroundColor: "var(--light-green)" }}
                    >
                      <FaUserCircle size={28} color="var(--green)" className="flex-shrink-0 mt-1" />
                      <div className="w-100">
                        <div className="d-flex justify-content-between align-items-center">
                          <p className="mb-0 fw-semibold" style={{ fontSize: "13px" }}>
                            {c.user?.firstName} {c.user?.lastName}
                          </p>
                          <div className="d-flex align-items-center gap-2">
                            <small style={{ color: "var(--gray)", fontSize: "11px" }}>
                              {formatDate(c.createdAt)}
                            </small>
                            {(user?.id === c.user?._id || user?.roles === "admin") && editingCommentId !== c._id && (
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
                                    style={{ right: 0, top: "20px", zIndex: 10, minWidth: "110px", border: "1px solid var(--border)" }}
                                  >
                                    {user?.id === c.user?._id &&
                                      Date.now() - new Date(c.createdAt).getTime() < 10 * 60 * 1000 && (
                                        <button
                                          onClick={() => { handleEditComment(c._id, c.text); setOpenMenuId(null); }}
                                          className="btn btn-sm text-start d-flex justify-content-between align-items-center gap-2 px-3 py-2"
                                          style={{ color: "var(--green)", border: "none", background: "none", fontSize: "13px", borderBottom: "1px solid var(--border)" }}
                                        >
                                          <span>Edit</span><FaEdit size={11} />
                                        </button>
                                      )}
                                    {(user?.id === c.user?._id || user?.roles === "admin") && (
                                      <button
                                        onClick={() => { handleDeleteComment(c._id); setOpenMenuId(null); }}
                                        className="btn btn-sm text-start justify-content-between d-flex align-items-center gap-2 px-3 py-2"
                                        style={{ color: "var(--red)", border: "none", background: "none", fontSize: "13px" }}
                                      >
                                        <span>Delete</span><FaTrash size={11} />
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

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
                                {editLoading ? <span className="spinner-border spinner-border-sm" /> : <><FaCheck size={10} /> Save</>}
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
                            <p className="mb-0 mt-1" style={{ fontSize: "14px", color: "var(--text)" }}>{c.text}</p>
                            {c.editedAt && (
                              <small style={{ color: "var(--gray)", fontSize: "11px", fontStyle: "italic" }}>edited</small>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT - SIDEBAR */}
            <div className="col-lg-4">
              {singlePost.tags?.length > 0 && (
                <div className="p-3 rounded shadow-sm mb-4" style={{ backgroundColor: "white", border: "1px solid var(--border)" }}>
                  <h6 className="fw-bold mb-3 pb-2" style={{ borderBottom: "2px solid var(--green)" }}>Tags</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {singlePost.tags.map((tag, i) => (
                      <span key={i} style={{ backgroundColor: "var(--light-green)", color: "var(--green)", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "white", border: "1px solid var(--border)" }}>
                <h6 className="fw-bold mb-3 pb-2" style={{ borderBottom: "2px solid var(--green)" }}>Browse Categories</h6>
                <div className="d-flex flex-wrap gap-2">
                  {["news", "gist", "gossip", "entertainment", "lifestyle", "sports"].map((cat) => (
                    <Link
                      key={cat}
                      to={`/category/${cat}`}
                      className="text-capitalize"
                      style={{
                        backgroundColor: singlePost.category === cat ? "var(--green)" : "var(--light-green)",
                        color: singlePost.category === cat ? "white" : "var(--green)",
                        padding: "5px 12px", borderRadius: "20px", fontSize: "13px",
                        fontWeight: "600", textDecoration: "none", border: "1px solid var(--green)",
                      }}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SHARE MODAL */}
      {showShareModal && (
        <div
          style={{
            position: "fixed", inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex", alignItems: "flex-end", justifyContent: "center",
          }}
          onClick={() => setShowShareModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "20px 20px 0 0",
              padding: "24px",
              width: "100%",
              maxWidth: "480px",
              paddingBottom: "36px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h6 className="fw-bold mb-0" style={{ fontSize: "16px" }}>Share this gist</h6>
              <button
                onClick={() => setShowShareModal(false)}
                className="btn btn-sm"
                style={{ color: "var(--gray)", padding: "4px 8px" }}
              >
                <FaClose size={16} />
              </button>
            </div>

            {/* SOCIAL BUTTONS */}
            <div className="d-flex justify-content-around mb-4">
              {shareLinks.map((s) => (
                <div key={s.label} className="text-center">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                    title={s.note || s.label}
                  >
                    <div
                      style={{
                        width: "52px", height: "52px",
                        borderRadius: "50%",
                        background: s.bg,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 6px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                    >
                      {s.icon}
                    </div>
                    <small style={{ fontSize: "11px", color: "var(--gray)", fontWeight: "600" }}>
                      {s.label}
                    </small>
                  </a>
                </div>
              ))}
            </div>

            {/* COPY LINK */}
            <div
              className="d-flex align-items-center gap-2 p-2 rounded"
              style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg)" }}
            >
              <p
                className="mb-0 flex-grow-1"
                style={{ fontSize: "12px", color: "var(--gray)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              >
                {postUrl}
              </p>
              <button
                onClick={handleCopyLink}
                className="btn btn-sm fw-semibold d-flex align-items-center gap-1 flex-shrink-0"
                style={{ backgroundColor: copied ? "var(--green)" : "var(--light-green)", color: copied ? "white" : "var(--green)", fontSize: "12px" }}
              >
                <FaCopy size={11} /> {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SinglePost;