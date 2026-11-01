import { useEffect, useRef, useState } from 'react'
import './LoadingModal.scss'

const TITLE_LETTERS = 'Glandia'.split('')

const RING_RADIUS = 48
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

// Timings (en ms)
const PROGRESS_START = 1200 // l'anneau commence à se remplir
const PROGRESS_DURATION = 3200 // durée du remplissage
const EXIT_AT = 4800 // début du fondu de sortie
const COMPLETE_AT = 5300 // le site s'affiche

const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

const LoadingModal = ({ onComplete }) => {
    const [isExiting, setIsExiting] = useState(false)

    const progressRef = useRef(null)
    const headRef = useRef(null)
    const percentRef = useRef(null)

    // Garde toujours la dernière version de onComplete sans relancer les timers
    const onCompleteRef = useRef(onComplete)
    useEffect(() => {
        onCompleteRef.current = onComplete
    }, [onComplete])

    // Sortie + fin du chargement
    useEffect(() => {
        const exitTimer = setTimeout(() => setIsExiting(true), EXIT_AT)
        const doneTimer = setTimeout(() => onCompleteRef.current?.(), COMPLETE_AT)
        return () => {
            clearTimeout(exitTimer)
            clearTimeout(doneTimer)
        }
    }, [])

    // Animation de l'anneau + pourcentage (sans re-render React à chaque frame)
    useEffect(() => {
        const start = performance.now()
        let rafId

        const tick = (now) => {
            const elapsed = now - start
            const raw = Math.min(Math.max((elapsed - PROGRESS_START) / PROGRESS_DURATION, 0), 1)
            const p = easeInOutCubic(raw)

            if (progressRef.current) {
                progressRef.current.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - p)
            }

            if (headRef.current) {
                const angle = p * 2 * Math.PI
                headRef.current.setAttribute('cx', 50 + RING_RADIUS * Math.cos(angle))
                headRef.current.setAttribute('cy', 50 + RING_RADIUS * Math.sin(angle))
                headRef.current.style.opacity = raw > 0 ? 1 : 0
            }

            if (percentRef.current) {
                percentRef.current.textContent = `${Math.round(p * 100)}%`
            }

            if (raw < 1) rafId = requestAnimationFrame(tick)
        }

        rafId = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(rafId)
    }, [])

    return (
        <div
            className={`loading-modal${isExiting ? ' is-exiting' : ''}`}
            role="status"
            aria-live="polite"
            aria-label="Chargement de Glandia">
            <div className="loading-modal__bg" />

            <div className="loading-modal__stage">
                <div className="loading-modal__orb" />
                <div className="loading-modal__orb loading-modal__orb--two" />

                <svg
                    className="loading-modal__ring"
                    viewBox="0 0 100 100"
                    width="100%"
                    height="100%"
                    aria-hidden="true">
                    <defs>
                        <linearGradient
                            id="loading-ring-gradient"
                            gradientUnits="userSpaceOnUse"
                            x1="0"
                            y1="0"
                            x2="100"
                            y2="100">
                            <stop offset="0" stopColor="#D52D00" />
                            <stop offset="0.2" stopColor="#EF7627" />
                            <stop offset="0.4" stopColor="#FF9A56" />
                            <stop offset="0.55" stopColor="#FFFFFF" />
                            <stop offset="0.75" stopColor="#D162A4" />
                            <stop offset="1" stopColor="#A30262" />
                        </linearGradient>
                    </defs>

                    <circle className="loading-modal__track" cx="50" cy="50" r={RING_RADIUS} />
                    <circle
                        ref={progressRef}
                        className="loading-modal__progress"
                        cx="50"
                        cy="50"
                        r={RING_RADIUS}
                        strokeDasharray={RING_CIRCUMFERENCE}
                        strokeDashoffset={RING_CIRCUMFERENCE}
                    />
                    <circle ref={headRef} className="loading-modal__head" cx="98" cy="50" r="1.3" />
                </svg>

                <div className="loading-modal__center">
                    <h1 className="loading-modal__title">
                        {TITLE_LETTERS.map((letter, i) => (
                            <span className="loading-modal__letter" key={i}>
                                <span style={{ '--i': i }}>{letter}</span>
                            </span>
                        ))}
                    </h1>
                    <span className="loading-modal__percent" ref={percentRef}>
                        0%
                    </span>
                </div>
            </div>

            <p className="loading-modal__tagline">Bibliothèque Girls Love</p>

            <div className="loading-modal__vignette" />
            <div className="loading-modal__grain" />
        </div>
    )
}

export default LoadingModal
