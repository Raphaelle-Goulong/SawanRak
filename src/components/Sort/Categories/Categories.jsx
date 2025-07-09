import '../Categories/Categories.scss'

import Card from '../../Card/Card'

function Categories() {
    return (
        <div className="Section-Categories">
            <div className="Categories">
                <div className="Title-Categories">
                    <h2>Author</h2>
                </div>

                <div className="Categories-card">
                    <Card /> <Card /> <Card />
                    <Card />
                </div>
            </div>
        </div>
    )
}

export default Categories
