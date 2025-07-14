import { useState } from 'react';
import '../Grip/Grip.scss';
import Dropdown from '../Dropdown/Dropdown';
import { Grip as GripIcon } from 'lucide-react';

function Grip({ onFilterChange }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <div className="Section-Grip">
            <GripIcon 
                className="grip-icon" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
            />
            {isDropdownOpen && (
                <Dropdown onSelect={onFilterChange} />
            )}
        </div>
    );
}

export default Grip;