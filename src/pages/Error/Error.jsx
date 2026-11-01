import '../Error/Error.scss';
import { Link } from 'react-router-dom';

function Error() {
    // Génère 20 particules avec des positions/couleurs/délais aléatoires
    const particles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${6 + Math.random() * 6}s`,
        size: `${6 + Math.random() * 10}px`,
    }));

    return (
        <div className="container-error">
            {/* Particules flottantes en arrière-plan */}
            <div className="particles" aria-hidden="true">
                {particles.map((p) => (
                    <span
                        key={p.id}
                        className="particle"
                        style={{
                            left: p.left,
                            width: p.size,
                            height: p.size,
                            animationDelay: p.delay,
                            animationDuration: p.duration,
                        }}
                    />
                ))}
            </div>

            {/* Contenu */}
            <div className="error-content">
                <h1 className="error-title">
                    <span className="digit">4</span>
                    <span className="digit">0</span>
                    <span className="digit">4</span>
                </h1>

                <p className="error-text">
                    Oups ! La page que vous cherchez s'est envolée…
                </p>

                <Link to="/" className="error-link">
                    Retourner à l'accueil
                </Link>
            </div>
        </div>
    );
}

export default Error;