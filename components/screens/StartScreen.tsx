import React, { useState } from 'react';
import Button from '../ui/Button';
import TextInput from '../ui/TextInput';
import { motion } from 'framer-motion';

interface StartScreenProps {
    onStart: (codename: string) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onStart(name.trim());
        }
    };

    return (
        <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col h-full justify-center items-center text-center p-4 font-tech"
        >
            <h1 className="font-orbitron text-5xl md:text-7xl font-black text-green-400 text-glow">
                HÉROE CÍVICO
            </h1>
            <p className="text-red-500 mt-2 mb-12 text-xl tracking-widest text-glow">LA SOMBRA DEL CAPITOLIO</p>
            <p className="text-green-400 mb-8 max-w-md text-lg">[SISTEMA S.A.T. ONLINE] REQUIERE IDENTIFICACIÓN DE AGENTE.</p>
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
                <TextInput
                    type="text"
                    placeholder="INTRODUZCA NOMBRE CLAVE..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                />
                <Button type="submit" disabled={!name.trim()}>
                    INICIAR SESIÓN
                </Button>
            </form>
        </motion.div>
    );
};

export default StartScreen;