import '../Book/Book.scss'

import Dropdown from '../../components/Dropdown/Dropdown'
import Button from '../../components/Button/Button'

import Ending from '../../components/Ending/Ending'

function Book() {
    return (
        <section className="Section-Book">
            <div className="Book">
                <div className="title-book">
                    <h2>Titre du livre</h2>
                </div>
                <div className="top-book">
                    <Dropdown />
                    <Button />
                </div>

                <div className="Text-Book">
                    <h2 className="title-chapitre">Chapitre 1 : Le commencement </h2>
                    <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vel, eius?
                        Officiis totam eligendi aut ad asperiores facilis minima atque error
                        quibusdam dolorum. Deserunt reprehenderit amet magnam veniam in voluptate
                        nesciunt.Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vel,
                        eius? Officiis totam eligendi aut ad asperiores facilis minima atque error
                        quibusdam dolorum. Deserunt reprehenderit amet magnam veniam in voluptate
                        nesciunt.Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vel,
                        eius? Officiis totam eligendi aut ad asperiores facilis minima atque error
                        quibusdam dolorum. Deserunt reprehenderit amet magnam veniam in voluptate
                        nesciunt.Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vel,
                        eius? Officiis totam eligendi aut ad asperiores facilis minima atque error
                        quibusdam dolorum. Deserunt reprehenderit amet magnam veniam in voluptate
                        nesciunt.Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vel,
                        eius? Officiis totam eligendi aut ad asperiores facilis minima atque error
                        quibusdam dolorum. Deserunt reprehenderit amet magnam veniam in voluptate
                        nesciunt.Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vel,
                        eius? Officiis totam eligendi aut ad asperiores facilis minima atque error
                        quibusdam dolorum. Deserunt reprehenderit amet magnam veniam in voluptate
                        nesciunt.Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vel,
                        eius? Officiis totam eligendi aut ad asperiores facilis minima atque error
                        quibusdam dolorum. Deserunt reprehenderit amet magnam veniam in voluptate
                        nesciunt.Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vel,
                        eius? Officiis totam eligendi aut ad asperiores facilis minima atque error
                        quibusdam dolorum. Deserunt reprehenderit amet magnam veniam in voluptate
                        nesciunt.Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vel,
                        eius? Officiis totam eligendi aut ad asperiores facilis minima atque error
                        quibusdam dolorum. Deserunt reprehenderit amet magnam veniam in voluptate
                        nesciunt.Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vel,
                        eius? Officiis totam eligendi aut ad asperiores facilis minima atque error
                        quibusdam dolorum. Deserunt reprehenderit amet magnam veniam in voluptate
                        nesciunt.Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vel,
                        eius? Officiis totam eligendi aut ad asperiores facilis minima atque error
                        quibusdam dolorum. Deserunt reprehenderit amet magnam veniam in voluptate
                        nesciunt.
                    </p>
                </div>
            </div>
            <div className="btn-next">
                <Button />
                <Button />
            </div>
            <Ending />
        </section>
    )
}

export default Book
