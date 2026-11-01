import React, { createContext, useContext, useState, useCallback } from 'react'
import mammoth from 'mammoth'

const BooksContext = createContext()

export const useBooksContext = () => {
    const context = useContext(BooksContext)
    if (!context) {
        throw new Error('useBooksContext must be used within a BooksProvider')
    }
    return context
}

const convertToJsonStructure = (content) => {
    const lines = content.split('\n')
    const chapters = []
    let currentChapter = { title: '', content: '' }

    for (const line of lines) {
        const trimmed = line.trim()
        if (
            trimmed.match(/^(chapitre|chapter)\s+[0-9ivx]+/i) ||
            trimmed.match(/^(prologue|épilogue|introduction|conclusion)/i)
        ) {
            if (currentChapter.title || currentChapter.content) {
                chapters.push(currentChapter)
            }
            currentChapter = { title: trimmed, content: '' }
        } else {
            currentChapter.content += (currentChapter.content ? '\n\n' : '') + trimmed
        }
    }

    if (currentChapter.title || currentChapter.content) {
        chapters.push(currentChapter)
    }

    return chapters
}

export const BooksProvider = ({ children }) => {
    const [booksChapters, setBooksChapters] = useState({})
    const [loadingBooks, setLoadingBooks] = useState({})

    const loadBookChapters = useCallback(
        async (book) => {
            if (booksChapters[book.id]) return booksChapters[book.id]
            if (loadingBooks[book.id]) {
                return new Promise((resolve) => {
                    const checkLoaded = () => {
                        if (booksChapters[book.id]) resolve(booksChapters[book.id])
                        else setTimeout(checkLoaded, 100)
                    }
                    checkLoaded()
                })
            }

            if (!book.url) return []

            setLoadingBooks((prev) => ({ ...prev, [book.id]: true }))

            try {
                // 1. Charger le fichier Word original
                const response = await fetch(book.url)
                const arrayBuffer = await response.arrayBuffer()
                const result = await mammoth.extractRawText({ arrayBuffer })
                const extractedChapters = convertToJsonStructure(result.value)

                // 2. Récupérer les corrections depuis l'API (MODIFIÉ ICI)
                let corrections = {}
                try {
                    const corsRes = await fetch('/api/corrections') // <-- CHEMIN RELATIF
                    if (corsRes.ok) {
                        const allCorrections = await corsRes.json()
                        corrections = allCorrections[book.id] || {}
                    }
                } catch (e) {
                    console.warn('Impossible de charger les corrections', e)
                }

                // 3. Appliquer les corrections sur les chapitres extraits
                const finalChapters = extractedChapters.map((chap, index) => {
                    if (corrections[index]) {
                        return { ...chap, content: corrections[index] }
                    }
                    return chap
                })

                setBooksChapters((prev) => ({ ...prev, [book.id]: finalChapters }))
                setLoadingBooks((prev) => ({ ...prev, [book.id]: false }))

                return finalChapters
            } catch (error) {
                console.error('Erreur lors du chargement des chapitres:', error)
                setLoadingBooks((prev) => ({ ...prev, [book.id]: false }))
                return []
            }
        },
        [booksChapters, loadingBooks]
    )

    const getBookChapters = (bookId) => booksChapters[bookId] || null
    const isLoadingBook = (bookId) => loadingBooks[bookId] || false

    // Nouvelle fonction pour sauvegarder une correction (MODIFIÉ ICI)
    const saveChapterCorrection = async (bookId, chapterIndex, newContent) => {
        try {
            const res = await fetch('/api/corrections', {
                // <-- CHEMIN RELATIF
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId, chapterIndex, newContent })
            })
            if (!res.ok) throw new Error('Erreur réseau')

            // Mettre à jour le cache local
            setBooksChapters((prev) => {
                const bookChaps = [...(prev[bookId] || [])]
                if (bookChaps[chapterIndex]) {
                    bookChaps[chapterIndex] = { ...bookChaps[chapterIndex], content: newContent }
                }
                return { ...prev, [bookId]: bookChaps }
            })
            return true
        } catch (err) {
            console.error('Erreur de sauvegarde', err)
            return false
        }
    }

    const value = {
        loadBookChapters,
        getBookChapters,
        isLoadingBook,
        booksChapters,
        saveChapterCorrection
    }

    return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>
}
