export const Card = ({ children, className = "" }) => {
    return <div className={`glass-card p-6 rounded-lg smooth-transition hover:shadow-lg ${className}`}>{children}</div>
  }  