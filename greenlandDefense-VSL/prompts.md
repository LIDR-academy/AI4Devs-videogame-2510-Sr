# Greenland Defense - Resumen de conversación y prompts

## 1. Descripción del juego y cómo jugar
- Tower Defense en Groenlandia (pixel art). Enemigos siguen un camino serpenteante; torres Inuit defienden.
- Recursos iniciales: 200 oro, 10 vidas, 5 oleadas crecientes (águilas, monster trucks, burger bosses).
- Colocar torres: selecciona en el panel derecho y haz clic en el mapa fuera del camino. Al inicio de cada oleada pulsa “▶️ INICIAR OLEADA”.
- Torres:
  - Arquero Inuit: disparo rápido, rango alto.
  - Cañón de Hielo: daño medio, ralentiza 50% por 2s.
  - Catapulta: daño alto en área (radio 30px).
- Mecánicas: enemigos que llegan restan vida; al morir dan oro. Oleadas terminan al limpiar la cola y no quedar enemigos; victoria tras 5 oleadas. Derrota al llegar vidas a 0. Overlay de reinicio disponible.
- Estética: fondo nevado, camino de tierra/hielo, sprites y UI en estilo pixel art. Animaciones de victoria (misil sobre Burger Invasion) y derrota (invasión comercial).

## 2. Prompts principales usados
- Crear juego Tower Defense completo en `greenlandDefense-VSL/` con temática Groenlandia, pixel art, clases ES6, oleadas, UI y animaciones de victoria/derrota.
- Ajustes de colocación: permitir torres más cerca del camino.
- Incrementos de alcance: +25% y luego +20% adicional a todas las torres.
- Mejora estética y animación de torres inspiradas en referencias (arquero, cañón de hielo, catapulta).
- Mejora estética y animación de enemigos con referencias (águila con gafas, monster truck, burger boss).

## 3. Problemas/bugs y soluciones
- El botón “Iniciar Oleada” no lanzaba enemigos al abrir por `file://` porque el script era módulo y el navegador lo bloqueaba. **Solución:** cargar `game.js` sin `type="module"` y con `defer`; además, spawn inmediato del primer enemigo al iniciar oleada.
- Enemigos no visibles al inicio porque el punto inicial estaba fuera del canvas. **Solución:** mover `PATH_POINTS` inicial dentro del canvas.
- Torretas demasiado alejadas del camino. **Solución:** reducir margen extra de validación (`PATH_WIDTH/2 + 4`).
- Necesidad de feedback instantáneo al iniciar oleada. **Solución:** `spawnNext` inmediato en `startWave`.
- Mejoras visuales (torres y enemigos) iteradas para mayor detalle y animación: se agregaron estados de animación (`animTime`, `shootFx`), retrocesos, bob, flaps, rebotes y sprites más ricos.

## 4. Resumen del proceso de desarrollo
- Se armó la estructura base (HTML/CSS/JS) con UI lateral, canvas 800x600 y lógica de oleadas/torres/enemigos.
- Se ajustaron mecánicas: colocación válida, ralentización, daño en área, rango aumentado, spawns inmediatos, margen al camino reducido.
- Se resolvieron bloqueos de carga y visibilidad inicial ajustando script y punto de inicio del camino.
- Se enriqueció el arte en pixel: primero formas básicas, luego sprites detallados y animados para torres y enemigos, siguiendo referencias proporcionadas.
- Se añadió animación de victoria/derrota y reinicio.

