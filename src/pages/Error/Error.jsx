import '../Error/Error.scss'
import '../Error/_Animation.scss'
// Importation du composant Link depuis react-router-dom pour créer un lien vers la page d'accueil
import { Link } from 'react-router-dom'

function Error() {
    return (
        <>
            <div className="container-error">
                {/* Titre de l'erreur */}
                <div className="section-Title-error bounce-in-right">
                    <h2 className="loading hinge">4</h2>
                    <h2 className="loading">0</h2>
                    <h2 className="loading">4</h2>
                </div>
                {/* Message d'erreur */}
                <p className="Text-error gradient bounce-in-right">
                    Oups! La page que vous demandez n'existe pas.
                </p>
                {/* Lien pour retourner à la page d'accueil */}

                <Link to="/" className="Link-error  bounce-in-right ">
                    Retourner sur la page d’accueil
                </Link>
            </div>
        </>
    )
}

export default Error
