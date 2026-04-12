import { useState, useEffect, Fragment } from 'react';
import '../StarRating/StarRating.scss';

function StarRating({ bookId, interactive = true }) {
    const [userRating, setUserRating] = useState(0);

    useEffect(() => {
        if (bookId) {
            const savedRating = localStorage.getItem(`book-${bookId}-rating`);
            if (savedRating) {
                setUserRating(parseInt(savedRating, 10));
            }
        }
    }, [bookId]);

    const handleRatingChange = (value) => {
        const newRating = parseInt(value, 10);
        setUserRating(newRating);
        if (bookId) {
            localStorage.setItem(`book-${bookId}-rating`, newRating.toString());
        }
    };

    return (
        <div className="star-rating">
            <div className="radio">
                {[5, 4, 3, 2, 1].map((starValue) => (
                    <Fragment key={starValue}>
                        <input
                            id={`rating-${starValue}-${bookId}`}
                            type="radio"
                            name={`rating-${bookId}`}
                            value={starValue}
                            checked={userRating === starValue}
                            onChange={(e) => interactive && handleRatingChange(e.target.value)}
                        />
                        <label
                            htmlFor={`rating-${starValue}-${bookId}`}
                            title={`${starValue} stars`}
                        >
                            <svg viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                            </svg>
                        </label>
                    </Fragment>
                ))}
            </div>
            {userRating > 0 && <span className="rating-number">{userRating}/5</span>}
        </div>
    );
}

export default StarRating;