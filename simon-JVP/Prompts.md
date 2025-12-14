Desarrolla el juego "Simon Says" (también conocido como "Simón Dice") completo y funcional usando HTML, CSS y JavaScript vanilla en un solo archivo HTML. El juego debe ser responsive y funcionar en navegadores modernos.

## Descripción del juego

Simon Says es un juego de memoria donde el jugador debe repetir secuencias de colores que van aumentando en longitud. El dispositivo muestra una secuencia de colores iluminándolos uno por uno, y el jugador debe reproducir esa misma secuencia en el orden correcto. Cada ronda exitosa añade un color más a la secuencia.

## Estructura visual

### Layout principal
- Contenedor centrado en la pantalla tanto vertical como horizontalmente
- Fondo oscuro para la página (por ejemplo: #1a1a2e)
- El tablero de Simon debe ser circular, dividido en 4 cuadrantes de colores

### Los 4 botones de colores
- Verde (arriba-izquierda): #00a74a, al iluminarse: #00ff6e
- Rojo (arriba-derecha): #9f0f17, al iluminarse: #ff4c4c
- Amarillo (abajo-izquierda): #cca707, al iluminarse: #ffff4c
- Azul (abajo-derecha): #094a8f, al iluminarse: #4c4cff

### Disposición de los botones
- Cada botón ocupa un cuadrante del círculo (90 grados cada uno)
- Separación pequeña entre botones (gap de 4-6px)
- El conjunto debe formar un círculo completo de aproximadamente 300-400px de diámetro
- Usar border-radius apropiados para que cada botón tenga forma de cuarto de círculo

### Panel de información (centrado sobre o debajo del tablero)
- Mostrar la puntuación actual (ronda actual)
- Mostrar el récord máximo de la sesión
- Botón de "Iniciar Juego" / "Reiniciar"
- Mensaje de estado: "Observa...", "Tu turno", "¡Correcto!", "¡Game Over!"

## Mecánicas del juego

### Flujo del juego
1. El jugador presiona "Iniciar Juego"
2. El juego genera un color aleatorio y lo añade a la secuencia
3. El juego reproduce la secuencia completa iluminando los colores uno por uno
4. El jugador debe repetir la secuencia haciendo clic en los colores
5. Si acierta toda la secuencia, se añade un nuevo color y se repite desde el paso 3
6. Si falla, se muestra "Game Over", se actualiza el récord si corresponde, y puede reiniciar

### Temporización
- Duración de iluminación de cada color: 400-500ms
- Pausa entre cada color de la secuencia: 200-300ms
- Pausa antes de mostrar la secuencia: 500ms
- Feedback visual al hacer clic: 200ms

### Sistema de puntuación
- La puntuación es igual al número de colores en la secuencia actual menos 1 (ronda completada)
- Guardar el récord máximo en localStorage para persistencia entre sesiones

## Efectos visuales y de audio

### Efectos visuales
- Al iluminarse un botón, cambiar a su color brillante
- Añadir un efecto de brillo/glow con box-shadow cuando se ilumina
- Transiciones suaves (transition: all 0.1s ease)
- Efecto hover sutil en los botones cuando es el turno del jugador
- Los botones deben verse "presionables" (cursor: pointer)
- Durante la reproducción de la secuencia, deshabilitar los clics del jugador
- Efecto visual de error cuando el jugador falla (parpadeo rojo o shake)

### Efectos de audio (usar Web Audio API)
- Cada color debe tener un tono diferente:
  - Verde: 329.63 Hz (Mi4)
  - Rojo: 261.63 Hz (Do4)
  - Amarillo: 392.00 Hz (Sol4)
  - Azul: 220.00 Hz (La3)
- Duración del tono: igual a la duración de la iluminación
- Sonido de error diferente cuando el jugador falla (tono grave o disonante)
- Forma de onda: "sine" o "square" para sonido retro

## Estados del juego

Implementar una máquina de estados con los siguientes estados:
1. **idle**: Esperando que el jugador inicie el juego
2. **playingSequence**: El juego está mostrando la secuencia
3. **playerTurn**: El jugador está introduciendo la secuencia
4. **gameOver**: El jugador falló, mostrando resultado

## Controles e interacción

- Click/touch en los botones de colores para seleccionarlos
- Botón para iniciar/reiniciar el juego
- Los botones de colores solo responden durante el turno del jugador
- Feedback visual inmediato al presionar un botón

## Responsive design

- En pantallas pequeñas (< 500px), reducir el tamaño del tablero proporcionalmente
- Usar unidades relativas (vmin, %, etc.) donde sea apropiado
- El juego debe ser jugable tanto con mouse como con touch
- Mínimo 44px de área táctil para dispositivos móviles

## Estructura del código

### HTML
- Contenedor principal del juego
- Div para el tablero con los 4 botones
- Panel de información con puntuación, récord, estado y botón de inicio
- Estructura semántica y accesible

### CSS
- Variables CSS para los colores (facilita mantenimiento)
- Flexbox o Grid para el layout
- Animaciones con @keyframes para efectos especiales
- Media queries para responsive

### JavaScript
- Clase o módulo GameController que maneje toda la lógica
- Variables para: secuencia actual, índice del jugador, puntuación, récord, estado
- Funciones separadas para:
  - `startGame()`: Inicializa/reinicia el juego
  - `addToSequence()`: Añade un color aleatorio a la secuencia
  - `playSequence()`: Reproduce la secuencia visualmente
  - `highlightButton(color)`: Ilumina un botón específico
  - `playSound(color)`: Reproduce el tono del color
  - `handlePlayerInput(color)`: Procesa el clic del jugador
  - `checkInput()`: Verifica si la entrada es correcta
  - `gameOver()`: Maneja el fin del juego
  - `updateDisplay()`: Actualiza la interfaz
- Event listeners para los botones
- Usar async/await o Promises para manejar las secuencias temporales

## Requisitos técnicos

- Todo en un solo archivo HTML (estilos en `<style>`, scripts en `<script>`)
- Sin dependencias externas ni librerías
- Compatible con Chrome, Firefox, Safari y Edge modernos
- Código limpio, comentado y bien organizado
- Nombres de variables y funciones descriptivos en inglés
- El juego debe funcionar inmediatamente al abrir el archivo
- Modo de dificultad: fácil (velocidad lenta), normal, difícil (velocidad rápida)
- Animación de celebración al superar el récord
- Modo estricto: si fallas, la secuencia se reinicia completamente (no solo pierdes)
- Contador de racha actual visible