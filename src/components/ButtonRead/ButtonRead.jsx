import '../ButtonRead/ButtonRead.scss'

function ButtonRead({text , children}) {
    return (
        <>
            <button data-label="Register" className="rainbow-hover">
                <span className="sp">{text || children}</span>
            </button>
        </>
    )
}

export default ButtonRead
