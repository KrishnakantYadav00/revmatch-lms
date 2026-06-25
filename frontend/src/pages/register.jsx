import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Shield } from 'lucide-react';
import { showToast } from '../components/NotificationToast';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'student'
  });
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Placeholder registration logic
    if (formData.fullName && formData.email && formData.password) {
      showToast('Account created successfully!', 'success');
      navigate('/dashboard');
    } else {
      showToast('Please fill in all required fields.', 'error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[40%] bg-indigo-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-teal-300/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/40 p-8 sm:p-10 my-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500 font-medium">Join RevMatch to start your journey</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            
            {/* Role Selection */}
            <div className="flex gap-4">
              <label className={`flex-1 cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${formData.role === 'student' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300 text-slate-500'}`}>
                <input 
                  type="radio" 
                  name="role" 
                  value="student" 
                  className="hidden" 
                  checked={formData.role === 'student'} 
                  onChange={(e) => setFormData({...formData, role: e.target.value})} 
                />
                <User size={24} />
                <span className="font-bold">Student</span>
              </label>
              
              <label className={`flex-1 cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${formData.role === 'instructor' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 hover:border-slate-300 text-slate-500'}`}>
                <input 
                  type="radio" 
                  name="role" 
                  value="instructor" 
                  className="hidden" 
                  checked={formData.role === 'instructor'} 
                  onChange={(e) => setFormData({...formData, role: e.target.value})} 
                />
                <Shield size={24} />
                <span className="font-bold">Instructor</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-800"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-800"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-800"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="group relative w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-xl font-bold transition-all hover:bg-slate-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-teal-400/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
              <span className="relative z-10">Get Started</span>
              <ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
