import '../Tags/Tags.scss';

function Tags({ text }) {
    if (!text) return null; // Ne rend rien si pas de texte

    return <span className="Tags Tags-Cat">{text}</span>;
}

export default Tags;