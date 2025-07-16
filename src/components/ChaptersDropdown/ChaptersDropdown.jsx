import { useState, useRef, useEffect, useCallback } from 'react';
import '../Dropdown/Dropdown.scss';
import { ChevronRight } from 'lucide-react';

function ChaptersDropdown({ chapters = [], currentChapterIndex = 0, onSelectChapter }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const optionsRef = useRef(null);

    // Mémoïzation de la fonction de sélection
    const handleSelect = useCallback((index) => {
        onSelectChapter(index);
        setIsOpen(false);
    }, [onSelectChapter]);

    // Gestion du clic externe
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Scroll vers le chapitre actuel quand la liste est ouverte
    useEffect(() => {
        if (isOpen && optionsRef.current && chapters.length > 0) {
            const selectedOption = optionsRef.current.querySelector('.selected');
            if (selectedOption) {
                selectedOption.scrollIntoView({ 
                    block: 'nearest',
                    behavior: 'auto'
                });
            }
        }
    }, [isOpen, chapters.length]);

    return (
        <div className="select" ref={dropdownRef}>
            <div 
                className="selected" 
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="truncate">
                    {chapters[currentChapterIndex]?.title || `Chapitre ${currentChapterIndex + 1}`}
                </span>
                <ChevronRight 
                    className={`arrow ${isOpen ? 'open' : ''}`} 
                    size={18}
                />
            </div>

            <div 
                className={`options ${isOpen ? 'show' : ''}`}
                ref={optionsRef}
                role="listbox"
                aria-label="Liste des chapitres"
            >
                {chapters.map((chapter, index) => (
                    <div
                        key={`chapter-${index}`}
                        role="option"
                        aria-selected={currentChapterIndex === index}
                        className={`option ${currentChapterIndex === index ? 'selected' : ''}`}
                        onClick={() => handleSelect(index)}
                    >
                        <span className="chapter-number">Chapitre {index + 1}:</span>
                        <span className="chapter-title">
                            {chapter.title || 'Sans titre'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ChaptersDropdown;