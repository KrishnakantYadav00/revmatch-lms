import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, User, Home, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/courses', label: 'Courses', icon: BookOpen },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
      {/* Top Navigation Bar - Premium Glassmorphic */}
      <nav className="sticky top-0 z-50 glass border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo/Brand Area */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-400 rounded-xl flex items-center justify-center font-extrabold text-white shadow-lg shadow-blue-500/30 transform transition-transform hover:scale-105 hover:rotate-3">
                R
              </div>
              <Link to="/" className="font-extrabold text-2xl tracking-tight text-slate-800">
                RevMatch<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-400">LMS</span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-1 items-center">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
                return (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className={`relative px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-300 group overflow-hidden ${
                      isActive ? 'text-blue-700 bg-blue-50/80' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100/50'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute inset-0 border-b-2 border-blue-600 transform scale-x-100 transition-transform origin-left"></span>
                    )}
                    <Icon size={18} className={`transition-transform duration-300 ${isActive ? 'scale-110 text-blue-600' : 'group-hover:scale-110 group-hover:text-blue-500'}`} />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Auth Buttons */}
            <div className="flex space-x-3 items-center">
              <Link 
                to="/login" 
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
              >
                <LogIn size={18} />
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="group relative flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-slate-800 shadow-md hover:shadow-xl hover:-translate-y-0.5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-teal-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                <UserPlus size={18} />
                <span className="relative z-10">Get Started</span>
              </Link>
            </div>

          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow w-full relative z-10">
        <Outlet /> {/* Specific page components will render here */}
      </main>
      
    </div>
  );
};

export default Layout;