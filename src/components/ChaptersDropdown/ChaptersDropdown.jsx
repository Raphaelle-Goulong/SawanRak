import { useState, useRef, useEffect } from 'react';
import '../Dropdown/Dropdown.scss';
import { ChevronDown } from 'lucide-react';

function ChaptersDropdown({ items = [], onSelect, selectedId = 0 }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    const selectedItem = items.find(item => item.id === selectedId);

    const handleSelect = (id) => {
        onSelect(id);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="select" ref={dropdownRef}>
            <div 
                className="selected"
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span>{selectedItem?.label || items[0]?.label || 'Sélectionner...'}</span>
                <ChevronDown className={`arrow ${isOpen ? 'open' : ''}`} />
            </div>

            <div className={`options ${isOpen ? 'show' : ''}`} role="listbox">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={`option ${selectedId === item.id ? 'selected' : ''}`}
                        onClick={() => handleSelect(item.id)}
                        role="option"
                        aria-selected={selectedId === item.id}
                    >
                        {item.label}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ChaptersDropdown;