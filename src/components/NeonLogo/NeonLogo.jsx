import '../NeonLogo/NeonLogo.scss'

function NeonLogo({ as: Tag = 'span', text = 'GLandia', size = 'lg', className = '' }) {
    const classes = `neon-logo neon-logo--${size}${className ? ` ${className}` : ''}`

    return (
        <Tag className={classes}>
            {/* Lu par les lecteurs d'écran à la place des lettres séparées */}
            <span className="neon-logo__sr">{text}</span>

            <span className="neon-logo__letters" aria-hidden="true">
                {Array.from(text).map((letter, i) => (
                    <span key={i} className="neon-logo__letter">
                        {letter}
                    </span>
                ))}
            </span>
        </Tag>
    )
}

export default NeonLogo