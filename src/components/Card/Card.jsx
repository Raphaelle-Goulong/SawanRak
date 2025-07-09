import '../Card/Card.scss'


import monImage  from '../Card/download.jpg'

function Card() {
    return (
        <div className="Card">
            <div className='Img-books'>
                <img src={monImage} alt="" />
            </div>
            <div className='Title-books'>
                <h3>Titre du livre</h3>
            </div>
        </div>
    )
}

export default Card
