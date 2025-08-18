import React, { useState, useEffect } from 'react';
import './LoadingModal.scss';

const LoadingModal = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [animationPhase, setAnimationPhase] = useState('entering'); // entering, showing, exiting

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setAnimationPhase('showing');
        }, 500);

        const timer2 = setTimeout(() => {
            setAnimationPhase('exiting');
        }, 4000); // Augmenté pour laisser le temps à toute l'animation

        const timer3 = setTimeout(() => {
            setIsVisible(false);
            onComplete();
        }, 4500); // Total de 4.5 secondes

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [onComplete]);

    if (!isVisible) return null;

    return (
        <div className={`loading-modal ${animationPhase}`}>
            <div className="loading-content">
                <div className="glandia-logo">
                    <span className="letter g">G</span>
                    <span className="letter l">L</span>
                    <span className="letter a1">a</span>
                    <span className="letter n">n</span>
                    <span className="letter d">d</span>
                    <span className="letter i">i</span>
                    <span className="letter a2">a</span>
                </div>
                {/* <div className="loading-bar">
                    <div className="loading-progress"></div>
                </div> */}
            </div>
        </div>
    );
};

export default LoadingModal;