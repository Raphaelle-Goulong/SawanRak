import '../Search/Search.scss'
import { Search as SearchIcon, X } from 'lucide-react'
import { useState } from 'react'
import ResultSearch from '../ResultSearch/ResultSearch'
import NeonLogo from '../NeonLogo/NeonLogo'

const NAME = 'Raph'

// {name} est remplacé par le prénom ci-dessus
const PHRASES = {
    morning: [
        'Bonjour {name} ! Un petit chapitre avec ton café ?',
        'Belle journée pour commencer une nouvelle histoire.',
        'Le matin, tout est possible. Même un coup de cœur littéraire.'
    ],
    afternoon: [
        'Une pause lecture, {name} ?',
        'Le bon moment pour s’évader quelques chapitres.',
        'Et si on s’offrait une petite parenthèse ?'
    ],
    evening: [
        'Bonsoir {name}, quelle histoire pour ce soir ?',
        'La journée est finie, les histoires commencent.',
        'Installe-toi, il y a de quoi lire jusqu’à tard.'
    ],
    night: [
        'Encore debout, {name} ? Un dernier chapitre alors…',
        'La nuit est faite pour les histoires.',
        'Chut… il est tard, la lecture n’en sera que plus douce.'
    ],
    always: [
        'Hello {name}, es-tu prête pour de nouvelles aventures ?',
        'Quelle histoire va t’embarquer aujourd’hui ?',
        'Un nouveau chapitre t’attend, {name}.',
        'Et si le prochain coup de cœur était juste ici ?',
        'Qu’est-ce qu’on lit en ce moment ?',
        'Des histoires d’amour, de lumière et de pluie t’attendent.',
        'Prends ton temps, les livres ne vont nulle part.',
        'Cherche un titre, un auteur… ou laisse-toi surprendre.',
        'Ton prochain livre préféré est peut-être déjà là.',
        'Chaque livre commence par une première page.'
    ]
}

const getPeriod = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return 'morning'
    if (hour >= 12 && hour < 18) return 'afternoon'
    if (hour >= 18 && hour < 23) return 'evening'
    return 'night'
}

const shuffle = (list) => {
    const result = [...list]
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const tmp = result[i]
        result[i] = result[j]
        result[j] = tmp
    }
    return result
}

// Première phrase : adaptée à l'heure. Ensuite : le reste, mélangé.
const buildPlaylist = () => {
    const period = PHRASES[getPeriod()]
    const first = period[Math.floor(Math.random() * period.length)]
    const rest = shuffle([...period.filter((p) => p !== first), ...PHRASES.always])

    return [first, ...rest].map((phrase) => phrase.replace('{name}', NAME))
}

function Search({ searchTerm, setSearchTerm, onBookSelect }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [playlist] = useState(buildPlaylist)
    const [phraseIndex, setPhraseIndex] = useState(0)

    const nextPhrase = () => setPhraseIndex((i) => (i + 1) % playlist.length)

    const handleSearchChange = (e) => {
        const newSearchTerm = e.target.value
        setSearchTerm(newSearchTerm)
        setIsModalOpen(newSearchTerm.length > 0)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSearchTerm('')
    }

    return (
        <>
            <div className="Search">
                <div className="container-input">
                    <div className="text-section">
                        {/* On enveloppe le titre pour pouvoir ajouter un halo derrière */}
                        <div className="title-wrapper">
                            <NeonLogo as="h1" size="lg" />
                        </div>

                        {/* key : la phrase est remontée à chaque changement, donc l'animation se rejoue */}
                        <p key={phraseIndex} className="greeting" onAnimationEnd={nextPhrase}>
                            {playlist[phraseIndex]}
                        </p>
                    </div>

                    <div className="input-search">
                        <div className="input-wrapper">
                            <SearchIcon className="search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Recherche par titre, auteur..."
                                aria-label="Rechercher un livre par titre ou auteur"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="input"
                                autoComplete="off"
                                inputMode="search"
                                enterKeyHint="search"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    className="clear-btn"
                                    onClick={handleCloseModal}
                                    aria-label="Effacer la recherche"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ResultSearch
                searchTerm={searchTerm}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onBookSelect={onBookSelect}
            />
        </>
    )
}

export default Search