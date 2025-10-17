import React from 'react';
import { SmartPlan, SmartPhaseKey } from '../../types';
import { motion } from 'framer-motion';

interface VictoryScreenProps {
    codename: string;
    smartPlan: SmartPlan;
    userGoal: string;
}

const phaseTitles: { [key in SmartPhaseKey]: string } = {
    S: 'Específico',
    M: 'Medible',
    A: 'Alcanzable',
    R: 'Relevante',
    T: 'Temporal',
};

const VictoryScreen: React.FC<VictoryScreenProps> = ({ codename, smartPlan, userGoal }) => {
    return (
        <motion.div
            key="victory"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col h-full justify-center items-center text-center p-4 font-tech"
        >
            <h1 className="font-orbitron text-4xl md:text-6xl font-black text-green-400 text-glow">MISIÓN CUMPLIDA, {codename.toUpperCase()}</h1>
            <p className="text-cyan-300 mt-4 mb-8 text-xl tracking-wide">Has descifrado el código. Tu plan de acción está listo.</p>
            
            <div className="w-full max-w-4xl bg-black/50 border-2 border-green-500/50 p-6 text-left space-y-4">
                <h2 className="font-orbitron text-2xl text-red-500 text-glow border-b-2 border-red-500/50 pb-2">OBJETIVO: {userGoal}</h2>
                <div className="space-y-3">
                    {Object.entries(smartPlan).map(([key, value]) => (
                        <div key={key}>
                            <h3 className="text-lg font-bold text-green-400">{phaseTitles[key as SmartPhaseKey]}:</h3>
                            <p className="text-gray-300 whitespace-pre-wrap">{value}</p>
                        </div>
                    ))}
                </div>
            </div>

            <p className="text-xs text-gray-600 mt-8 max-w-md">El sistema S.A.T. se autodestruirá en 3... 2... 1... Este plan es ahora tuyo. Ejecútalo.</p>

        </motion.div>
    );
};

export default VictoryScreen;
