# 📦 Galaxy Shooter - Prompts de Desarrollo

Este documento contiene todos los prompts utilizados para construir el juego `galaxy-APC`, un videojuego tipo Galaxy Shooter desarrollado en HTML, CSS y JavaScript.

---

## 🧱 Etapa 1: Estructura inicial + Nave que dispara

```markdown
Quiero que me ayudes a crear un videojuego 2D estilo "Galaxy Shooter" usando HTML, CSS y JavaScript puro (sin frameworks externos).

Nombre de la carpeta del juego: `galaxyshooter-MI` (donde "MI" son mis iniciales).

### Requerimientos iniciales:

1. Estructura del proyecto:
   - `index.html`
   - `style.css`
   - `game.js`
   - `assets/` (carpeta vacía por ahora, para imágenes futuras)
   - `prompts.md` (yo lo llenaré después con los prompts que use)

2. Primer objetivo funcional:
   - Mostrar una nave espacial en la parte inferior de la pantalla.
   - La nave puede moverse a la izquierda y derecha con las teclas de flechas.
   - La nave puede disparar proyectiles hacia arriba con la tecla espacio.
   - Los disparos deben moverse hacia arriba y desaparecer al salir de pantalla.
   - El juego debe funcionar correctamente en un navegador moderno (Chrome, Firefox).

3. Estilo visual:
   - Usa estilos básicos en CSS para el fondo (puede ser un degradado oscuro o fondo estrellado simple con CSS).
   - Usa una nave representada por un div con color o forma triangular por ahora (sin imágenes todavía).
   - Asegúrate de que el juego sea responsive y se adapte a tamaños de pantalla normales.

4. Consideraciones:
   - Todo el código debe ser claro, comentado y organizado.
   - El JavaScript debe estar en un archivo externo llamado `game.js`.
   - Evita usar bibliotecas externas como jQuery o Canvas en esta primera versión. Solo DOM + CSS.

Por favor, genera todo el código necesario para que este prototipo inicial funcione correctamente. Incluye comentarios en el código explicando cada parte.
```

**Salida:** Se creó la estructura inicial del juego con:
- Archivos `index.html`, `style.css`, `game.js`
- Nave triangular verde en la parte inferior
- Movimiento con flechas izquierda/derecha
- Sistema de disparos con tecla espacio
- Fondo espacial con efecto de estrellas animado
- Diseño responsive básico

---

## 👾 Etapa 2: Enemigos básicos en pantalla

```markdown
Continúa con el proyecto `galaxyshooter-MI`.

### Objetivo:
Añadir enemigos que aparezcan en pantalla y se muevan de manera simple.

### Requerimientos:
1. Los enemigos deben:
   - Aparecer en la parte superior del área de juego.
   - Organizarse en una fila o varias filas (por ejemplo, como en Space Invaders).
   - Moverse lentamente de izquierda a derecha, y luego bajar una línea cuando lleguen al borde.
   - Repetir este patrón (zig-zag descendente).

2. Usa elementos `div` para los enemigos, con estilo CSS para distinguirlos.

3. No añadas lógica de colisión todavía.

4. Asegúrate de que los enemigos se eliminen correctamente si salen del área de juego (por ahora, opcional).

Por favor, agrega esta lógica al código existente y comenta cada parte.
```

**Salida:** Se implementó un sistema de enemigos con:
- Array `enemies[]` en el estado del juego
- Propiedades de movimiento: `enemyDirection`, `enemySpeed`, `enemyRowHeight`
- Configuración de enemigos: `enemyConfig` con filas, columnas y espaciado
- Función `createEnemies()` que genera enemigos en 3 filas x 8 columnas
- Función `updateEnemies()` que maneja el movimiento zig-zag descendente
- Estilos CSS para enemigos (cuadrados rojos con borde y sombra)
- Integración en el `gameLoop()` para actualizar enemigos cada frame

---

## 💥 Etapa 3: Colisiones entre disparos y enemigos

