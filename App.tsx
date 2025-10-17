import React, { useState, useCallback } from 'react';
import { GamePhase, SmartPlan, SmartPhaseKey } from './types';
import StartScreen from './components/screens/StartScreen';
import CinematicScreen from './components/screens/CinematicScreen';
import GoalInputScreen from './components/screens/GoalInputScreen';
import SmartPhaseScreen from './components/screens/SmartPhaseScreen';
import VictoryScreen from './components/screens/VictoryScreen';
import ReadyScreen from './components/screens/ReadyScreen';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingSpinner from './components/ui/LoadingSpinner';

const SMART_PHASES: SmartPhaseKey[] = ['S', 'M', 'A', 'R', 'T'];

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GamePhase>(GamePhase.START);
    const [codename, setCodename] = useState('');
    const [userGoal, setUserGoal] = useState('');
    const [smartPlan, setSmartPlan] = useState<SmartPlan>({ S: null, M: null, A: null, R: null, T: null });
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

    const handleStart = (name: string) => {
        setCodename(name);
        setGameState(GamePhase.CINEMATIC_INTRO);
    };

    const handleReady = () => {
        setGameState(GamePhase.GOAL_INPUT);
    };

    const handleGoalSet = (goal: string) => {
        setUserGoal(goal);
        setGameState(GamePhase.DECRYPTING);
        // Simulate decryption time before the first cinematic
        setTimeout(() => {
            setGameState(GamePhase.CINEMATIC_S);
        }, 3000);
    };

    const handlePhaseComplete = (phase: SmartPhaseKey, answer: string) => {
        setSmartPlan(prev => ({ ...prev, [phase]: answer }));
        const nextPhaseIndex = currentPhaseIndex + 1;
        
        if (nextPhaseIndex < SMART_PHASES.length) {
            const nextPhaseKey = SMART_PHASES[nextPhaseIndex];
            const cinematicState = `CINEMATIC_${nextPhaseKey}` as GamePhase;
            setGameState(cinematicState);
        } else {
            setGameState(GamePhase.CINEMATIC_FINAL);
        }
    };

    const handleCinematicEnd = useCallback((phase: GamePhase) => {
        switch (phase) {
            case GamePhase.CINEMATIC_INTRO:
                setGameState(GamePhase.READY_SCREEN);
                break;
            case GamePhase.CINEMATIC_S:
                setCurrentPhaseIndex(0);
                setGameState(GamePhase.MISSION_START);
                break;
            case GamePhase.CINEMATIC_M:
                setCurrentPhaseIndex(1);
                setGameState(GamePhase.MISSION_START);
                break;
            case GamePhase.CINEMATIC_A:
                setCurrentPhaseIndex(2);
                setGameState(GamePhase.MISSION_START);
                break;
            case GamePhase.CINEMATIC_R:
                setCurrentPhaseIndex(3);
                setGameState(GamePhase.MISSION_START);
                break;
            case GamePhase.CINEMATIC_T:
                setCurrentPhaseIndex(4);
                setGameState(GamePhase.MISSION_START);
                break;
            case GamePhase.CINEMATIC_FINAL:
                setGameState(GamePhase.VICTORY);
                break;
        }
    }, []);

    const renderGameState = () => {
        const currentPhase = SMART_PHASES[currentPhaseIndex];

        switch (gameState) {
            case GamePhase.START:
                return <StartScreen onStart={handleStart} />;
            case GamePhase.CINEMATIC_INTRO:
                return <CinematicScreen videoSrc="video1.mp4" onEnded={() => handleCinematicEnd(GamePhase.CINEMATIC_INTRO)} />;
            case GamePhase.READY_SCREEN:
                return <ReadyScreen codename={codename} onReady={handleReady} />;
            case GamePhase.GOAL_INPUT:
                return <GoalInputScreen onGoalSet={handleGoalSet} codename={codename} />;
            case GamePhase.DECRYPTING:
                 return (
                    <motion.div key="decrypting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full items-center justify-center">
                        <LoadingSpinner text="DESCIFRANDO CONTRASEÑA..." />
                    </motion.div>
                );
            case GamePhase.MISSION_START:
                return <SmartPhaseScreen userGoal={userGoal} phase={currentPhase} onComplete={handlePhaseComplete} smartPlan={smartPlan} codename={codename} />;
            case GamePhase.CINEMATIC_S:
                 return <CinematicScreen videoSrc="video2.mp4" onEnded={() => handleCinematicEnd(GamePhase.CINEMATIC_S)} />;
            case GamePhase.CINEMATIC_M:
                return <CinematicScreen videoSrc="video3.mp4" onEnded={() => handleCinematicEnd(GamePhase.CINEMATIC_M)} />;
            case GamePhase.CINEMATIC_A:
                 return <CinematicScreen videoSrc="video4.mp4" onEnded={() => handleCinematicEnd(GamePhase.CINEMATIC_A)} />;
            case GamePhase.CINEMATIC_R:
                return <CinematicScreen videoSrc="video5.mp4" onEnded={() => handleCinematicEnd(GamePhase.CINEMATIC_R)} />;
            case GamePhase.CINEMATIC_T:
                return <CinematicScreen videoSrc="video_final.mp4" onEnded={() => handleCinematicEnd(GamePhase.CINEMATIC_T)} />;
            case GamePhase.CINEMATIC_FINAL:
                return <CinematicScreen videoSrc="video_final.mp4" onEnded={() => handleCinematicEnd(GamePhase.CINEMATIC_FINAL)} />;

            case GamePhase.VICTORY:
                return <VictoryScreen codename={codename} smartPlan={smartPlan} userGoal={userGoal} />;
            default:
                return <div>Cargando...</div>;
        }
    };

    return (
        <main className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#010409] relative overflow-hidden hacker-bg scanlines">
            <div className="w-full h-full max-w-7xl mx-auto flex flex-col relative">
                 <AnimatePresence mode="wait">
                    {renderGameState()}
                </AnimatePresence>
            </div>
        </main>
    );
};

export default App;
