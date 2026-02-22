import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
    singlePost: null,
    trendingPosts: [],
    pendingPosts: [],
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
};

const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        setLoading: (state) => {
            state.loading = true;
            state.error = null;
        },
        setAllPosts: (state, action) => {
            state.posts = action.payload.data || [];
            state.totalPages = action.payload.totalPages || 1;
            state.currentPage = action.payload.page || 1;
            state.loading = false;
        },
        setSinglePost: (state, action) => {
            state.singlePost = action.payload;
            state.loading = false;
        },
        setTrendingPosts: (state, action) => {
            state.trendingPosts = action.payload || [];
            state.loading = false;
        },
        setPendingPosts: (state, action) => {
            state.pendingPosts = action.payload || [];
            state.loading = false;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearSinglePost: (state) => {
            state.singlePost = null;
        },
    },
});

export const {
    setLoading,
    setAllPosts,
    setSinglePost,
    setTrendingPosts,
    setPendingPosts,
    setError,
    clearSinglePost,
} = postSlice.actions;

export default postSlice.reducer;