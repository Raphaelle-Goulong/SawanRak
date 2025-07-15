import '../Tags/Tags.scss';

function Tags({ text }) {
    if (!text) return null; // Ne rend rien si pas de texte
    
    return (
        <span className="Tags">
            <h4 className="Tags-Cat">{text}</h4>
        </span>
    );
}

export default Tags;
