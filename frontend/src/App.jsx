// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import CourseManager from './pages/coursemanager';
import ProtectedRoute from './components/ProtectedRoutes';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Shared Routes */}
        <Route element={<ProtectedRoute allowedRoles={['student', 'instructor']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Exclusive Instructor Routes */}
        <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
          <Route path="/manage-courses" element={<CourseManager />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;