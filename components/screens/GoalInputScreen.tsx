import React, { useState } from 'react';
import Button from '../ui/Button';
import { motion } from 'framer-motion';

interface GoalInputScreenProps {
    onGoalSet: (goal: string) => void;
    codename: string;
}

const GoalInputScreen: React.FC<GoalInputScreenProps> = ({ onGoalSet, codename }) => {
    const [goal, setGoal] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (goal.trim()) {
            onGoalSet(goal.trim());
        }
    };

    return (
        <motion.div
            key="goalInput"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-full justify-center items-center text-center p-4 font-tech"
        >
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-green-400 text-glow">ACCESO AL SISTEMA</h2>
            <p className="text-green-400 mt-6 mb-8 max-w-2xl text-lg">
                AGENTE <span className="text-red-500 font-bold">{codename.toUpperCase()}</span>, has llegado al núcleo. Para ingresar, el sistema requiere una contraseña. Esta contraseña es tu meta más importante ahora mismo.
            </p>
            <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-6">
                <textarea
                    className="font-tech text-lg w-full bg-transparent border-2 border-green-500/50 p-4 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 text-green-300 resize-none"
                    placeholder="CONTRASEÑA: (Ej: Aprender a tocar guitarra, Terminar mi proyecto, Ponerse en forma...)"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    autoFocus
                    rows={3}
                />
                <Button type="submit" disabled={!goal.trim()}>
                    INGRESAR
                </Button>
            </form>
             <p className="text-xs text-gray-700 mt-6 max-w-md">Tu meta personal será la clave para encriptar toda la operación. S.A.T. la analizará para construir tu plan de acción.</p>
        </motion.div>
    );
};

export default GoalInputScreen;