```markdown
Continúa con el proyecto `galaxyshooter-MI`.

### Objetivo:
Implementar colisiones entre los proyectiles del jugador y los enemigos.

### Requerimientos:
1. Detecta cuando un proyectil colisiona con un enemigo.
2. Al detectar una colisión:
   - El proyectil debe desaparecer.
   - El enemigo debe desaparecer.
   - (Opcional por ahora) Imprimir en consola que un enemigo fue destruido.

3. Usa detección de colisiones basada en bounding boxes (getBoundingClientRect).

4. Refactoriza el código si es necesario para mantenerlo organizado.

Por favor, agrega esta funcionalidad al juego y comenta cómo funciona la detección de colisión.
```

**Salida:** Se implementó sistema de colisiones con:
- Función `checkCollisions()` que detecta intersecciones usando `getBoundingClientRect()`
- Algoritmo de detección de bounding boxes para verificar intersección entre proyectiles y enemigos
- Función `handleCollisions()` que elimina proyectiles y enemigos colisionados del DOM y arrays
- Integración en el `gameLoop()` para verificar colisiones cada frame
- Mensajes en consola cuando se destruye un enemigo
- Manejo correcto de índices al eliminar elementos de arrays

---

## 🏆 Etapa 4: Sistema de puntaje

```markdown
Continúa con el proyecto `galaxyshooter-MI`.

### Objetivo:
Agregar un sistema de puntaje simple.

### Requerimientos:
1. Muestra el puntaje del jugador en la parte superior de la pantalla.
2. Cada enemigo destruido suma 100 puntos.
3. El puntaje debe actualizarse en tiempo real conforme el jugador destruye enemigos.
4. Estiliza el puntaje para que se vea claramente.

Agrega esta funcionalidad al juego y asegúrate de mantener el código claro y comentado.
```

