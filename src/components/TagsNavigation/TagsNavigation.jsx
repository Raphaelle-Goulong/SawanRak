import './TagsNavigation.scss';

function TagsNavigation({ activeTag, onTagClick }) {
   
    // Chaque tag correspond à une section différente du site
    const navigationTags = [
        { id: 'last-viewed', label: 'Dernier Livre Consulté' },
        { id: 'recent', label: 'Récents Ajouts' },
        { id: 'categories', label: 'Catégories' },
        { id: 'authors', label: 'Auteurs' },
        { id: 'all', label: 'Tous les Livres' }
    ];

    return (
        <div className="tags-navigation">
            <div className="tags-container">
                {/* Génère un bouton pour chaque tag */}
                {navigationTags.map(tag => (
                    <button
                        key={tag.id}
                        className={`tag-item ${activeTag === tag.id ? 'active' : ''}`}
                        onClick={() => onTagClick(tag.id)}
                    >
                        {tag.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default TagsNavigation;