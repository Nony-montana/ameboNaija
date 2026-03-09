// import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
// import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import SinglePost from "./pages/SinglePost";
import Category from "./pages/Category";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/dashboard/Dashboard";
import MyPosts from "./pages/dashboard/MyPosts";
import PendingPosts from "./pages/dashboard/PendingPosts";
import CreatePost from "./pages/dashboard/CreatePost";
import EditPost from "./pages/dashboard/EditPost";
import PreviewPost from "./pages/dashboard/PreviewPost";
import Settings from "./pages/dashboard/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminOverview from "./pages/dashboard/AdminOverview";
import AdminPosts from "./pages/dashboard/AdminPost";
import AdminUsers from "./pages/dashboard/AdminUser";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import AdminComments from "./pages/dashboard/AdminComment";
import AuthorProfile from "./pages/AuthorPage";
import Bookmarks from "./pages/dashboard/Bookmarks";

// import { setUser, logout } from "./store/slices/authSlice";
// import API from "./api/axios";

const cookies = new Cookies();

function App() {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //     const token = cookies.get("token");
  //     const user = cookies.get("user");

  //     if (!token || !user) {
  //         // No valid cookie — clear redux and stay logged out
  //         dispatch(logout());
  //         return;
  //     }

  //     // Cookie exists — validate token with backend to make sure it hasn't
  //     // expired or been invalidated, then restore user state into Redux
  //     const restoreAuth = async () => {
  //         try {
  //             const res = await API.get("/me", {
  //                 headers: { Authorization: `Bearer ${token}` },
  //             });
  //             dispatch(setUser(res.data.data));
  //         } catch {
  //             // Token invalid or expired — clear cookies and redux
  //             cookies.remove("token", { path: "/" });
  //             cookies.remove("user", { path: "/" });
  //             dispatch(logout());
  //         }
  //     };

  //     restoreAuth();
  // }, []);

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/post/:slug" element={<SinglePost />} />
          <Route path="/category/:name" element={<Category />} />
          <Route path="/search" element={<Search />} />

          {/* Auth Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/author/:id" element={<AuthorProfile />} />
          <Route path="/dashboard/bookmarks" element={<Bookmarks />} />

          {/* Dashboard Routes (protected) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/pending" element={<PendingPosts />} />
          <Route path="/dashboard/create" element={<CreatePost />} />
          <Route path="/dashboard/my-posts" element={<MyPosts />} />
          <Route path="/dashboard/edit/:slug" element={<EditPost />} />
          <Route path="/dashboard/preview/:slug" element={<PreviewPost />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/overview" element={<AdminOverview />} />
          <Route path="/admin/posts" element={<AdminPosts />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/comments" element={<AdminComments />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
