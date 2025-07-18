import { useState } from 'react';
import '../Grip/Grip.scss';
import Dropdown from '../Dropdown/Dropdown';
import { Grip as GripIcon } from 'lucide-react';

function Grip({ onFilterChange }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSelect = (value) => {
        onFilterChange(value);
        setIsDropdownOpen(false); // Ferme le dropdown après sélection
    };

    return (
        <div className="Section-Grip">
            {!isDropdownOpen && (
                <GripIcon 
                    className="grip-icon" 
                    onClick={() => setIsDropdownOpen(true)} 
                />
            )}
            {isDropdownOpen && (
                <Dropdown onSelect={handleSelect} />
            )}
        </div>
    );
}

export default Grip;