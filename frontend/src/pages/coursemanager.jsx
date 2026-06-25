import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Filter, ChevronLeft, ChevronRight, BookOpen, Users, Clock, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { showToast } from '../components/NotificationToast';

const CourseManager = () => {
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [filterMenuOpen, setFilterMenuOpen] = useState(false);
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'az', 'za'
    
    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);

    const itemsPerPage = 6;

    const fetchCourses = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/courses');
            setCourses(data);
        } catch (error) {
            console.error(error);
            showToast('Failed to fetch courses. Please try again.', 'error');
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const dummyInstructorId = "667a4e6118b6e6c52a0d1abc";
            const { data: newCourse } = await axios.post('http://localhost:5000/api/courses', {
                title, description, instructor: dummyInstructorId
            });

            if (file) {
                const formData = new FormData();
                formData.append('material', file);
                await axios.post(`http://localhost:5000/api/courses/${newCourse._id}/upload`, formData);
            }

            setShowForm(false);
            setTitle('');
            setDescription('');
            setFile(null);
            fetchCourses();
            showToast('Course published successfully!', 'success');
        } catch (error) {
            console.error(error);
            showToast('Failed to publish course. Error occurred.', 'error');
        }
    };

    let filteredCourses = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));
    
    // Apply sorting
    if (sortBy === 'az') {
        filteredCourses.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'za') {
        filteredCourses.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === 'newest') {
        // Mock newest sort (since we don't have createdAt, just reverse)
        filteredCourses.reverse();
    }
    
    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
    const paginatedCourses = filteredCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Course Management</h1>
                    <p className="text-slate-500 mt-2 text-lg">Manage and organize your educational content with ease.</p>
                </div>
                <button 
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-gradient-premium text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-slate-900/20 hover:-translate-y-0.5"
                >
                    <Plus size={20} />
                    Create Course
                </button>
            </div>

            {/* Create Course Modal overlay */}
            {showForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-2xl animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">New Course Details</h2>
                            <button onClick={() => setShowForm(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Course Title</label>
                                <input 
                                    type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Advanced Machine Learning"
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                                <textarea 
                                    required value={description} onChange={(e) => setDescription(e.target.value)} rows="4"
                                    placeholder="Provide a comprehensive description..."
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-slate-400"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Initial Material (Optional)</label>
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50 hover:bg-slate-100/50 transition-colors">
                                    <input 
                                        type="file" onChange={(e) => setFile(e.target.files[0])}
                                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-colors cursor-pointer"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowForm(false)} className="mr-3 px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-blue-600/20 hover:shadow-lg hover:-translate-y-0.5">
                                    Publish Course
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4 justify-between items-center relative z-10">
                    <div className="relative w-full sm:w-[400px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text" placeholder="Search courses..." 
                            value={search} onChange={(e) => {setSearch(e.target.value); setCurrentPage(1);}}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white border-transparent focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700"
                        />
                    </div>
                    
                    <div className="relative">
                        <button 
                            onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                            className={`flex items-center gap-2 px-5 py-3 font-semibold rounded-xl transition-all ${filterMenuOpen ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                        >
                            <Filter size={18} /> Sort By
                        </button>
                        
                        {filterMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in-up">
                                {[
                                    { id: 'newest', label: 'Newest First' },
                                    { id: 'az', label: 'Alphabetical (A-Z)' },
                                    { id: 'za', label: 'Alphabetical (Z-A)' },
                                ].map(option => (
                                    <button 
                                        key={option.id}
                                        onClick={() => {
                                            setSortBy(option.id);
                                            setFilterMenuOpen(false);
                                            showToast(`Sorted by ${option.label}`, 'success');
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center justify-between"
                                    >
                                        {option.label}
                                        {sortBy === option.id && <Check size={16} className="text-blue-600" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 sm:p-8 bg-slate-50/50">
                    {paginatedCourses.map((course, index) => (
                        <div key={course._id} className="group bg-white rounded-2xl border border-slate-200 hover:border-transparent hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col h-full animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                            <div className="p-6 flex-1">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                                    <BookOpen className="text-blue-600 group-hover:text-white transition-colors" size={24} />
                                </div>
                                <h3 className="font-extrabold text-xl text-slate-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-teal-500 transition-all line-clamp-1 mb-2">{course.title}</h3>
                                <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">{course.description}</p>
                            </div>
                            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-2xl">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                                    <Users size={14} className="text-teal-500" />
                                    {course.studentsEnrolled?.length || 0} Students
                                </div>
                                <Link to={`/courses/${course._id}`} className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                                    Manage <ChevronRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ))}
                    {paginatedCourses.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                            <Search size={48} className="mb-4 text-slate-300" />
                            <p className="text-lg font-medium">No courses found matching your criteria.</p>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="p-5 border-t border-slate-100 bg-white flex items-center justify-between">
                        <span className="text-sm text-slate-500 font-semibold">
                            Page <span className="text-slate-800">{currentPage}</span> of <span className="text-slate-800">{totalPages}</span>
                        </span>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseManager;