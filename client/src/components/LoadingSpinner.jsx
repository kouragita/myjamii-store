// LoadingSpinner.jsx
import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'large', message = 'Loading...' }) => {
    const sizeClasses = {
        small: 'w-6 h-6',
        medium: 'w-8 h-8',
        large: 'w-12 h-12'
    };

    return (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
            <div className="text-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4`}
                />
                <p className="text-gray-600 font-medium">{message}</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;