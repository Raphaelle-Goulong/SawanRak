import '../Carrousel/Carrousel.scss'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import Card from '../Card/Card'

function Carrousel() {
    return (
        <div className="Carrousel">
            <div className="Title-carrousel">
                <h2> Comédie</h2>
            </div>

            <div className="Cards-carrousel">
                <ChevronLeft id="arrow-left" size={28} />
                <Card /> <Card />
                <Card />
                <ChevronRight id="arrow-right" size={28} />
            </div>
        </div>
    )
}

export default Carrousel
