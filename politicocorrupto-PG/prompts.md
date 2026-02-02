# El Político Corrupto - Documentación de Desarrollo

## Descripción del Juego

**El Político Corrupto** es un juego de plataformas donde controlas a un político que debe recoger billetes y lingotes de oro mientras evita a periodistas, jueces y ciudadanos enfadados. El juego combina mecánicas de plataformas clásicas con un sistema de power-ups y puntuación.

### Cómo jugar
- **Movimiento:** Flechas `← →` o teclas `A D`
- **Saltar:** `ESPACIO`
- **Objetivo:** Conseguir la mayor cantidad de dinero posible en 60 segundos
- **Vidas:** 3 vidas iniciales

---

## Prompts Utilizados

### Prompt 1: Concepto del juego

**Usuario:**
> quiero un concepto de juego de plataformas en que un politico tiene que coger billetes de dinero

**Respuesta del asistente:**
El asistente propuso un concepto completo incluyendo:
- Premisa del juego con temática política satírica
- Mecánicas de movimiento y salto
- Sistema de recolección de dinero con diferentes valores
- Obstáculos temáticos (periodistas, jueces, ciudadanos)
- Power-ups con efectos únicos
- Sistema de puntuación progresivo

### Prompt 2: Desarrollo del juego

**Usuario:**
> sí

**Respuesta del asistente:**
Desarrollo completo del juego en un archivo HTML único con CSS y JavaScript inline.

### Prompt 3: Reestructuración del proyecto

**Usuario:**
> Crea los archivos necesarios: Dentro de la carpeta con el nombre de tu juego y tus iniciales, añade todos los archivos necesarios para tu juego, incluyendo un HTML denominado index.html, CSS y JavaScript.

**Respuesta del asistente:**
Reestructuración del proyecto en archivos separados:
- `index.html` - Estructura HTML
- `styles.css` - Estilos CSS
- `game.js` - Lógica del juego en JavaScript
- `prompts.md` - Esta documentación

---

## Estructura del Proyecto

```
politico-TD/
├── index.html      # Estructura HTML del juego
├── styles.css      # Estilos y diseño visual
├── game.js         # Lógica del juego (JavaScript)
└── prompts.md      # Documentación y prompts
```

---

## Arquitectura Técnica

### HTML (index.html)
- Canvas de 800x600 píxeles para renderizado del juego
- Interfaz de usuario (HUD) con puntuación, vidas y tiempo
- Pantallas modales para inicio y game over
- Estructura semántica con comentarios descriptivos

### CSS (styles.css)
- Diseño responsive con media queries
- Gradientes y sombras para efectos visuales
- Animaciones de transición en botones
- Sistema de capas con z-index para modales

### JavaScript (game.js)
- **Sistema de físicas:** Gravedad, fricción, detección de colisiones
- **Game Loop:** Usando `requestAnimationFrame` para 60fps
- **Generación procedural:** Spawn aleatorio de dinero, obstáculos y power-ups
- **Sistema de estados:** Control de power-ups con temporizadores
- **Gestión de eventos:** Controles por teclado con prevención de comportamiento por defecto

---

## Elementos del Juego

### Coleccionables
| Elemento | Símbolo | Valor |
|----------|---------|-------|
| Billete verde | 💵 | $10 |
| Billete azul | 💶 | $50 |
| Lingote de oro | 🥇 | $100 |

### Obstáculos
| Tipo | Símbolo | Efecto |
|------|---------|--------|
| Periodista | 📸 | -1 vida |
| Juez | ⚖️ | -1 vida |
| Ciudadano | 😠 | -1 vida |

### Power-ups
| Tipo | Símbolo | Duración | Efecto |
|------|---------|----------|--------|
| Maletín | 💼 | 10s | Puntos x2 |
| Corbata | 👔 | 8s | Inmunidad |
| Helicóptero | 🚁 | 6s | Volar |

---

## Desafíos y Soluciones

### Desafío 1: Detección de colisiones con plataformas
**Problema:** El jugador atravesaba las plataformas o se quedaba atascado.
**Solución:** Implementar detección de colisión solo cuando el jugador está cayendo (`velocityY >= 0`) y verificar que está justo encima de la plataforma.

### Desafío 2: Sistema de power-ups
**Problema:** Múltiples power-ups activos causaban comportamientos inesperados.
**Solución:** Implementar `deactivatePowerups()` que limpia todos los estados antes de activar uno nuevo, asegurando que solo un power-up esté activo a la vez.

### Desafío 3: Control fluido del personaje
**Problema:** El movimiento se sentía rígido y poco responsivo.
**Solución:** Añadir fricción al movimiento horizontal y permitir cambio de dirección en el aire para un control más preciso.

---

## Tecnologías Utilizadas

- **HTML5 Canvas** - Renderizado 2D del juego
- **JavaScript ES6+** - Lógica del juego con arrow functions, template literals
- **CSS3** - Estilos con gradientes, flexbox, transiciones
- **Sin dependencias externas** - Todo el código es vanilla JS/CSS

---

## Compatibilidad

Probado en:
- Google Chrome (recomendado)
- Mozilla Firefox
- Safari
- Microsoft Edge

---

## Créditos

Desarrollado como ejercicio del curso AI4Devs utilizando Claude como asistente de código.
