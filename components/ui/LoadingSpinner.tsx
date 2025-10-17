
import React from 'react';
// Fix: Import Variants type from framer-motion.
import { motion, Variants } from 'framer-motion';

interface LoadingSpinnerProps {
    text: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text }) => {
    // Fix: Add explicit Variants type to circleVariants to ensure correct type inference for animation properties.
    const circleVariants: Variants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: (i: number) => ({
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { delay: i * 0.2, type: "spring", duration: 1.5, bounce: 0 },
                opacity: { delay: i * 0.2, duration: 0.01 }
            }
        })
    };

    return (
        <div className="flex flex-col items-center justify-center gap-6 text-center text-cyan-300">
            <motion.svg
                width="100"
                height="100"
                viewBox="0 0 100 100"
                initial="hidden"
                animate="visible"
                className="drop-shadow-[0_0_8px_rgba(0,255,255,0.7)]"
            >
                <motion.circle cx="50" cy="50" r="40" stroke="#00ffff" strokeWidth="4" fill="none" custom={0} variants={circleVariants} />
                <motion.circle cx="50" cy="50" r="30" stroke="#ff00ff" strokeWidth="4" fill="none" custom={1} variants={circleVariants} />
                <motion.circle cx="50" cy="50" r="20" stroke="#00ffff" strokeWidth="4" fill="none" custom={2} variants={circleVariants} />
            </motion.svg>
            <p className="font-orbitron text-lg tracking-widest animate-pulse">{text}</p>
        </div>
    );
};

export default LoadingSpinner;