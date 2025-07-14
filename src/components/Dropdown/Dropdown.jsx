import { useState, useRef, useEffect } from 'react'
import '../Dropdown/Dropdown.scss'
import { ChevronRight } from 'lucide-react'

function Dropdown({ onSelect }) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState('Categories')
    const dropdownRef = useRef(null)

    // Fermer le dropdown quand on clique ailleurs
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (option) => {
        setSelectedOption(option)
        onSelect(option)
        setIsOpen(false)
    }

    return (
        <div className="select" ref={dropdownRef}>
            <div className="selected" onClick={() => setIsOpen(!isOpen)}>
                <span>{selectedOption}</span>
                <ChevronRight className={`arrow ${isOpen ? 'open' : ''}`} />
            </div>

            <div className={`options ${isOpen ? 'show' : ''}`}>
                <div
                    className={`option ${selectedOption === 'All' ? 'selected' : ''}`}
                    onClick={() => handleSelect('All')}>
                    All
                </div>
                <div
                    className={`option ${selectedOption === 'Author' ? 'selected' : ''}`}
                    onClick={() => handleSelect('Author')}>
                    Author
                </div>
                <div
                    className={`option ${selectedOption === 'Categories' ? 'selected' : ''}`}
                    onClick={() => handleSelect('Categories')}>
                    Categories
                </div>
            </div>
        </div>
    )
}

export default Dropdown
