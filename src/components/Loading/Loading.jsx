import './Loading.scss';

function Loading({ label = 'Chargement' }) {
    const chars = Array.from(label);

    return (
        <div className="loader" role="status" aria-live="polite" aria-label={label}>
            <div className="loader__visual" aria-hidden="true">
                <span className="loader__orb" />
                <span className="loader__orb loader__orb--two" />

                <svg className="loader__ring" viewBox="0 0 100 100">
                    <defs>
                        <linearGradient
                            id="loader-ring-gradient"
                            gradientUnits="userSpaceOnUse"
                            x1="0" y1="0" x2="100" y2="100"
                        >
                            <stop offset="0"    stopColor="#D52D00" />
                            <stop offset="0.25" stopColor="#EF7627" />
                            <stop offset="0.5"  stopColor="#FF9A56" />
                            <stop offset="0.75" stopColor="#D162A4" />
                            <stop offset="1"    stopColor="#A30262" />
                        </linearGradient>
                    </defs>
                    <circle className="loader__track" cx="50" cy="50" r="48" />
                    <circle
                        className="loader__arc"
                        cx="50" cy="50" r="48"
                        stroke="url(#loader-ring-gradient)"
                    />
                </svg>

                <span className="loader__mark">Gl</span>
            </div>

            <p className="loader__label" aria-hidden="true">
                {chars.map((char, i) => (
                    <span className="loader__char" key={i}>
                        <span style={{ '--i': i }}>{char === ' ' ? '\u00A0' : char}</span>
                    </span>
                ))}
            </p>
        </div>
    );
}

export default Loading;