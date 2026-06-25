import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import CourseManager from './pages/coursemanager';
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import Register from './pages/register';
import CourseDetails from './pages/CourseDetails';
import ForgotPassword from './pages/ForgotPassword';
import { SocketProvider } from './context/SocketContext';
import NotificationToast from './components/NotificationToast';

const App = () => {
  return (
    <SocketProvider>
      <Router>
        <NotificationToast />
        <Routes>
          {/* The Layout component wraps all routes inside it */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="courses" element={<CourseManager />} />
            <Route path="courses/:id" element={<CourseDetails />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
          </Route>
        </Routes>
      </Router>
    </SocketProvider>
  );
};

export default App;