import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import API from "../api/axios";
import { setSinglePost, clearSinglePost, setError } from "../store/slices/postSlice";
import Spinner from "../components/Spinner";
import MessageToast from "../components/ui/MessageToast";
import PostHeader from "../components/singlepost/PostHeader";
import PostContent from "../components/singlepost/PostContent";
import PostActions from "../components/singlepost/PostActions";
import PostComments from "../components/singlepost/PostComments";
import RelatedPosts from "../components/singlepost/RelatedPosts";
import ShareModal from "../components/singlepost/ShareModal";

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
  const [commentLikes, setCommentLikes] = useState({});
  const [commentLoading, setCommentLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
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

        const likesMap = {};
        res.data.data.comments?.forEach((c) => {
          likesMap[c._id] = {
            count: c.likes?.length || 0,
            liked: user
              ? c.likes?.some((id) => id === user.id || id === user._id)
              : false,
          };
        });
        setCommentLikes(likesMap);
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

  const handleShare = async () => {
    setShowShareModal(true);
    try {
      await API.post(`/posts/${slug}/share`);
      setShareCount((prev) => prev + 1);
    } catch {
      // don't block modal from opening
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showMessage("Failed to copy link", "error");
    }
  };

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

  const handleCommentEdit = async (commentId, editText) => {
    try {
      await API.put(`/posts/${slug}/comment/${commentId}`, { text: editText });
      showMessage("Comment updated!", "success");
      await refreshPost();
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to update comment", "error");
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

  const handleCommentLike = async (commentId) => {
    if (!isLoggedIn) return showMessage("Please login to like a comment", "error");
    try {
      const res = await API.post(`/posts/${slug}/comment/${commentId}/like`);
      setCommentLikes((prev) => ({
        ...prev,
        [commentId]: {
          count: res.data.totalLikes,
          liked: !prev[commentId]?.liked,
        },
      }));
    } catch {
      showMessage("Failed to like comment", "error");
    }
  };

  if (loading || !singlePost) return <Spinner />;

  const postUrl = `https://amebonaija.vercel.app/post/${slug}`;
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
        <meta
          property="article:author"
          content={`${singlePost.author?.firstName} ${singlePost.author?.lastName}`}
        />
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

                <PostHeader
                  post={singlePost}
                  formatDate={formatDate}
                  readingTime={readingTime}
                />

                <PostContent post={singlePost} />

                <PostActions
                  views={singlePost.views}
                  liked={liked}
                  likeCount={likeCount}
                  shareCount={shareCount}
                  onLike={handleLike}
                  onShare={handleShare}
                />

                {message && (
                  <div className="mt-3">
                    <MessageToast message={message} messageType={messageType} />
                  </div>
                )}

                <RelatedPosts
                  posts={relatedPosts}
                  category={singlePost.category}
                  formatDate={formatDate}
                />

                <PostComments
                  comments={singlePost.comments}
                  isLoggedIn={isLoggedIn}
                  user={user}
                  comment={comment}
                  setComment={setComment}
                  commentLoading={commentLoading}
                  commentLikes={commentLikes}
                  onSubmit={handleComment}
                  onDelete={handleDeleteComment}
                  onEdit={handleCommentEdit}
                  onLike={handleCommentLike}
                  formatDate={formatDate}
                />

              </div>
            </div>

            {/* RIGHT - SIDEBAR */}
            <div className="col-lg-4">
              {singlePost.tags?.length > 0 && (
                <div
                  className="p-3 rounded shadow-sm mb-4"
                  style={{ backgroundColor: "white", border: "1px solid var(--border)" }}
                >
                  <h6 className="fw-bold mb-3 pb-2" style={{ borderBottom: "2px solid var(--green)" }}>
                    Tags
                  </h6>
                  <div className="d-flex flex-wrap gap-2">
                    {singlePost.tags.map((tag, i) => (
                      <span
                        key={i}
                        style={{
                          backgroundColor: "var(--light-green)",
                          color: "var(--green)",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div
                className="p-3 rounded shadow-sm"
                style={{ backgroundColor: "white", border: "1px solid var(--border)" }}
              >
                <h6 className="fw-bold mb-3 pb-2" style={{ borderBottom: "2px solid var(--green)" }}>
                  Browse Categories
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {["news", "gist", "gossip", "entertainment", "lifestyle", "sports","tech"].map((cat) => (
                    <Link
                      key={cat}
                      to={`/category/${cat}`}
                      className="text-capitalize"
                      style={{
                        backgroundColor:
                          singlePost.category === cat ? "var(--green)" : "var(--light-green)",
                        color: singlePost.category === cat ? "white" : "var(--green)",
                        padding: "5px 12px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: "600",
                        textDecoration: "none",
                        border: "1px solid var(--green)",
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

      {showShareModal && (
        <ShareModal
          postUrl={postUrl}
          postTitle={singlePost.title}
          shareCount={shareCount}
          copied={copied}
          onCopy={handleCopyLink}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  );
};

export default SinglePost;