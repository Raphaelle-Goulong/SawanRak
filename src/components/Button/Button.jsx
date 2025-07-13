import '../Button/Button.scss'

function Button() {
    return (
        <div className="Btn">
            <button type="button" className="btn">
                <strong>Commencer</strong>
                <div id="container-stars">
                    <div id="stars"></div>
                </div>

                <div id="glow">
                    <div className="circle"></div>
                    <div className="circle"></div>
                </div>
            </button>
        </div>
    )
}

export default Button