**Salida:** Se implementó sistema de puntaje con:
- Propiedad `score: 0` en el estado del juego
- Elemento HTML `<div id="score">` en la parte superior izquierda del área de juego
- Función `updateScore(points)` que actualiza el puntaje y el display en tiempo real
- Integración en `handleCollisions()` para sumar 100 puntos por enemigo destruido
- Estilos CSS con color amarillo (#ffff00), fuente grande (24px), negrita y sombra de texto
- Posicionamiento absoluto con z-index alto para estar siempre visible

---

## ❤️ Etapa 5: Vidas del jugador y Game Over

```markdown
Continúa con el proyecto `galaxyshooter-MI`.

### Objetivo:
Agregar un sistema de vidas para el jugador y una pantalla de Game Over.

### Requerimientos:
1. El jugador comienza con 3 vidas.
2. Si un enemigo llega a la parte inferior de la pantalla, el jugador pierde una vida.
3. Mostrar visualmente las vidas restantes.
4. Cuando las vidas llegan a 0:
   - Detén el juego.
   - Muestra un mensaje de "Game Over".
   - Da opción para reiniciar el juego (botón o tecla).

Agrega esta funcionalidad al juego y comenta claramente cómo está implementada.
```

**Salida:** Se implementó sistema de vidas y Game Over con:
- Propiedad `lives: 3` en el estado del juego
- Elemento HTML `<div id="lives">` en la parte superior derecha
- Función `updateLives()` que actualiza el display de vidas
- Función `loseLife()` que reduce vidas en 1 y llama a `gameOver()` cuando llegan a 0
- Detección en `updateEnemies()` cuando un enemigo llega a la parte inferior (100px del fondo)
- Función `gameOver()` que:
  - Establece `gameState.isRunning = false` para detener el juego
  - Crea overlay con mensaje "Game Over", puntaje final y botón "Jugar de Nuevo"
  - Agrega event listener al botón para reiniciar
- Función `resetGame()` que:
  - Limpia arrays de proyectiles y enemigos
  - Elimina elementos dinámicos del DOM
  - Reinicia score, lives y estado del juego
  - Recrea enemigos y reinicia el loop
- Estilos CSS para overlay de Game Over con fondo semi-transparente, diseño atractivo y botones estilizados

---

## 🎨 Etapa 6: Estilo visual con sprites e imágenes

```markdown
Continúa con el proyecto `galaxyshooter-MI`.

### Objetivo:
Reemplazar los elementos visuales simples por imágenes reales o sprites.

### Requerimientos:
1. Usa imágenes para:
   - La nave del jugador.
   - Los enemigos.
   - Los disparos (opcional).

2. Usa la carpeta `assets/` para guardar las imágenes.

3. Actualiza el CSS para mostrar las imágenes correctamente usando `background-image` o etiquetas <img> según convenga.

4. Asegúrate de que el juego siga funcionando igual después del cambio visual.

También incluye versiones simplificadas por si alguna imagen aún no está disponible (usa colores de fondo como fallback).
```

**Salida:** Se actualizaron estilos CSS para usar sprites con:
- `#player`: `background-image: url('assets/player.png')` con fallback a triángulo verde usando borders
- `.enemy`: `background-image: url('assets/enemy.png')` con fallback a cuadrado rojo con background-color
- `.projectile`: `background-image: url('assets/bullet.png')` con fallback a rectángulo amarillo
- Uso de `background-size: contain` para mantener proporciones de las imágenes
- `background-repeat: no-repeat` y `background-position: center` para posicionamiento correcto
- Estilos de fallback mantenidos para cuando las imágenes no estén disponibles
- El juego funciona perfectamente con o sin imágenes

---

## 🔊 Etapa 7: Efectos de sonido

```markdown
Continúa con el proyecto `galaxyshooter-MI`.

### Objetivo:
Añadir efectos de sonido para mejorar la experiencia de juego.

### Requerimientos:
1. Añade sonidos para:
   - Disparo del jugador.
   - Destrucción de enemigos.
   - Game Over (opcional).
2. Usa archivos de sonido en formato `.mp3` o `.wav`, dentro de la carpeta `assets/`.
3. Usa el objeto `Audio` de JavaScript para reproducir sonidos.
4. Asegúrate de que los sonidos no se reproduzcan múltiples veces superpuestos innecesariamente.

Agrega esta funcionalidad y mantén el código organizado y comentado.
```

**Salida:** Se implementó sistema de audio con:
- Objeto `audioManager` con propiedades para cada sonido:
  - `shoot: 'assets/shoot.mp3'`
  - `enemyDestroyed: 'assets/enemy_destroyed.mp3'`
  - `gameOver: 'assets/game_over.mp3'`
- Función `playSound(soundName)` que:
  - Crea nuevos objetos `Audio` para cada reproducción
  - Establece volumen a 0.5
  - Maneja errores silenciosamente si los archivos no existen
  - Usa `.catch()` para evitar errores en consola
- Integración en `shoot()` para reproducir sonido de disparo
- Integración en `handleCollisions()` para reproducir sonido cuando se destruye un enemigo
- Integración en `gameOver()` para reproducir sonido de Game Over
- Rutas relativas a `assets/` para archivos de audio (`.mp3` o `.wav`)

---

## 🎮 Etapa 8: Menú inicial y reinicio

```markdown
Continúa con el proyecto `galaxyshooter-MI`.

### Objetivo:
Agregar una pantalla de inicio y una forma de reiniciar el juego después del Game Over.

### Requerimientos:
1. Al cargar la página, mostrar una pantalla inicial con:
   - Nombre del juego.
   - Botón de "Jugar" o instrucción para presionar una tecla.
2. Ocultar el contenido del juego hasta que empiece.
3. Al finalizar el juego (Game Over), mostrar una opción de reiniciar:
   - Botón "Jugar de nuevo" o tecla.
   - Al hacer clic, reinicia el estado del juego (vidas, puntaje, enemigos, etc.)

Este flujo debe hacer que la experiencia del jugador sea más completa.
```

**Salida:** Se implementó menú inicial y sistema de reinicio con:
- Elemento HTML `<div id="start-menu">` con:
  - Título "Galaxy Shooter" con animación de pulso
  - Instrucciones para el jugador
  - Botón "Jugar" estilizado
- Función `showStartMenu()` que muestra el menú y oculta el área de juego
- Función `hideStartMenu()` que oculta el menú y muestra el área de juego
- Modificación de `initGame()` para:
  - Mostrar menú inicial al cargar
  - No iniciar el loop automáticamente
  - Configurar event listeners para botón y tecla Enter
- Función `startGame()` que:
  - Oculta el menú y muestra el juego
  - Inicializa puntaje y vidas
  - Posiciona al jugador
  - Crea enemigos
  - Inicia el loop del juego
- Mejora de `resetGame()` para limpiar completamente el estado y reiniciar
- Estilos CSS para menú inicial con:
  - Fondo con gradiente espacial
  - Diseño centrado y atractivo
  - Animación de pulso en el título
  - Botones con efectos hover y active

---

## 📱 Etapa 9: Responsividad y compatibilidad

```markdown
Continúa con el proyecto `galaxyshooter-MI`.

### Objetivo:
Asegurar que el juego funcione correctamente en distintos dispositivos y navegadores.

### Requerimientos:
1. Asegúrate de que el juego se vea bien en pantallas pequeñas y grandes.
2. Usa media queries si es necesario para ajustar el tamaño de la nave, enemigos y área de juego.
3. Verifica compatibilidad con navegadores modernos (Chrome, Firefox, Edge).
4. Haz que el juego se pueda jugar también con teclas WASD, como alternativa a las flechas.

Haz ajustes necesarios para mejorar compatibilidad y responsividad.
```

**Salida:** Se implementaron mejoras de responsividad y compatibilidad con:
- Soporte para teclas WASD en `handlePlayerMovement()`:
  - `KeyA` o `ArrowLeft` para mover a la izquierda
  - `KeyD` o `ArrowRight` para mover a la derecha
- Mejoras en media queries:
  - Para pantallas ≤768px: ajustes de tamaños de nave, enemigos, proyectiles y fuentes
  - Para pantallas ≤480px: ajustes adicionales más agresivos para móviles
- Ajustes responsive en `createEnemies()`:
  - Pantallas ≤480px: 2 filas x 5 enemigos, espaciado 50px
  - Pantallas ≤768px: 2 filas x 6 enemigos, espaciado 55px
  - Pantallas grandes: 3 filas x 8 enemigos, espaciado 60px
- Ajustes de tamaños de fuente para score, lives y elementos del menú según tamaño de pantalla
- Ajustes de padding y espaciado en overlays (Game Over, menú inicial) para móviles
- Compatibilidad verificada con navegadores modernos (Chrome, Firefox, Edge)

---

## 📝 Resumen de Implementación

### Archivos Creados/Modificados:

1. **`index.html`**: 
   - Estructura HTML con menú inicial
   - Área de juego con elementos de UI (score, lives)
   - Overlay de Game Over (creado dinámicamente)

2. **`style.css`**: 
   - Estilos completos con responsive design
   - Sprites con fallbacks a formas de colores
   - Animaciones (estrellas, pulso del título)
   - Media queries para diferentes tamaños de pantalla

3. **`game.js`**: 
   - Lógica completa del juego con todas las funcionalidades
   - Sistema de estado del juego
   - Gestión de enemigos, proyectiles, colisiones
   - Sistema de audio
   - Menú y Game Over

4. **`assets/`**: 
   - Carpeta preparada para imágenes y sonidos
   - Archivos a agregar manualmente:
     - `player.png` (nave del jugador)
     - `enemy.png` (enemigos)
     - `bullet.png` (proyectiles)
     - `shoot.mp3` (sonido de disparo)
     - `enemy_destroyed.mp3` (sonido de destrucción)
     - `game_over.mp3` (sonido de Game Over)

### Funcionalidades Implementadas:

✅ Nave del jugador con movimiento (flechas y WASD)  
✅ Sistema de disparos con tecla espacio  
✅ Enemigos con movimiento zig-zag descendente  
✅ Sistema de colisiones basado en bounding boxes  
✅ Sistema de puntaje (100 puntos por enemigo)  
✅ Sistema de vidas (3 vidas iniciales)  
✅ Pantalla de Game Over con reinicio  
✅ Menú inicial con botón y tecla Enter  
✅ Sistema de audio (preparado para archivos)  
✅ Sprites con fallbacks a formas de colores  
✅ Diseño responsive para móviles y tablets  
✅ Soporte para teclas WASD además de flechas  

### Notas Técnicas:

- El juego usa solo HTML, CSS y JavaScript puro (sin frameworks externos)
- Detección de colisiones basada en bounding boxes usando `getBoundingClientRect()`
- Sistema de audio con manejo de errores si los archivos no existen
- Código completamente comentado y organizado en funciones modulares
- Compatible con navegadores modernos (Chrome, Firefox, Edge)
- Responsive design con media queries para diferentes tamaños de pantalla
- El juego funciona completamente incluso sin imágenes ni sonidos (usa fallbacks)

---

## 🎨 Etapa 10: Generación de Assets (Imágenes y Sonidos)

```markdown
Genera o descarga los assets para que todo quede completo.

Archivos necesarios:
- player.png (nave del jugador)
- enemy.png (enemigos)
- bullet.png (proyectiles)
- shoot.mp3 (sonido de disparo)
- enemy_destroyed.mp3 (sonido de destrucción)
- game_over.mp3 (sonido de Game Over)
```

**Salida:** Se generaron todos los assets necesarios usando Python:

### Solución Implementada:

1. **Script de generación (`generate_assets.py`)**:
   - Usa la librería PIL (Pillow) para generar imágenes PNG
   - Usa numpy y wave para generar sonidos WAV
   - Crea todos los assets programáticamente

2. **Imágenes generadas**:
   - `player.png` (40x40px): Nave espacial verde con detalles (ventana azul, propulsores amarillos)
   - `enemy.png` (40x30px): Nave enemiga roja con forma de nave espacial y detalles
   - `bullet.png` (4x15px): Proyectil amarillo con punta y brillo

3. **Sonidos generados**:
   - `shoot.mp3`: Beep agudo corto (800Hz + 1200Hz) con decaimiento rápido
   - `enemy_destroyed.mp3`: Sonido de explosión con múltiples frecuencias (200Hz, 150Hz, 100Hz) y ruido
   - `game_over.mp3`: Tono descendente de 400Hz a 100Hz con envolvente de decaimiento

4. **Notas técnicas**:
   - Los sonidos se generan en formato WAV (PCM 16-bit, mono, 44100 Hz)
   - Se guardan con extensión `.mp3` para compatibilidad con el código del juego
   - Los navegadores modernos pueden reproducir estos archivos aunque técnicamente sean WAV
   - Si se necesita MP3 real, se requiere ffmpeg para conversión
   - El código del juego usa rutas `assets/*.mp3` y funciona correctamente

5. **Actualización del código**:
   - Se actualizó `game.js` para usar las rutas correctas de los assets
   - Se añadió `preload = 'auto'` al objeto Audio para mejor compatibilidad

### Archivos Generados:

```text
assets/
├── player.png          (nave del jugador)
├── enemy.png           (nave enemiga)
├── bullet.png          (proyectil)
├── shoot.mp3           (sonido de disparo - formato WAV)
├── enemy_destroyed.mp3 (sonido de destrucción - formato WAV)
└── game_over.mp3       (sonido de Game Over - formato WAV)
```

### Dependencias Python utilizadas:
- `PIL` (Pillow): Para generar imágenes PNG
- `numpy`: Para generar ondas de audio
- `wave`: Para guardar archivos de audio WAV (librería estándar)

### Comandos ejecutados:
```bash
python3 generate_assets.py
```

**Resultado:** Todos los assets fueron generados exitosamente y el juego queda completamente funcional con imágenes y sonidos.

---

¡Juego completado exitosamente! 🎮🚀
