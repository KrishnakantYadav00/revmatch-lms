import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Award, User } from 'lucide-react';

const Home = () => {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-slate-50">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[40%] bg-teal-300/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-indigo-400/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            Welcome 
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Master Your Craft with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-400">RevMatch</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed animate-fade-in-up max-w-2xl mx-auto" style={{ animationDelay: '0.2s' }}>
            Manage your courses, track your progress, and connect with top instructors seamlessly. Your personalized learning journey starts right here.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link 
              to="/courses" 
              className="group relative inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:bg-slate-800 shadow-xl shadow-slate-900/20 hover:-translate-y-1 hover:shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-teal-400/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
              <span className="relative z-10">Browse Courses</span>
              <ArrowRight size={20} className="relative z-10 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link 
              to="/profile" 
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 shadow-sm hover:shadow-md hover:-translate-y-1"
            >
              <User className="text-slate-400 group-hover:text-blue-500" size={20} />
              View Profile
            </Link>
          </div>
        </div>

        {/* Feature Cards Showcase */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          {[
            { icon: BookOpen, title: "Interactive Courses", desc: "Engaging materials designed for effective learning and retention." },
            { icon: Users, title: "Expert Instructors", desc: "Learn directly from industry professionals and seasoned educators." },
            { icon: Award, title: "Track Progress", desc: "Monitor your achievements with real-time analytics and quizzes." }
          ].map((feature, idx) => (
            <div key={idx} className="glass p-8 rounded-3xl text-left hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5 group">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <feature.icon className="text-blue-600 group-hover:text-white transition-colors duration-300" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;