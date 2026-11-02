import { useMemo } from 'react'
import '../Categories/Categories.scss'
import Carrousel from '../../Carrousel/Carrousel'
import Card from '../../Card/Card'
import Loading from '../../Loading/Loading'
import useLivres from '../../../hooks/useLivres'

const toArray = (value) => (Array.isArray(value) ? value : [value])

const normalizeTitle = (title) =>
    String(title || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')

function Categories({ filterType = 'Categories', onCardClick: onClick }) {
    const { books, isLoading } = useLivres()

    // Catégories uniques, triées
    const allCategories = useMemo(
        () =>
            [
                ...new Set(books.flatMap((book) => toArray(book.categorie)).filter(Boolean))
            ].sort((a, b) => a.localeCompare(b, 'fr')),
        [books]
    )

    // Livres groupés par auteur, auteurs et livres triés
    const authorGroups = useMemo(() => {
        const groups = {}
        books.forEach((book) => {
            const author = book.auteur || 'Inconnu'
            if (!groups[author]) groups[author] = []
            groups[author].push(book)
        })

        return Object.keys(groups)
            .sort((a, b) => a.localeCompare(b, 'fr'))
            .map((author) => ({
                author,
                books: [...groups[author]].sort((a, b) =>
                    normalizeTitle(a.title).localeCompare(normalizeTitle(b.title), 'fr')
                )
            }))
    }, [books])

    // Tous les livres, par titre
    const sortedBooks = useMemo(
        () =>
            [...books].sort((a, b) =>
                normalizeTitle(a.title).localeCompare(normalizeTitle(b.title), 'fr')
            ),
        [books]
    )

    if (isLoading) {
        return (
            <div className="Categories-Loading">
                <Loading label="Chargement" />
            </div>
        )
    }

    return (
        <div className="Categories-Container">
            {filterType === 'Categories' && (
                <div className="Section-Categories">
                    <h2 className="Title-Categories">Explorer par catégories</h2>
                    {allCategories.map((category) => (
                        <div key={category} className="Category-group">
                            <div className="Category-books">
                                <Carrousel
                                    category={category}
                                    books={books.filter((book) =>
                                        toArray(book.categorie).includes(category)
                                    )}
                                    onCardClick={onClick}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {filterType === 'Author' && (
                <div className="Section-Author">
                    <h2 className="Title-Section">Nos auteurs</h2>
                    {authorGroups.map(({ author, books: authorBooks }) => (
                        <div key={author} className="Author-group">
                            <h3 className="Author-name">{author}</h3>
                            <div className="Author-books">
                                {authorBooks.map((book) => (
                                    <Card key={book.id} Book={book} onClick={() => onClick(book)} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {filterType === 'All' && (
                <div className="Section-AllBooks">
                    <h2 className="Title-Section">
                        Tous les livres <span>({books.length})</span>
                    </h2>
                    <div className="AllBooks-grid">
                        {sortedBooks.map((book) => (
                            <Card key={book.id} Book={book} onClick={() => onClick(book)} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Categories