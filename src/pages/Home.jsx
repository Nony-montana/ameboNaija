import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import API from "../api/axios";
import {
  setAllPosts,
  setTrendingPosts,
  setLoading,
  setError,
} from "../store/slices/postSlice";
import PostCard from "../components/PostCard";
import Spinner from "../components/Spinner";
import { FaFire, FaClock, FaArrowRight } from "react-icons/fa";

const Home = () => {
  const dispatch = useDispatch();
  const { posts, trendingPosts, loading, error, totalPages, currentPage } =
    useSelector((state) => state.posts);

  // Fetch all posts
  const fetchPosts = async (page = 1) => {
    dispatch(setLoading());
    try {
      const res = await API.get(`/posts?page=${page}`);
      dispatch(
        setAllPosts({
          data: res.data.data,
          totalPages: res.data.totalPages,
          page: res.data.page,
        }),
      );
    } catch (err) {
      dispatch(setError("Failed to fetch posts"));
    }
  };

  // Fetch trending posts
  const fetchTrending = async () => {
    try {
      const res = await API.get("/posts/trending");
      dispatch(setTrendingPosts(res.data.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchTrending();
  }, []);

  const safePosts = Array.isArray(posts) ? posts : [];
  const featuredPost = safePosts[0];
  const remainingPosts = safePosts.slice(1);

  const safeTrending = Array.isArray(trendingPosts) ? trendingPosts : [];

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      {/* BREAKING NEWS TICKER */}
      <div
        style={{
          backgroundColor: "var(--red)",
          color: "white",
          overflow: "hidden",
        }}
      >
        <div
          className="container d-flex align-items-center"
          style={{ height: "36px" }}
        >
          <span
            className="fw-bold me-3 text-white flex-shrink-0"
            style={{
              backgroundColor: "#990000",
              padding: "2px 10px",
              fontSize: "12px",
              letterSpacing: "1px",
            }}
          >
            🔴 BREAKING
          </span>
          <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
            <span
              style={{
                display: "inline-block",
                animation: "ticker 35s linear infinite",
                fontSize: "13px",
              }}
            >
              {safePosts.slice(0, 5).map((p, i) => (
                <span key={i}>
                  <Link
                    to={`/post/${p.slug}`}
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    {p.title}
                  </Link>
                  &nbsp;&nbsp;•&nbsp;&nbsp;
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>

      {/* TICKER ANIMATION */}
      <style>{`
                @keyframes ticker {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
            `}</style>

      <div className="container py-4">
        {loading && <Spinner />}
        {error && <p className="text-danger text-center">{error}</p>}

        {!loading && !error && (
          <div className="row g-4">
            {/* LEFT - MAIN CONTENT */}
            <div className="col-lg-8">
              {/* FEATURED POST */}
              {featuredPost && (
                <div className="mb-4">
                  <div
                    className="position-relative rounded overflow-hidden shadow"
                    style={{ height: "420px" }}
                  >
                    <img
                      src={
                        featuredPost.image ||
                        "https://placehold.co/800x420?text=Amebo+Naija"
                      }
                      alt={featuredPost.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    {/* OVERLAY */}
                    <div
                      className="position-absolute bottom-0 start-0 end-0 p-4"
                      style={{
                        background:
                          "linear-gradient(transparent, rgba(0,0,0,0.85))",
                        color: "white",
                      }}
                    >
                      <span
                        className="text-capitalize fw-bold"
                        style={{
                          backgroundColor: "var(--gold)",
                          color: "var(--text)",
                          padding: "2px 10px",
                          borderRadius: "4px",
                          fontSize: "12px",
                        }}
                      >
                        {featuredPost.category}
                      </span>
                      <Link to={`/post/${featuredPost.slug}`}>
                        <h3
                          className="mt-2 fw-bold"
                          style={{
                            color: "white",
                            fontSize: "22px",
                            lineHeight: "1.4",
                          }}
                        >
                          {featuredPost.title}
                        </h3>
                      </Link>
                      <small style={{ color: "#cccccc" }}>
                        By {featuredPost.author?.firstName}{" "}
                        {featuredPost.author?.lastName}
                      </small>
                    </div>
                  </div>
                </div>
              )}

              {/* LATEST POSTS */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <FaClock color="var(--green)" />
                <h5 className="fw-bold mb-0" style={{ color: "var(--text)" }}>
                  Latest Stories
                </h5>
              </div>

              <div className="row g-3">
                {remainingPosts.map((post) => (
                  <div className="col-md-6" key={post._id}>
                    <PostCard post={post} />
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center gap-2 mt-4">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => fetchPosts(page)}
                        className="btn btn-sm"
                        style={{
                          backgroundColor:
                            currentPage === page ? "var(--green)" : "white",
                          color:
                            currentPage === page ? "white" : "var(--green)",
                          border: "1px solid var(--green)",
                          minWidth: "36px",
                        }}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>

            {/* RIGHT - SIDEBAR */}
            <div className="col-lg-4">
              {/* TRENDING */}
              <div
                className="p-3 rounded shadow-sm mb-4"
                style={{
                  backgroundColor: "white",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="d-flex align-items-center gap-2 mb-3 pb-2"
                  style={{ borderBottom: "2px solid var(--green)" }}
                >
                  <FaFire color="var(--red)" />
                  <h6 className="fw-bold mb-0">Trending Now</h6>
                </div>

                {safeTrending.slice(0, 6).map((post, index) => (
                  <div
                    key={post._id}
                    className="d-flex gap-2 mb-3 align-items-start"
                  >
                    <span
                      className="fw-bold flex-shrink-0"
                      style={{
                        color: index < 3 ? "var(--red)" : "var(--gray)",
                        fontSize: "18px",
                        lineHeight: "1.2",
                        minWidth: "24px",
                      }}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <Link to={`/post/${post.slug}`}>
                        <p
                          className="mb-0"
                          style={{
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "var(--text)",
                            lineHeight: "1.4",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.color = "var(--green)")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.color = "var(--text)")
                          }
                        >
                          {post.title}
                        </p>
                      </Link>
                      <small style={{ color: "var(--gray)", fontSize: "11px" }}>
                        {post.views} views
                      </small>
                    </div>
                  </div>
                ))}
              </div>

              {/* CATEGORIES WIDGET */}
              <div
                className="p-3 rounded shadow-sm"
                style={{
                  backgroundColor: "white",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="d-flex align-items-center gap-2 mb-3 pb-2"
                  style={{ borderBottom: "2px solid var(--green)" }}
                >
                  <h6 className="fw-bold mb-0">Browse Categories</h6>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {["news", "gist", "gossip", "entertainment", "lifestyle"].map(
                    (cat) => (
                      <Link
                        key={cat}
                        to={`/category/${cat}`}
                        className="text-capitalize"
                        style={{
                          backgroundColor: "var(--light-green)",
                          color: "var(--green)",
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
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
