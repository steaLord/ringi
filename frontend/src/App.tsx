import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import JobList from "./pages/JobList";
import ApplyJob from "./pages/ApplyJob";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Root from "./pages/Root";
import PublicRoute from "./components/PublicRoute";
import PostJob from "./pages/PostJob";
import Header from "./components/Header";
import MyJobs from "./pages/MyJobs";
import JobDetails from "./pages/JobDetails";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Root />} />
          <Route element={<PublicRoute />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>

          <Route path="/jobs" element={<JobList />} />
          <Route path="/apply/:jobId" element={<ApplyJob />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/my-jobs" element={<MyJobs />} />
            <Route path="/job-details/:jobId" element={<JobDetails />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
