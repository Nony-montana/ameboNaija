import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API from "../api/axios";
import PostCard from "../components/PostCard";
import Spinner from "../components/Spinner";
import { FaSearch, FaHome } from "react-icons/fa";

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const q = searchParams.get("q") || "";
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [searchInput, setSearchInput] = useState(q);

    // Fetch search results
    const fetchResults = async (query) => {
        if (!query.trim()) return;
        setLoading(true);
        setSearched(true);
        try {
            const res = await API.get(`/posts/search?q=${query}`);
            setResults(res.data.data);
        } catch (err) {
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch on page load if q exists in URL
    useEffect(() => {
        if (q) {
            setSearchInput(q);
            fetchResults(q);
        }
    }, [q]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            setSearchParams({ q: searchInput });
        }
    };

    return (
        <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>

            {/* SEARCH HERO */}
            <div style={{ backgroundColor: "var(--green)", color: "white" }}>
                <div className="container py-4">
                    {/* BREADCRUMB */}
                    <div className="d-flex align-items-center gap-2 mb-3" style={{ fontSize: "13px" }}>
                        <Link to="/" style={{ color: "#ccffcc", textDecoration: "none" }}>
                            <FaHome size={12} /> Home
                        </Link>
                        <span style={{ color: "#ccffcc" }}>›</span>
                        <span style={{ color: "var(--gold)" }}>Search</span>
                    </div>

                    <h4 className="fw-bold mb-3">Search Amebo Naija 🔍</h4>

                    {/* SEARCH FORM */}
                    <form onSubmit={handleSearch} style={{ maxWidth: "550px" }}>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search for gist, news, gossip..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                style={{ fontSize: "14px", padding: "12px" }}
                            />
                            <button
                                type="submit"
                                className="btn fw-bold d-flex align-items-center gap-2"
                                style={{ backgroundColor: "var(--gold)", color: "var(--text)" }}
                            >
                                <FaSearch /> Search
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="container py-4">
                {loading && <Spinner />}

                {/* NOT SEARCHED YET */}
                {!searched && !loading && (
                    <div className="text-center py-5">
                        <p style={{ fontSize: "50px" }}>🔍</p>
                        <h6 className="fw-bold">What are you looking for?</h6>
                        <p style={{ color: "var(--gray)", fontSize: "14px" }}>
                            Search for your favorite celebrity, topic, or latest gist
                        </p>
                    </div>
                )}

                {/* NO RESULTS */}
                {searched && !loading && results.length === 0 && (
                    <div className="text-center py-5 bg-white rounded shadow-sm">
                        <p style={{ fontSize: "40px" }}>😅</p>
                        <h6 className="fw-bold">No results for "{q}"</h6>
                        <p style={{ color: "var(--gray)", fontSize: "14px" }}>
                            Try a different keyword — maybe the gist hasn't broken yet! 😄
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

                {/* RESULTS */}
                {searched && !loading && results.length > 0 && (
                    <>
                        {/* RESULTS COUNT */}
                        <p style={{ fontSize: "13px", color: "var(--gray)" }} className="mb-3">
                            Found <strong>{results.length}</strong> results for{" "}
                            <span className="fw-semibold" style={{ color: "var(--green)" }}>
                                "{q}"
                            </span>
                        </p>

                        {/* RESULTS GRID */}
                        <div className="row g-4">
                            {results.map((post) => (
                                <div className="col-md-6 col-lg-4" key={post._id}>
                                   <PostCard post={post} savedIds={savedIds} />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Search;