import '../Footer/Footer.scss'

function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="Footer-section">
            <p className="title-footer">© {year} Glandia · Tous droits réservés.</p>
        </footer>
    )
}

export default Footer