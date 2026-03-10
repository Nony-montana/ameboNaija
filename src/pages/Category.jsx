import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import API from "../api/axios";
import { setAllPosts, setLoading, setError } from "../store/slices/postSlice";
import PostCard from "../components/PostCard";
import Spinner from "../components/Spinner";
import { FaHome } from "react-icons/fa";

const Category = () => {
    const { name } = useParams();
    const dispatch = useDispatch();
    const { posts, loading, error, totalPages, currentPage } = useSelector(
        (state) => state.posts
    );
    const { isLoggedIn } = useSelector((state) => state.auth);
    const [savedIds, setSavedIds] = useState([]);

    const fetchByCategory = async (page = 1) => {
        dispatch(setLoading());
        try {
            const res = await API.get(`/posts?category=${name}&page=${page}`);
            dispatch(setAllPosts({
                data: res.data.data,
                totalPages: res.data.totalPages,
                page: res.data.page,
            }));
        } catch (err) {
            dispatch(setError("Failed to fetch posts"));
        }
    };

    const fetchBookmarks = async () => {
        if (!isLoggedIn) return;
        try {
            const res = await API.get("/bookmarks");
            setSavedIds(res.data.data.map((p) => p._id));
        } catch {
            setSavedIds([]);
        }
    };

    useEffect(() => {
        fetchByCategory();
        fetchBookmarks();
        window.scrollTo(0, 0);
    }, [name, isLoggedIn]);

    return (
        <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>

            {/* CATEGORY HERO BANNER */}
            <div style={{ backgroundColor: "var(--green)", color: "white" }}>
                <div className="container py-4">
                    <div className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: "13px" }}>
                        <Link to="/" style={{ color: "#ccffcc", textDecoration: "none" }}>
                            <FaHome size={12} /> Home
                        </Link>
                        <span style={{ color: "#ccffcc" }}>›</span>
                        <span className="text-capitalize" style={{ color: "var(--gold)" }}>{name}</span>
                    </div>
                    <h4 className="fw-bold mb-1 text-capitalize">{name} 🇳🇬</h4>
                    <p style={{ fontSize: "14px", color: "#ccffcc", marginBottom: 0 }}>
                        Latest {name} stories from Amebo Naija
                    </p>
                </div>
            </div>

            <div className="container py-4">
                {loading && <Spinner />}

                {error && (
                    <div className="text-center py-5">
                        <p style={{ color: "var(--red)" }}>{error}</p>
                    </div>
                )}

                {!loading && !error && posts.length === 0 && (
                    <div className="text-center py-5 bg-white rounded shadow-sm">
                        <p style={{ fontSize: "40px" }}>😅</p>
                        <h6 className="fw-bold">No {name} stories yet!</h6>
                        <p style={{ color: "var(--gray)", fontSize: "14px" }}>
                            Check back soon, our writers are on it! 🔥
                        </p>
                        <Link
                            to="/"
                            className="btn btn-sm fw-semibold text-white mt-2"
                            style={{ backgroundColor: "var(--green)" }}
                        >
                            Back to Home
                        </Link>
                    </div>
                )}

                {!loading && !error && posts.length > 0 && (
                    <>
                        <p style={{ fontSize: "13px", color: "var(--gray)" }} className="mb-3">
                            Showing <strong>{posts.length}</strong> stories in{" "}
                            <span className="text-capitalize fw-semibold" style={{ color: "var(--green)" }}>
                                {name}
                            </span>
                        </p>

                        <div className="row g-4">
                            {posts.map((post) => (
                                <div className="col-md-6 col-lg-4" key={post._id}>
                                    <PostCard post={post} savedIds={savedIds} />
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="d-flex justify-content-center gap-2 mt-4">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => fetchByCategory(page)}
                                        className="btn btn-sm"
                                        style={{
                                            backgroundColor: currentPage === page ? "var(--green)" : "white",
                                            color: currentPage === page ? "white" : "var(--green)",
                                            border: "1px solid var(--green)",
                                            minWidth: "36px"
                                        }}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Category;