import Object from './Object'

function Room({ onObjectClick, keyFound, keyInInventory }) {
  return (
    <div className="room">
      <h2>Habitación</h2>
      <div className="room-content">
        {/* Jarrón - siempre visible */}
        <Object
          type="jarron"
          label="Jarrón"
          position={{ top: '60%', left: '30%' }}
          onClick={() => onObjectClick('jarron')}
        />

        {/* Llave - solo visible si se ha encontrado y no está en inventario */}
        {keyFound && !keyInInventory && (
          <Object
            type="llave"
            label="Llave"
            position={{ top: '55%', left: '35%' }}
            onClick={() => onObjectClick('llave')}
          />
        )}

        {/* Puerta - siempre visible */}
        <Object
          type="puerta"
          label="Puerta"
          position={{ top: '20%', left: '70%' }}
          onClick={() => onObjectClick('puerta')}
        />
      </div>
    </div>
  )
}

export default Room

