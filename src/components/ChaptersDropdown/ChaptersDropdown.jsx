import { useState, useRef, useEffect, useCallback, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import '../ChaptersDropdown/ChaptersDropdown.scss';

function ChaptersDropdown({ items = [], onSelect, selectedId = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const panelRef = useRef(null);
  const id = useId();
  const panelId = `cd-panel-${id}`;

  const selectedItem = items.find(item => item.id === selectedId) ?? items[0];

  const handleSelect = useCallback((item) => {
    onSelect(item.id);
    setIsOpen(false);
  }, [onSelect]);

  const toggle = () => setIsOpen(v => !v);
  const close  = () => setIsOpen(false);

  // Ferme au clic extérieur
  useEffect(() => {
    const onDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) close();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  // Navigation clavier
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      const opts = panelRef.current?.querySelectorAll('[role="option"]');
      if (!opts?.length) return;
      const cur = [...opts].findIndex(o => o.dataset.id === String(selectedId));
      if (e.key === 'ArrowDown') { e.preventDefault(); opts[Math.min(cur + 1, opts.length - 1)]?.focus(); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); opts[Math.max(cur - 1, 0)]?.focus(); }
      if (e.key === 'Escape')    close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, selectedId]);

  // Scroll vers l'item sélectionné à l'ouverture
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    const active = panelRef.current.querySelector('.cd-option--active');
    active?.scrollIntoView({ block: 'nearest' });
  }, [isOpen]);

  return (
    <>
      {/* Backdrop mobile (bottom sheet) */}
      {isOpen && <div className="cd-backdrop" onClick={close} aria-hidden="true" />}

      <div className="cd-wrap" ref={dropdownRef}>
        <button
          className="cd-trigger"
          onClick={toggle}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={panelId}
        >
          <span className="cd-trigger__text">
            {selectedItem?.label ?? 'Sélectionner…'}
          </span>
          <ChevronDown className={`cd-trigger__icon ${isOpen ? 'cd-trigger__icon--open' : ''}`} />
        </button>

        <div
          id={panelId}
          className={`cd-panel ${isOpen ? 'cd-panel--open' : ''}`}
          role="listbox"
          aria-label="Chapitres"
          ref={panelRef}
        >
          {items.map((item, idx) => (
            <div
              key={item.id}
              className={`cd-option ${selectedId === item.id ? 'cd-option--active' : ''}`}
              role="option"
              tabIndex={isOpen ? 0 : -1}
              aria-selected={selectedId === item.id}
              data-id={item.id}
              onClick={() => handleSelect(item)}
              onKeyDown={(e) => e.key === 'Enter' && handleSelect(item)}
              style={{ '--delay': `${idx * 0.03}s` }}
            >
              <span className="cd-option__num">{String(item.id + 1).padStart(2, '0')}</span>
              <span className="cd-option__label">{item.label}</span>
              <span className="cd-option__dot" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ChaptersDropdown;