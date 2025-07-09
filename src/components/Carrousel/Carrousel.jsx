import '../Carrousel/Carrousel.scss'


import { ArrowLeft, ArrowRight } from 'lucide-react';



import Card from '../Card/Card'

function Carrousel() {
    return (
        <div className="Carrousel">
            <div className="Title-carrousel">
               
                <h2> Comédie</h2>
            </div>

            <div className="Cards-carrousel">
               <ArrowLeft id='arrow-left' size={32}/>
                <Card /> <Card />
                <Card />
                <ArrowRight id='arrow-right' size={32}/>
            </div>
        </div>
    )
}

export default Carrousel
