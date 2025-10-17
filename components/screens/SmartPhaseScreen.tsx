
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SmartPhaseKey, SmartPlan } from '../../types';
import { generateQuestion, analyzeResponse } from '../../services/geminiService';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

// Custom hook for typing effect
const useTypingEffect = (text: string, speed = 20) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText('');
        if (text) {
            let i = 0;
            const intervalId = setInterval(() => {
                i++;
                setDisplayedText(text.substring(0, i));
                if (i >= text.length) {
                    clearInterval(intervalId);
                }
            }, speed);
            return () => clearInterval(intervalId);
        }
    }, [text, speed]);

    return displayedText;
};

interface SmartPhaseScreenProps {
    userGoal: string;
    phase: SmartPhaseKey;
    onComplete: (phase: SmartPhaseKey, answer: string) => void;
    smartPlan: SmartPlan;
    codename: string;
}

const phaseDetails = {
    S: { title: "PROTOCOLO: ESPECÍFICO", color: "text-green-400" },
    M: { title: "PROTOCOLO: MEDIBLE", color: "text-red-400" },
    A: { title: "PROTOCOLO: ALCANZABLE", color: "text-yellow-400" },
    R: { title: "PROTOCOLO: RELEVANTE", color: "text-cyan-400" },
    T: { title: "PROTOCOLO: TEMPORAL", color: "text-purple-400" },
};

const SmartPhaseScreen: React.FC<SmartPhaseScreenProps> = ({ userGoal, phase, onComplete, smartPlan, codename }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState<{ type: 'hint' | 'success', message: string } | null>(null);
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    const typedQuestion = useTypingEffect(question);
    const typedFeedback = useTypingEffect(feedback?.message || '');

    const fetchQuestion = useCallback(async () => {
        setIsLoading(true);
        setFeedback(null);
        setAnswer('');
        setQuestion('');
        const q = await generateQuestion(phase, userGoal, smartPlan);
        setQuestion(q);
        setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, userGoal]);

    useEffect(() => {
        fetchQuestion();
    }, [fetchQuestion]);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [typedQuestion, typedFeedback, isAnalyzing]);

    const handleSubmit = async () => {
        if (!answer.trim()) return;
        setIsAnalyzing(true);
        setFeedback(null);
        const result = await analyzeResponse(phase, userGoal, answer);
        
        // Simulate analysis time
        setTimeout(() => {
            setIsAnalyzing(false);
            if (result.approved) {
                setFeedback({ type: 'success', message: result.feedback });
            } else {
                setFeedback({ type: 'hint', message: result.feedback });
            }
        }, 1500);
    };

    if (isLoading) {
        return <div className="flex h-full items-center justify-center font-tech"><LoadingSpinner text={`ACCEDIENDO A PROTOCOLO ${phase}...`} /></div>;
    }

    return (
        <motion.div
            key={phase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col h-full p-4 font-tech"
        >
            <div className="border-b-2 border-green-500/50 pb-2 mb-4">
                <h2 className={`font-orbitron text-2xl font-bold ${phaseDetails[phase].color} text-glow`}>
                    {phaseDetails[phase].title}
                </h2>
                <p className="text-gray-500 text-sm">OBJETIVO PRINCIPAL: "{userGoal}"</p>
            </div>

            <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                {question && (
                     <p className="text-green-400 whitespace-pre-wrap"><span className="text-red-500">S.A.T.></span> {typedQuestion}</p>
                )}
               
                <AnimatePresence>
                    {isAnalyzing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <p className="text-yellow-400 animate-pulse">S.A.T.> ANALIZANDO RESPUESTA...</p>
                        </motion.div>
                    )}
                    {feedback && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`whitespace-pre-wrap ${feedback.type === 'success' ? 'text-green-400' : 'text-yellow-400'}`}
                        >
                           <span className="text-red-500">S.A.T.></span> <span dangerouslySetInnerHTML={{ __html: typedFeedback.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white text-glow">$1</strong>') }} />
                        </motion.p>
                    )}
                </AnimatePresence>
                <div ref={endOfMessagesRef} />
            </div>
            
            <div className="mt-auto pt-4 border-t-2 border-green-500/50">
                 {feedback?.type === 'success' ? (
                     <Button onClick={() => onComplete(phase, answer)}>
                         SIGUIENTE PROTOCOLO
                     </Button>
                ) : (
                    <div className="flex flex-col md:flex-row items-stretch gap-4">
                        <div className="flex-grow flex items-start gap-2 border-2 border-green-500/50 p-2">
                            <label htmlFor="agentInput" className="text-green-400 mt-1 flex-shrink-0">{codename.toUpperCase()}>></label>
                            <textarea
                                id="agentInput"
                                className="font-tech text-lg w-full flex-grow bg-transparent border-none focus:outline-none text-green-300 resize-none"
                                placeholder="Introducir estrategia..."
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                disabled={isAnalyzing}
                                rows={3}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit();
                                    }
                                }}
                            />
                        </div>
                        <Button onClick={handleSubmit} isLoading={isAnalyzing} disabled={!answer.trim()} variant="secondary" className="md:w-48 flex-shrink-0">
                            EJECUTAR
                        </Button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default SmartPhaseScreen;
