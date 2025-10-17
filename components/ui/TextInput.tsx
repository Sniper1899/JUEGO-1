import React from 'react';

const TextInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
    return (
        <input
            ref={ref}
            className="font-tech w-full bg-black/80 border-2 border-green-500/50 rounded-none p-4 text-green-400 placeholder-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 focus:bg-black transition-all duration-300 text-lg"
            {...props}
        />
    );
});

TextInput.displayName = 'TextInput';
export default TextInput;