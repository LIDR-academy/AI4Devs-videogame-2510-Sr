# Arkanoid Game - Documentación de Desarrollo

## Descripción del Juego
Arkanoid es un juego clásico de arcade donde el jugador controla una paleta para hacer rebotar una pelota y destruir todos los ladrillos en la pantalla.

## Cómo Jugar
- Usa las teclas de flecha (← →) o las teclas A/D para mover la paleta
- La pelota rebota automáticamente
- Destruye todos los ladrillos para ganar
- Si la pelota cae por debajo de la paleta, pierdes

## Prompts Utilizados

### Prompt 1 - Estructura inicial
"Crea un juego Arkanoid simple en HTML5 con Canvas. Debe incluir:
- Una paleta controlable con el teclado
- Una pelota que rebote
- Filas de ladrillos destructibles
- Sistema de puntuación
- Detección de colisiones
- Game over cuando la pelota cae"

### Prompt 2 - Mejoras visuales
"Añade estilos CSS modernos al juego:
- Fondo con gradiente oscuro
- Efecto de sombra neón al canvas
- Colores diferentes para cada fila de ladrillos
- Estilo cyberpunk/arcade"

### Prompt 3 - Refinamiento de controles
"Mejora los controles del juego:
- Añade soporte para teclas A y D además de las flechas
- Ajusta la velocidad de la paleta
- Implementa física mejorada para el rebote de la pelota según donde golpee la paleta"

## Proceso de Desarrollo

### Desafíos Encontrados
1. **Detección de colisiones**: Implementar la detección precisa entre la pelota y los ladrillos requirió ajustar los cálculos de posición.
2. **Física del rebote**: Hacer que el ángulo de rebote dependiera de dónde golpea la pelota en la paleta para mayor control del jugador.
3. **Rendimiento**: Optimizar el game loop para mantener 60 FPS constantes.

### Soluciones Implementadas
- Uso de `requestAnimationFrame` para un game loop fluido
- Cálculo del rebote basado en la posición relativa del impacto
- Sistema de colores por filas usando HSL para crear un gradiente visual atractivo

## Características del Juego
- 5 filas x 8 columnas de ladrillos (40 ladrillos total)
- Cada ladrillo vale 10 puntos
- Velocidad de pelota constante con dirección variable
- Paleta responsiva con velocidad fija
- Detección de victoria al destruir todos los ladrillos

## Testing
El juego ha sido probado en:
- Chrome (última versión)
- Firefox (última versión)
- Edge (última versión)

Funciona correctamente en todos los navegadores modernos que soporten HTML5 Canvas.

## Integración con el Sistema de Juegos

### Prompt 4 - Integración al índice
"Añade el juego Arkanoid al sistema de índice de juegos del repositorio"

El juego fue integrado exitosamente al sistema mediante:
1. Creación de la carpeta `arkanoid-CSM` siguiendo la convención de nomenclatura
2. Ejecución del script `index-videogames.py` que automáticamente detecta las carpetas de juegos
3. El script genera un nuevo `index.html` que incluye enlaces a todos los juegos disponibles

### Acceso al Juego
Para acceder al juego desde el índice principal:
1. Ejecutar `python3 -m http.server 8000` en la carpeta raíz del proyecto
2. Navegar a `http://localhost:8000`
3. Seleccionar "arkanoid" del listado de juegos disponibles

El sistema permite agregar nuevos juegos simplemente creando carpetas con el formato `nombreJuego-INICIALES` y ejecutando el script generador del índice.