import '../ButtonRead/ButtonRead.scss';

function ButtonRead({ text, children, onClick, type = "button" }) {
    return (
        <button 
            type={type} 
            className="rainbow-hover" 
            onClick={onClick}
        >
            <span className="sp">{text || children}</span>
        </button>
    );
}

export default ButtonRead;