import Button from '../Button/Button';

function ButtonRead({ text, children, onClick, type = 'button', ...rest }) {
    return (
        <Button variant="primary" size="sm" type={type} onClick={onClick} {...rest}>
            {text || children}
        </Button>
    );
}

export default ButtonRead;