import React, { useEffect, useState, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import { Bell, X, CheckCircle, AlertCircle } from 'lucide-react';

// Make it exportable so we can use a mock toast globally if needed later, but for now we listen to socket + a custom event
const NotificationToast = () => {
    const { socket } = useSocket();
    const [notifications, setNotifications] = useState([]);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const addNotification = useCallback((message, type) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            removeNotification(id);
        }, 4000);
    }, [removeNotification]);

    useEffect(() => {
        // Listen to socket
        if (socket) {
            socket.on('newAssignment', (data) => {
                addNotification(`New assignment: ${data.title}`, 'info');
            });
        }

        // Listen to a custom browser event for manual triggers (e.g. from CourseManager, CourseDetails)
        const handleCustomToast = (event) => {
            const { message, type } = event.detail;
            addNotification(message, type || 'success');
        };

        window.addEventListener('show-toast', handleCustomToast);

        return () => {
            if (socket) socket.off('newAssignment');
            window.removeEventListener('show-toast', handleCustomToast);
        };
    }, [socket, addNotification]);

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
            {notifications.map(notif => (
                <div 
                    key={notif.id} 
                    className="pointer-events-auto flex items-start gap-3 glass-dark text-white px-5 py-4 rounded-2xl shadow-2xl transform transition-all duration-300 animate-fade-in-up border border-slate-700/50 min-w-[300px] max-w-sm"
                >
                    <div className="mt-0.5 shrink-0">
                        {notif.type === 'success' ? (
                            <CheckCircle className="text-teal-400" size={20} />
                        ) : notif.type === 'error' ? (
                            <AlertCircle className="text-red-400" size={20} />
                        ) : (
                            <Bell className="text-blue-400" size={20} />
                        )}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium">{notif.message}</p>
                    </div>
                    <button 
                        onClick={() => removeNotification(notif.id)}
                        className="text-slate-400 hover:text-white transition-colors shrink-0"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default NotificationToast;

// Helper to trigger toast from anywhere
export const showToast = (message, type = 'success') => {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, type } }));
};
