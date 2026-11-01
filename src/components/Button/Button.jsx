import '../Button/Button.scss';

function Button({ onClick, children, text, disabled }) {  
    
    return (
        <div 
            className="Btn" 
            onClick={disabled ? null : onClick}  
            style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}  
        >
            <button 
                type="button" 
                className="btn"
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
        </div>
    );
}

export default Button;