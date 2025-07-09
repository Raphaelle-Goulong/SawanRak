import '../Author/Author.scss'

// import Card from '../../components/Card/Card'

function Author() {
    return (
        <div className="Section-Author">
            <div className="Author">
                <div className="Title-Author">
                    <h2>Author</h2>
                </div>
                <div className="Author-card">
                    <Card /> <Card /> <Card />
                </div>
            </div>
        </div>
    )
}

export default Author
