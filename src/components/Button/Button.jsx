import '../Button/Button.scss'

function Button() {
    return (
        <div className="Btn">
            <button type="button" class="btn">
                <strong>Commencer</strong>
                <div id="container-stars">
                    <div id="stars"></div>
                </div>

                <div id="glow">
                    <div class="circle"></div>
                    <div class="circle"></div>
                </div>
            </button>
        </div>
    )
}

export default Button
