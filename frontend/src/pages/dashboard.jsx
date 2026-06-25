import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { LayoutDashboard, TrendingUp, Users, BookOpen } from 'lucide-react';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/courses');
        setCourses(data);
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };
    fetchStats();
  }, []);

  const chartData = courses.map(c => ({
    name: c.title.length > 15 ? c.title.substring(0, 15) + '...' : c.title,
    students: c.studentsEnrolled?.length || 0,
    assignments: c.assignments?.length || 0
  }));

  const totalStudents = courses.reduce((acc, curr) => acc + (curr.studentsEnrolled?.length || 0), 0);
  const totalCourses = courses.length;
  const totalAssignments = courses.reduce((acc, curr) => acc + (curr.assignments?.length || 0), 0);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/30">
          <LayoutDashboard size={28} />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Dashboard Analytics</h1>
          <p className="text-slate-500 mt-1 font-medium">Overview of platform engagement and overall statistics.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Total Enrollments', value: totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Active Courses', value: totalCourses, icon: BookOpen, color: 'text-teal-600', bg: 'bg-teal-50' },
          { title: 'Assignments Posted', value: totalAssignments, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center gap-6 hover:-translate-y-1 transition-transform duration-300 group">
            <div className={`p-4 rounded-2xl ${kpi.bg} group-hover:scale-110 transition-transform duration-300`}>
              <kpi.icon className={kpi.color} size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">{kpi.title}</p>
              <h3 className="text-4xl font-black text-slate-800">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Enrollments Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <h2 className="text-xl font-bold mb-8 text-slate-800 relative z-10 flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
            Student Enrollments per Course
          </h2>
          <div className="h-80 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <Tooltip cursor={{fill: '#F1F5F9'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}} />
                <Bar dataKey="students" fill="url(#colorStudents)" radius={[6, 6, 0, 0]} name="Students" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Assignments Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <h2 className="text-xl font-bold mb-8 text-slate-800 relative z-10 flex items-center gap-2">
            <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
            Assignments Load
          </h2>
          <div className="h-80 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <Tooltip cursor={{fill: '#F1F5F9'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}} />
                <Line type="monotone" dataKey="assignments" stroke="#4F46E5" strokeWidth={4} dot={{r: 6, fill: '#fff', strokeWidth: 3, stroke: '#4F46E5'}} activeDot={{r: 8, fill: '#4F46E5', stroke: '#fff', strokeWidth: 2}} name="Assignments" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;