import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import SinglePost from "./pages/SinglePost";
// import Category from "./pages/Category";
// import Search from "./pages/Search";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/dashboard/Dashboard";
import MyPosts from "./pages/dashboard/MyPosts";
import PendingPosts from "./pages/dashboard/PendingPosts";
import CreatePost from "./pages/dashboard/CreatePost";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/post/:slug" element={<SinglePost />} />
          {/* <Route path="/category/:name" element={<Category />} />
                    <Route path="/search" element={<Search />} /> */}

          {/* Dashboard Routes (protected)  */}
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/pending" element={<PendingPosts />} />
          <Route path="/dashboard/create" element={<CreatePost />} />
                    <Route path="/dashboard/my-posts" element={<MyPosts />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
