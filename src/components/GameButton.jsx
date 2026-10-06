// Tombol besar ramah anak. Selalu punya label teks / aria-label.
export function GameButton({ icon, children, onClick, variant = 'primary', size = 'lg', label, className = '', ...rest }) {
  return (
    <button
      type="button"
      className={`gbtn gbtn-${variant} gbtn-${size} ${className}`}
      onClick={onClick}
      aria-label={label || (typeof children === 'string' ? children : undefined)}
      {...rest}
    >
      {icon && <span className="gbtn-icon" aria-hidden>{icon}</span>}
      {children && <span className="gbtn-text">{children}</span>}
    </button>
  );
}
