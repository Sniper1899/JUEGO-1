import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../ui/LoadingSpinner';

interface CinematicScreenProps {
    videoSrc: string;
    onEnded: () => void;
}

const CinematicScreen: React.FC<CinematicScreenProps> = ({ videoSrc, onEnded }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Use a ref to ensure onEnded is only called once.
    const onEndedCalled = useRef(false);
    const handleEnd = useCallback(() => {
        if (!onEndedCalled.current) {
            onEndedCalled.current = true;
            onEnded();
        }
    }, [onEnded]);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            // Attempt to play the video.
            const playPromise = videoElement.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Video autoplay failed, skipping cinematic:", error);
                    // If autoplay is prevented, skip the cinematic.
                    handleEnd(); 
                });
            }
        }
    }, [handleEnd]);

    return (
        <motion.div
            key="cinematic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full bg-black flex items-center justify-center"
        >
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <LoadingSpinner text="CARGANDO TRANSMISIÓN..." />
                </div>
            )}
            <video
                ref={videoRef}
                src={videoSrc}
                onEnded={handleEnd}
                // If the video file fails to load (e.g., not found), skip the cinematic.
                onError={handleEnd} 
                // Hide the loader once the video is ready to play.
                onCanPlay={() => setIsLoading(false)} 
                // Use 'object-contain' to ensure vertical videos are not cropped.
                className="w-full h-full object-contain"
                // Mute the video to comply with browser autoplay policies.
                muted 
                playsInline
            />
        </motion.div>
    );
};

export default CinematicScreen;