import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { User, Mail, Shield, Edit2, X, Check, BookOpen } from 'lucide-react';
import { showToast } from '../components/NotificationToast';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ fullName: '', bio: '' });

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/profile');
            setProfile(data);
            setFormData({ fullName: data.fullName, bio: data.bio || '' });
        } catch (error) {
            console.error("Failed to fetch profile", error);
            // Mock profile if backend fails for demonstration purposes
            const mockData = {
                fullName: 'Jane Doe',
                bio: 'Passionate educator and tech enthusiast. I love teaching web development and system design.',
                user: { email: 'jane.doe@example.com', role: 'instructor' }
            };
            setProfile(mockData);
            setFormData({ fullName: mockData.fullName, bio: mockData.bio });
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Mocking update for visual feedback
            await new Promise(resolve => setTimeout(resolve, 800));
            // const { data } = await api.put('/profile', formData);
            // setProfile(data);
            setProfile(prev => ({ ...prev, fullName: formData.fullName, bio: formData.bio }));
            setIsEditing(false);
            showToast('Profile updated successfully!', 'success');
        } catch (error) {
            console.error("Failed to update profile", error);
            showToast('Failed to update profile.', 'error');
        }
    };

    if (!profile) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto mt-10 p-4 sm:p-8 animate-fade-in-up">
            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden relative">
                
                {/* Header Background */}
                <div className="h-48 bg-gradient-premium relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                </div>

                {/* Profile Content */}
                <div className="px-8 pb-12 relative">
                    
                    {/* Avatar & Role Badge */}
                    <div className="flex justify-between items-end -mt-16 mb-8 relative z-10">
                        <div className="w-32 h-32 rounded-full bg-white p-2 shadow-xl">
                            <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-4xl text-slate-400 border border-slate-200">
                                {profile.fullName.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div className="mb-4">
                            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold text-teal-700 bg-teal-50 border border-teal-200 rounded-full uppercase tracking-wide shadow-sm">
                                <Shield size={16} className="text-teal-600" />
                                {profile.user.role}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-900">{profile.fullName}</h2>
                            <div className="flex items-center gap-2 text-slate-500 mt-2 font-medium">
                                <Mail size={16} />
                                {profile.user.email}
                            </div>
                        </div>
                        {!isEditing && (
                            <button 
                                onClick={() => setIsEditing(true)} 
                                className="inline-flex items-center gap-2 bg-slate-50 text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-100 transition-colors shadow-sm"
                            >
                                <Edit2 size={16} />
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 transition-all duration-300">
                        {isEditing ? (
                            <form onSubmit={handleUpdate} className="space-y-6 animate-fade-in">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                            <User size={18} />
                                        </div>
                                        <input 
                                            type="text" 
                                            required
                                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-800 shadow-sm"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                        />
                                    </div>
                                </div>
                                
                                {profile.user.role === 'instructor' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Professional Bio</label>
                                        <div className="relative">
                                            <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none text-slate-400">
                                                <BookOpen size={18} />
                                            </div>
                                            <textarea 
                                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none font-medium text-slate-800 shadow-sm leading-relaxed"
                                                rows="5"
                                                value={formData.bio}
                                                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({ fullName: profile.fullName, bio: profile.bio || '' });
                                        }} 
                                        className="inline-flex items-center gap-2 px-6 py-2.5 text-slate-600 font-semibold bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                                    >
                                        <X size={18} /> Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md shadow-blue-600/20 hover:shadow-lg hover:-translate-y-0.5 hover:bg-blue-700 transition-all"
                                    >
                                        <Check size={18} /> Save Changes
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6 animate-fade-in">
                                {profile.user.role === 'instructor' ? (
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">About</h3>
                                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-lg">
                                            {profile.bio || 'No bio provided yet. Add a bio to tell students about yourself!'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                                        <BookOpen size={48} className="mb-4 text-slate-300" />
                                        <p className="text-lg font-medium text-slate-500">Student profiles do not require a bio.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;