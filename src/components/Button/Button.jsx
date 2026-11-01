import '../Button/Button.scss';

function Button({ onClick, children, text, disabled }) {  
    return (
        <button 
            type="button" 
            className="btn"
            onClick={onClick}
            disabled={disabled}  
        >
            <strong>{text || children}</strong>
            
            <div id="container-stars">
                <div id="stars"></div>
            </div>
            
            <div id="glow">
                <div className="circle"></div>
                <div className="circle"></div>
            </div>
        </button>
    );
}

export default Button;