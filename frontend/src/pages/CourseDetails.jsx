import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import QuizTimer from '../components/QuizTimer';
import { FileText, Download, UploadCloud, PlayCircle, BookOpen, Clock, CheckCircle } from 'lucide-react';
import { showToast } from '../components/NotificationToast';

const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [activeQuizzes, setActiveQuizzes] = useState({});
    const [submitting, setSubmitting] = useState({});

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/courses/${id}`);
                setCourse(data);
                
                const assignRes = await axios.get(`http://localhost:5000/api/assignments/course/${id}`);
                setAssignments(assignRes.data);

                const quizRes = await axios.get(`http://localhost:5000/api/quizzes/course/${id}`);
                setQuizzes(quizRes.data);
            } catch (error) {
                console.error("Error fetching course details", error);
            }
        };
        fetchCourseDetails();
    }, [id]);

    const handleDownload = (matTitle) => {
        showToast(`Started downloading: ${matTitle}`, 'info');
    };

    const handleFileUpload = (assignId) => {
        setSubmitting(prev => ({ ...prev, [assignId]: true }));
        // Mock upload delay
        setTimeout(() => {
            setSubmitting(prev => ({ ...prev, [assignId]: false }));
            showToast('Assignment submitted successfully!', 'success');
        }, 1500);
    };

    const startQuiz = (quizId) => {
        setActiveQuizzes(prev => ({ ...prev, [quizId]: true }));
        showToast('Quiz started! Good luck.', 'info');
    };

    if (!course) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className="relative bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl p-8 sm:p-12">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500 rounded-full blur-[100px] opacity-30"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-blue-300 font-medium mb-4">
                        <BookOpen size={20} />
                        <span>Course Material</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">{course.title}</h1>
                    <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">{course.description}</p>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Materials Section */}
                <div className="lg:col-span-1 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-teal-50 text-teal-600 rounded-xl"><FileText size={24} /></div>
                        <h2 className="text-2xl font-bold text-slate-800">Materials</h2>
                    </div>
                    {course.materials?.length > 0 ? (
                        <ul className="space-y-4">
                            {course.materials.map((mat, index) => (
                                <li key={index} className="group p-4 bg-slate-50 hover:bg-teal-50/50 rounded-2xl border border-slate-100 transition-all">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-slate-700 truncate mr-4">{mat.title}</span>
                                        <a 
                                            href={`http://localhost:5000${mat.fileUrl}`} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            onClick={() => handleDownload(mat.title)}
                                            className="shrink-0 p-2 bg-white text-teal-600 hover:bg-teal-600 hover:text-white rounded-xl shadow-sm transition-colors"
                                            title="Download Material"
                                        >
                                            <Download size={18} />
                                        </a>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-500 text-center py-8">No materials uploaded yet.</p>
                    )}
                </div>

                {/* Assignments Section */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><UploadCloud size={24} /></div>
                        <h2 className="text-2xl font-bold text-slate-800">Assignments</h2>
                    </div>
                    {assignments.length > 0 ? (
                        <ul className="space-y-6">
                            {assignments.map(assign => (
                                <li key={assign._id} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-1">{assign.title}</h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                            <Clock size={16} />
                                            Due: {new Date(assign.dueDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="shrink-0 flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm w-full md:w-auto">
                                        {submitting[assign._id] ? (
                                            <div className="flex items-center gap-2 text-blue-600 font-medium px-4">
                                                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                                                Uploading...
                                            </div>
                                        ) : (
                                            <>
                                                <input 
                                                    type="file" 
                                                    id={`file-${assign._id}`}
                                                    className="hidden" 
                                                    onChange={() => handleFileUpload(assign._id)}
                                                />
                                                <label 
                                                    htmlFor={`file-${assign._id}`}
                                                    className="cursor-pointer flex items-center justify-center gap-2 w-full px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
                                                >
                                                    <UploadCloud size={18} />
                                                    Submit Work
                                                </label>
                                            </>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-500 text-center py-8">No active assignments.</p>
                    )}
                </div>

                {/* Quizzes Section */}
                <div className="lg:col-span-3 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl shadow-inner border border-indigo-100 p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-white text-indigo-600 rounded-xl shadow-sm"><PlayCircle size={24} /></div>
                        <h2 className="text-2xl font-bold text-indigo-950">Active Quizzes</h2>
                    </div>
                    {quizzes.length > 0 ? (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {quizzes.map(quiz => (
                                <li key={quiz._id} className="relative overflow-hidden p-6 bg-white rounded-2xl shadow-sm border border-indigo-100 hover:shadow-md hover:border-indigo-200 transition-all">
                                    {activeQuizzes[quiz._id] && (
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse"></div>
                                    )}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-800 mb-1">{quiz.title}</h3>
                                            <div className="flex items-center gap-1.5 text-sm font-medium text-indigo-600">
                                                <Clock size={16} />
                                                {quiz.timerMinutes} Minutes
                                            </div>
                                        </div>
                                        {!activeQuizzes[quiz._id] ? (
                                            <button 
                                                onClick={() => startQuiz(quiz._id)}
                                                className="shrink-0 w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5"
                                            >
                                                Start Quiz
                                            </button>
                                        ) : (
                                            <div className="shrink-0 w-full sm:w-auto px-6 py-2.5 bg-indigo-50 text-indigo-800 rounded-xl font-bold border border-indigo-200 flex items-center justify-center gap-2 animate-fade-in">
                                                <span className="relative flex h-3 w-3">
                                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                                                </span>
                                                In Progress
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Timer Component Reveal */}
                                    <div className={`mt-6 overflow-hidden transition-all duration-500 ${activeQuizzes[quiz._id] ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <QuizTimer initialMinutes={quiz.timerMinutes} />
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-indigo-400 font-medium text-center py-8">No quizzes available for this course.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
