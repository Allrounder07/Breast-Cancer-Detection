import React, { useState, useEffect } from 'react';
import { SparklesIcon } from './Icons';

const messages = [
    "Checking image quality...",
    "Initializing analysis...",
    "Applying advanced AI algorithms...",
    "Analyzing thermal patterns...",
    "Generating heatmap visualization...",
    "Consulting with AI for summary...",
    "Finalizing results...",
];

export const Loader: React.FC = () => {
    const [message, setMessage] = useState(messages[0]);

    useEffect(() => {
        let index = 0;
        const intervalId = setInterval(() => {
            index = (index + 1) % messages.length;
            setMessage(messages[index]);
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="bg-slate-800/50 p-8 rounded-2xl shadow-lg border border-slate-700 flex flex-col items-center justify-center min-h-[400px]">
            <div className="relative flex items-center justify-center w-20 h-20">
                <div className="absolute w-full h-full border-4 border-slate-600 rounded-full"></div>
                <div className="absolute w-full h-full border-t-4 border-cyan-400 rounded-full animate-spin"></div>
                <SparklesIcon className="w-8 h-8 text-cyan-400" />
            </div>
            <p className="text-white font-semibold mt-6 text-lg">Analyzing Image</p>
            <p className="text-slate-400 mt-2 text-center transition-opacity duration-500">{message}</p>
        </div>
    );
};