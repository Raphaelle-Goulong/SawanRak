import '../Button/Button.scss';

function Button({ onClick, children, disabled = false ,text}) {
    return (
        <div className="Btn" onClick={!disabled ? onClick : undefined}>
            <button 
                type="button" 
                className={`btn ${disabled ? 'disabled' : ''}`}
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