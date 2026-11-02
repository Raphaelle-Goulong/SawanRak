import { useEffect, useState } from 'react'

let cachedBooks = null
let pending = null

const fetchLivres = () => {
    if (!pending) {
        pending = fetch('/api/livres')
            .then((response) => {
                if (!response.ok) throw new Error('Erreur réseau')
                return response.json()
            })
            .then((json) => {
                cachedBooks = json.livres || json
                return cachedBooks
            })
            .catch((error) => {
                pending = null // permet de réessayer plus tard
                throw error
            })
    }
    return pending
}

function useLivres() {
    const [books, setBooks] = useState(cachedBooks || [])
    const [status, setStatus] = useState(cachedBooks ? 'ready' : 'loading') // 'loading' | 'ready' | 'error'

    useEffect(() => {
        if (cachedBooks) {
            setBooks(cachedBooks)
            setStatus('ready')
            return undefined
        }

        let active = true
        fetchLivres()
            .then((list) => {
                if (!active) return
                setBooks(list)
                setStatus('ready')
            })
            .catch((error) => {
                console.error('Erreur de chargement des livres:', error)
                if (active) setStatus('error')
            })

        return () => {
            active = false
        }
    }, [])

    return { books, status, isLoading: status === 'loading' }
}

export default useLivres