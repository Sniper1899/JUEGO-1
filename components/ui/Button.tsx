import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    children: React.ReactNode;
    isLoading?: boolean;
    variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, isLoading = false, variant = 'primary', disabled, ...props }) => {
    const baseClasses = 'font-tech w-full text-lg py-3 px-6 border-2 transition-all duration-300 focus:outline-none focus:ring-2 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-widest relative overflow-hidden';
    
    const variantClasses = {
        primary: 'bg-green-900/50 border-green-500 text-green-400 hover:bg-green-800/60 hover:text-green-300 focus:ring-green-400',
        secondary: 'bg-red-900/50 border-red-500 text-red-400 hover:bg-red-800/60 hover:text-red-300 focus:ring-red-400'
    };

    return (
        <motion.button
            whileHover={{ 
                '--x': '100%',
                scale: 1.02,
                textShadow: '0 0 5px currentColor'
             } as any}
            whileTap={{ scale: 0.98 }}
            className={`${baseClasses} ${variantClasses[variant]}`}
            disabled={isLoading || disabled}
            {...props}
        >
            <span className="relative z-10">{children}</span>
             {isLoading && (
                <svg className="animate-spin ml-3 h-5 w-5 absolute right-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {/* Glitch effect */}
            <motion.div
                className="absolute inset-0 bg-white/10"
                style={{
                    clipPath: 'polygon(0 0, var(--x, 0%) 0, var(--x, 0%) 100%, 0 100%)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            />
        </motion.button>
    );
};

export default Button;