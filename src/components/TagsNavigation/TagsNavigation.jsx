import { useEffect, useRef } from 'react';
import './TagsNavigation.scss';

// Chaque tag correspond à une section différente du site
const NAVIGATION_TAGS = [
    { id: 'last-viewed', label: 'Dernier livre consulté' },
    { id: 'recent', label: 'Récents ajouts' },
    { id: 'categories', label: 'Catégories' },
    { id: 'authors', label: 'Auteurs' },
    { id: 'all', label: 'Tous les livres' }
];

function TagsNavigation({ activeTag, onTagClick }) {
    const containerRef = useRef(null);

    useEffect(() => {
        containerRef.current
            ?.querySelector('.tag-item.active')
            ?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    }, [activeTag]);

    return (
        <nav className="tags-navigation" aria-label="Parcourir la bibliothèque">
            <div className="tags-container" ref={containerRef}>
                {NAVIGATION_TAGS.map((tag) => (
                    <button
                        key={tag.id}
                        type="button"
                        className={`tag-item ${activeTag === tag.id ? 'active' : ''}`}
                        aria-pressed={activeTag === tag.id}
                        onClick={() => onTagClick(tag.id)}
                    >
                        {tag.label}
                    </button>
                ))}
            </div>
        </nav>
    );
}

export default TagsNavigation;