import { useState, useRef, useEffect, useCallback, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import '../ChaptersDropdown/ChaptersDropdown.scss';

const pad = (n) => String(n).padStart(2, '0');

function ChaptersDropdown({ items = [], onSelect, selectedId = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const id = useId();
  const panelId = `cd-panel-${id}`;

  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = () => setIsOpen((v) => !v);

  const handleSelect = useCallback(
    (item) => {
      onSelect(item.id);
      setIsOpen(false);
      triggerRef.current?.focus();
    },
    [onSelect]
  );

  // Ferme au clic extérieur (souris et tactile)
  useEffect(() => {
    const onDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) close();
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [close]);

  // Navigation clavier
  useEffect(() => {
    if (!isOpen) return undefined;

    const onKey = (e) => {
      const opts = [...(panelRef.current?.querySelectorAll('[role="option"]') ?? [])];
      if (!opts.length) return;

      const current = opts.indexOf(document.activeElement);
      const selectedIndex = Math.max(
        0,
        opts.findIndex((o) => o.dataset.id === String(selectedId))
      );

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = current === -1 ? selectedIndex : Math.min(current + 1, opts.length - 1);
        opts[next]?.focus();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = current === -1 ? selectedIndex : Math.max(current - 1, 0);
        opts[prev]?.focus();
      }
      if (e.key === 'Escape') {
        close();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, selectedId, close]);

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
          type="button"
          className="cd-trigger"
          ref={triggerRef}
          onClick={toggle}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={panelId}
        >
          {selectedItem && <span className="cd-trigger__num">{pad(selectedItem.id + 1)}</span>}
          <span className="cd-trigger__text">{selectedItem?.label ?? 'Sélectionner…'}</span>
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
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(item);
                }
              }}
              style={{ '--delay': `${Math.min(idx, 12) * 0.03}s` }}
            >
              <span className="cd-option__num">{pad(item.id + 1)}</span>
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