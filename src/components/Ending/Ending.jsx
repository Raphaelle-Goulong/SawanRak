import '../Ending/Ending.scss'

import Card from '../../components/Card/Card'
import Button from '../../components/Button/Button'

import { Star, X, Frown } from 'lucide-react'

function Ending() {
    return (
        <section className="Section-Ending">
            <X className="cross" size={20} />
            <h2>Tu es arrivée à la fin du livre</h2>
            <Frown /><Frown /><Frown />
            {/* <div className="Note">
                <div className="title">
                    <h3>N'oublie pas de noter</h3>
                </div>
                <div className="star">
                    <Star />
                    <Star />
                    <Star />
                    <Star />
                    <Star />
                </div>
            </div> */}
            <div className="other-books">
                <div className="title">
                    <h3>Livre qui pourrait te plaire</h3>
                </div>
                <div className="book-cat">
                    <Card />
                    <Card />
                    <Card />
                </div>
            </div>
            <div className="btn-quit">
                <Button />
            </div>
        </section>
    )
}

export default Ending
