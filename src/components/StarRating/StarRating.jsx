import { useState, useEffect, useId, Fragment } from 'react';
import '../StarRating/StarRating.scss';

// Ordre inversé : le CSS utilise row-reverse pour colorier les étoiles « avant » la sélection
const STARS = [5, 4, 3, 2, 1];

function StarRating({ bookId, interactive = true, size = 'md', onRatingChange }) {
    const uid = useId();
    const [userRating, setUserRating] = useState(0);

    useEffect(() => {
        if (!bookId) {
            setUserRating(0);
            return;
        }
        try {
            const saved = localStorage.getItem(`book-${bookId}-rating`);
            setUserRating(saved ? parseInt(saved, 10) || 0 : 0);
        } catch {
            setUserRating(0);
        }
    }, [bookId]);

    const handleChange = (value) => {
        const newRating = parseInt(value, 10);
        setUserRating(newRating);

        if (bookId) {
            try {
                localStorage.setItem(`book-${bookId}-rating`, String(newRating));
                localStorage.setItem(`book-${bookId}-rating-date`, new Date().toISOString());
            } catch {
                /* stockage indisponible : on ignore */
            }
        }

        onRatingChange?.(newRating);
    };

    return (
        <div className={`star-rating star-rating--${size}${interactive ? '' : ' is-readonly'}`}>
            <div className="radio" role="radiogroup" aria-label="Note du livre">
                {STARS.map((value) => (
                    <Fragment key={value}>
                        <input
                            id={`${uid}-${value}`}
                            type="radio"
                            name={`${uid}-rating`}
                            value={value}
                            checked={userRating === value}
                            disabled={!interactive}
                            onChange={(e) => handleChange(e.target.value)}
                        />
                        <label
                            htmlFor={`${uid}-${value}`}
                            title={`${value} ${value > 1 ? 'étoiles' : 'étoile'}`}
                        >
                            <svg
                                viewBox="0 0 576 512"
                                height="1em"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                            </svg>
                            <span className="sr-only">{value} sur 5</span>
                        </label>
                    </Fragment>
                ))}
            </div>

            {userRating > 0 && <span className="rating-number">{userRating}/5</span>}
        </div>
    );
}

export default StarRating;