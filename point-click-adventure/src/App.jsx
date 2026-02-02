import { useState } from 'react'
import Room from './components/Room'
import Inventory from './components/Inventory'
import MessageBox from './components/MessageBox'
import './styles.css'

function App() {
  // Estado del juego
  const [inventory, setInventory] = useState([])
  const [message, setMessage] = useState('Explora la habitación haciendo click en los objetos...')
  const [gameWon, setGameWon] = useState(false)
  const [keyFound, setKeyFound] = useState(false) // Si la llave está visible en la habitación
  const [keyInInventory, setKeyInInventory] = useState(false) // Si la llave está en el inventario

  // Manejar click en objetos
  const handleObjectClick = (objectType) => {
    if (gameWon) return

    switch (objectType) {
      case 'jarron':
        if (!keyFound) {
          setKeyFound(true)
          setMessage('¡Has encontrado una llave en el jarrón!')
        } else {
          setMessage('El jarrón está vacío.')
        }
        break

      case 'llave':
        if (keyFound && !keyInInventory) {
          setKeyInInventory(true)
          setInventory([...inventory, 'llave'])
          setMessage('Has conseguido una llave.')
        }
        break

      case 'puerta':
        if (keyInInventory) {
          setGameWon(true)
          setMessage('¡Felicidades! Has salido de la habitación. ¡Has ganado!')
        } else {
          setMessage('La puerta está cerrada. Necesitas una llave.')
        }
        break

      default:
        setMessage('No pasa nada...')
    }
  }

  return (
    <div className="game-container">
      <h1>Aventura Point & Click</h1>
      <div className="game-wrapper">
        <Room 
          onObjectClick={handleObjectClick}
          keyFound={keyFound}
          keyInInventory={keyInInventory}
        />
        <div className="ui-panel">
          <Inventory items={inventory} />
          <MessageBox message={message} />
        </div>
      </div>
    </div>
  )
}

export default App

