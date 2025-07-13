import '../Resume/Resume.scss'

import Card from '../../components/Card/Card'
import Tags from '../Tags/Tags'
import Button from '../Button/Button'

import { X } from 'lucide-react'

function Resume() {
    return (
        <section className="Section-Resume">
            <div className="Top-resume">
                <h2>Titre du livre</h2>
                <X className="cross" size={20} />
            </div>
            <div className="Resume">
                <div className="text-resume">
                    <h3 id="title-resume">Résume</h3>

                    <p id='resume-book'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, nihil
                        exercitationem nisi ut tempore eaque aut aliquam doloremque quisquam ullam.
                        Necessitatibus qui dolor culpa provident quasi porro quia facere iste.
                    </p>
                </div>
                <div className="Resume-img">
                    <Card />
                    <p>Chp : 24</p>
                </div> 
                 <div className="Categorie">
                  
                        <Tags />
                        <Tags />
                        <Tags />
                        
                    </div>
                <div className="chapter-available">
                    <div className="last-chapter">
                        <h4 id='last-chap'>Dernier chapitre lu : </h4><Tags />
                    </div>
                   
                    <div className="all-chapter">
                        <Tags />
                        <Tags />
                        <Tags />
                        <Tags />
                        <Tags />
                        <Tags />
                        <Tags />
                        <Tags />
                        <Tags />
                       
                    </div>
                </div>
            </div>
            <div className='Btn-start'>
               <Button />
            </div>
            
        </section>
    )
}

export default Resume
