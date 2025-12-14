function Object({ type, label, position, onClick }) {
  return (
    <div
      className={`game-object object-${type}`}
      style={position}
      onClick={onClick}
      title={label}
    >
      <div className="object-sprite"></div>
      <span className="object-label">{label}</span>
    </div>
  )
}

export default Object

