import '../Button/Button.scss';

function Button({ onClick, children,text}) {
    return (
        <div className="Btn" onClick={onClick}>
            <button 
                type="button" 
                className="btn"
                
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