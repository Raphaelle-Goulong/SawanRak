import React, { useState, useEffect } from 'react'

const StartScreen = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Fade out et fermeture après 3 secondes
    const finishTimer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onFinish() // Bien appelé ici
      }, 500) // Délai pour l'animation de fade out
    }, 3000)

    return () => {
      clearTimeout(finishTimer)
    }
}, [onFinish])

  const splashStyles = {
    splashScreen: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: '#000000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      opacity: 1,
      transition: 'opacity 0.5s ease-out',
    },
    fadeOut: {
      opacity: 0,
    },
    loaderContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '2rem',
      gap: '0.1rem',
      flexWrap: 'wrap',
      maxWidth: '90vw',
    },
    subtitle: {
      color: 'white',
      fontSize: '1.2rem',
      opacity: 0.8,
      fontWeight: 300,
      marginTop: '1rem',
      textAlign: 'center',
    },
  }

  if (!isVisible) return null

  return (
    <>
      <style>
        {`
          .absolute {
            position: absolute;
          }
          .inline-block {
            display: inline-block;
          }
          .loader {
            display: flex;
            margin: 0.25em 0;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            gap: 0.1rem;
          }
          .w-2 {
            width: 0.5em;
          }
          .dash {
            animation: dashArray 2s ease-in-out infinite,
              dashOffset 2s linear infinite;
          }
          .spin {
            animation: spinDashArray 2s ease-in-out infinite,
              spin 8s ease-in-out infinite,
              dashOffset 2s linear infinite;
            transform-origin: center;
          }
          @keyframes dashArray {
            0% {
              stroke-dasharray: 0 1 359 0;
            }
            50% {
              stroke-dasharray: 0 359 1 0;
            }
            100% {
              stroke-dasharray: 359 1 0 0;
            }
          }
          @keyframes spinDashArray {
            0% {
              stroke-dasharray: 270 90;
            }
            50% {
              stroke-dasharray: 0 360;
            }
            100% {
              stroke-dasharray: 270 90;
            }
          }
          @keyframes dashOffset {
            0% {
              stroke-dashoffset: 365;
            }
            100% {
              stroke-dashoffset: 5;
            }
          }
          @keyframes spin {
            0% {
              rotate: 0deg;
            }
            12.5%,
            25% {
              rotate: 270deg;
            }
            37.5%,
            50% {
              rotate: 540deg;
            }
            62.5%,
            75% {
              rotate: 810deg;
            }
            87.5%,
            100% {
              rotate: 1080deg;
            }
          }
        `}
      </style>
      <div style={{
        ...splashStyles.splashScreen,
        ...(isVisible ? {} : splashStyles.fadeOut)
      }}>
        <div style={splashStyles.loaderContainer}>
          <div className="loader">
            <svg height="0" width="0" viewBox="0 0 64 64" className="absolute">
              <defs xmlns="http://www.w3.org/2000/svg">
                <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="b">
                  <stop stopColor="#973BED"></stop>
                  <stop stopColor="#007CFF" offset="1"></stop>
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" y2="0" x2="0" y1="64" x1="0" id="c">
                  <stop stopColor="#FFC800"></stop>
                  <stop stopColor="#F0F" offset="1"></stop>
                  <animateTransform repeatCount="indefinite" keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1" keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1" dur="8s" values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32" type="rotate" attributeName="gradientTransform"></animateTransform>
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="d">
                  <stop stopColor="#00E0ED"></stop>
                  <stop stopColor="#00DA72" offset="1"></stop>
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="e">
                  <stop stopColor="#FF6B6B"></stop>
                  <stop stopColor="#FFE66D" offset="1"></stop>
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="f">
                  <stop stopColor="#4ECDC4"></stop>
                  <stop stopColor="#44A08D" offset="1"></stop>
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="g">
                  <stop stopColor="#A8E6CF"></stop>
                  <stop stopColor="#88D8A3" offset="1"></stop>
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="h">
                  <stop stopColor="#FFB74D"></stop>
                  <stop stopColor="#FF8A65" offset="1"></stop>
                </linearGradient>
              </defs>
            </svg>

            {/* G */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="60" width="60" className="inline-block">
              <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#b)" 
                d="M 32,8 C 18.745166,8 8,18.745166 8,32 8,45.254834 18.745166,56 32,56 c 8.731251,0 16.38838,-4.635718 20.658203,-11.574219 L 42,36 H 32 v -8 h 20 v 4 C 52,45.254834 43.254834,56 32,56 15.431458,56 2,42.568542 2,32 2,15.431458 15.431458,2 32,2 c 16.568542,0 30,13.431458 30,30 h -8 c 0,-12.150264 -9.849736,-22 -22,-22 z" 
                className="dash" pathLength="360" />
            </svg>

            {/* L */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="60" width="60" className="inline-block">
              <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#d)" 
                d="M 12,8 V 56 H 52 V 48 H 20 V 8 Z" 
                className="dash" pathLength="360" />
            </svg>

            {/* A */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="60" width="60" className="inline-block">
              <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#e)" 
                d="M 32,8 L 8,56 h 8 l 4,-8 h 24 l 4,8 h 8 z M 22,40 h 20 L 32,20 Z" 
                className="dash" pathLength="360" />
            </svg>

            {/* N */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="60" width="60" className="inline-block">
              <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#f)" 
                d="M 8,56 V 8 h 8 l 32,32 V 8 h 8 v 48 h -8 L 16,24 v 32 z" 
                className="dash" pathLength="360" />
            </svg>

            {/* D */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="60" width="60" className="inline-block">
              <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#g)" 
                d="M 8,8 V 56 H 32 C 45.254834,56 56,45.254834 56,32 56,18.745166 45.254834,8 32,8 Z M 16,16 H 32 C 40.836556,16 48,23.163444 48,32 48,40.836556 40.836556,48 32,48 H 16 Z" 
                className="dash" pathLength="360" />
            </svg>

            {/* I */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="60" width="60" className="inline-block">
              <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#h)" 
                d="M 20,8 V 16 h 8 v 32 h -8 v 8 h 24 v -8 h -8 V 16 h 8 V 8 Z" 
                className="dash" pathLength="360" />
            </svg>

            {/* A */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="60" width="60" className="inline-block">
              <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#b)" 
                d="M 32,8 L 8,56 h 8 l 4,-8 h 24 l 4,8 h 8 z M 22,40 h 20 L 32,20 Z" 
                className="dash" pathLength="360" />
            </svg>
          </div>
        </div>
        
        <p style={splashStyles.subtitle}>Votre bibliothèque personnelle</p>
      </div>
    </>
  )
}

export default StartScreen