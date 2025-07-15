import { useState } from 'react';
import '../Resume/Resume.scss'

import Card from '../../components/Card/Card'
import Tags from '../Tags/Tags'
import Button from '../Button/Button'

import { X } from 'lucide-react'

function Resume({ book, onClose }) {

const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) {
        return null; // Ne rend rien si le composant doit être caché
    }



    return (
        <section className="Section-Resume">
            <div className="Top-resume">
                <h2>{book.title}</h2>
                <X className="cross" size={20} onClick={handleClose}/>
            </div>
            <div className="Resume">
                <div className="text-resume">
                    <h3 id="title-resume">Résume</h3>

                    <p id='resume-book'>
                        {book.description}
                    </p>
                </div>
                <div className="Resume-img">
                    <Card Book={book} onClick={undefined}/> 
                    <p>Chp : {book.chapters}</p>
                </div> 
                 <div className="Categorie">
                  
                     {(Array.isArray(book.categorie) 
                    ? book.categorie 
                    : [book.categorie].filter(Boolean)
                ).map((category, index) => (
                    <Tags key={index} text={category} />
                ))}
                  
                        
                    </div>
                <div className="chapter-available">
                    <div className="last-chapter">
                        <h4 id='last-chap'>Dernier chapitre lu : </h4>
                        <Tags text={`Chapitre ${book.lastChapter || 1}`}/>
                    </div>
                   
                    <div className="all-chapter">
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
