import React from 'react';
import Button from '../ui/Button';
import { motion } from 'framer-motion';

interface ReadyScreenProps {
    codename: string;
    onReady: () => void;
}

const ReadyScreen: React.FC<ReadyScreenProps> = ({ codename, onReady }) => {
    return (
        <motion.div
            key="ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col h-full justify-center items-center text-center p-4 font-tech"
        >
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-green-400 text-glow">TRANSMISIÓN RECIBIDA</h2>
            <p className="text-green-400 mt-6 mb-12 max-w-2xl text-xl">
                Okay, agente <span className="text-red-500 font-bold">{codename.toUpperCase()}</span>. La misión está en marcha. ¿Listo para infiltrarte en el sistema?
            </p>
            <div className="w-full max-w-sm">
                <Button onClick={onReady}>
                    LISTO PARA JUGAR
                </Button>
            </div>
        </motion.div>
    );
};

export default ReadyScreen;
