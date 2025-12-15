// Reusable loading button component

const LoadingButton = ({ 
  children, 
  loading, 
  disabled, 
  className = '', 
  onClick,
  type = 'button',
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`${className} ${loading ? 'btn-loading' : ''}`}
      disabled={loading || disabled}
      onClick={onClick}
      {...props}
    >
      {loading ? 'Carregando...' : children}
    </button>
  );
};

export default LoadingButton;

