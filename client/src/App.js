import React from 'react';
import { BrowserRouter as Router, Routes,Route, Navigate } from 'react-router-dom';
import NavigationBar from './components/navigationBar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import UserHome from './pages/HomeUsers';
import ResetPassword from './pages/PasswordReset';
import ForgotPassword from './pages/ForgotPassword';
import BlogProfile from './pages/BlogProfile';
import CreateBlogPage from './pages/CreateBlogPage';
import EditBlogPage from './pages/EditBlogPage';
import ViewBlogPage from './pages/ViewBlogPage';

const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};

const ProtectedRoute = ({ children }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-home" element={<ProtectedRoute><UserHome /></ProtectedRoute>} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile/blogs" element={<BlogProfile />} />
        <Route path="/create-blog" element={<CreateBlogPage token={token} />} />
        <Route path="/edit-blog/:id" element={<EditBlogPage />} />
        <Route path="/view-blog/:id" element={<ViewBlogPage />} />
        <Route path="'*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;