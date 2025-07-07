import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaExclamationTriangle, FaInfo, FaTimes } from 'react-icons/fa';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};

const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message, type = 'info', duration = 5000) => {
        const id = Date.now();
        const notification = { id, message, type };
        
        setNotifications(prev => [...prev, notification]);
        
        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
        
        return id;
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    const notificationIcons = {
        success: FaCheck,
        error: FaExclamationTriangle,
        warning: FaExclamationTriangle,
        info: FaInfo
    };

    const notificationColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };

    return (
        <NotificationContext.Provider value={{ addNotification, removeNotification }}>
            {children}
            
            {/* Notification Container */}
            <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
                <AnimatePresence>
                    {notifications.map(notification => {
                        const Icon = notificationIcons[notification.type];
                        const colorClass = notificationColors[notification.type];
                        
                        return (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                                className={`${colorClass} text-white p-4 rounded-lg shadow-lg flex items-center space-x-3`}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                <span className="flex-1 text-sm font-medium">{notification.message}</span>
                                <button
                                    onClick={() => removeNotification(notification.id)}
                                    className="text-white hover:text-gray-200 transition-colors duration-200"
                                >
                                    <FaTimes className="w-4 h-4" />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;