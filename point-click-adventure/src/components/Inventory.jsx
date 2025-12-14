function Inventory({ items }) {
  return (
    <div className="inventory">
      <h3>Inventario</h3>
      <div className="inventory-items">
        {items.length === 0 ? (
          <p className="empty-inventory">Vacío</p>
        ) : (
          items.map((item, index) => (
            <div key={index} className="inventory-item">
              <div className={`item-sprite item-${item}`}></div>
              <span className="item-name">{item}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Inventory

