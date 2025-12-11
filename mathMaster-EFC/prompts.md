# MathMaster - Documentación de Prompts

## Información del Proyecto
- **Nombre del Juego:** MathMaster
- **Desarrollador:** EFC
- **Versión:** 1.1
- **Fecha de Creación:** Diciembre 2024
- **Última Actualización:** 11 de Diciembre 2024

---

## Prompt #1 - Creación Inicial del Juego: Modo Desafío por Puntuación Fija

**Fecha:** 11 de Diciembre de 2024

**Rol:** Eres un experto desarrollador de videojuegos web con profundos conocimientos en HTML5, CSS3 y JavaScript (Vanilla JS) otros frameworks, utilizando las mejores prácticas. Tu objetivo es desarrollar un juego educativo interactivo completo, siguiendo la metodología de desarrollo web y utilizando las mejores prácticas de codificación.

**Nombre del Proyecto y Archivos:**
* **Nombre del Juego:** MathMaster
* **Iniciales del Desarrollador:** EFC
* **Estructura de la Carpeta:** `MathMaster-EFC/`
    * `index.html` (Estructura principal del juego)
    * `styles.css` (Estilos y diseño responsivo)
    * `game.js` (Lógica del juego y manejo de interacciones)
    * `prompts.md` (Documentación de prompts)

**Concepto de Juego Elegido (¡Nuevo Enfoque!): Desafío por Puntuación Fija.**
El jugador debe responder correctamente a un número fijo de preguntas (ej. **20-30-40 preguntas**) para completar el nivel. La puntuación será la cantidad de respuestas correctas consecutivas y el tiempo total que tardó en completar el desafío. **No hay temporizador de cuenta regresiva/presión.**

**Requisitos Funcionales de la Parte 1: El Juego Educativo**
1.  **Operaciones Incluidas:** Suma (+), Resta (-), Multiplicación (x), Tablas de Multiplicar, División (/).
2.  **Niveles de Dificultad:** El juego debe tener al menos 3 niveles de dificultad (Fácil, Medio, Difícil) que ajusten el rango de números utilizados en las operaciones.

| Nivel | Objetivo Principal | Suma y Resta | Multiplicación | División |
|-------|-------------------|--------------|----------------|----------|
| 1 | Básica y Tablas (Fundamentos) | Sumas/Restas de 1 a 10. Resultado siempre positivo. | Factores de 1 a 10 (Tablas de multiplicar básicas). | Divisor de 1 a 10. Cociente entero. |
| 2 | Números Medianos (Doble Dígito) | Sumas/Restas de 1 a 100. Resultado siempre positivo. | Factor 1 (hasta 10) x Factor 2 (hasta 15). | Divisor de 1 a 15. Cociente entero. |
| 3 | Grandes Enteros (Triple Dígito) | Sumas/Restas de 1 a 1,000. | Factores de 1 a 30. | Divisor de 1 a 30. Cociente entero. |
| 4 | Introducción a Decimales (Simple) | Números hasta 10,000. Incluye decimales simples: X.X + Y.Y. | Factores hasta 100. | Divisor hasta 50. Cociente con 1 decimal. |
| 5 | Decimales Complejos y Números Grandes | Números hasta 100,000. Incluye decimales hasta X.XXX + Y.YYY. | Factor 1 (hasta 1,000) x Factor 2 (hasta 100). | Divisor hasta 100. Cociente con 2 decimales. |
| 6 | Números Negativos Simples | Suma y Resta con inclusión frecuente de números negativos (Ej: -10 + 25 = ?). | Multiplicación de dos números de hasta 3 dígitos (Ej: 123 x 456). | División con resultado decimal o resto (hasta 3 decimales). |
| 7 | Cadenas y Operaciones Mixtas | Cadenas de Suma y Resta (Ej: 15 - 8 + 3 - 7 = ?). | Multiplicación de un número de 4 dígitos por un número de 2 dígitos. | División que involucra decimales en el dividendo o divisor (Ej: 120 / 2.5 = ?). |
| 8 | Introducción a Jerarquía (Sin Paréntesis) | Sumas y Restas que forman parte de expresiones más grandes. | Operaciones combinadas (Multiplicación y Suma/Resta sin paréntesis). Ej: 5 × 6 + 10 = ? | División seguida de Suma/Resta (Ej: 100 / 4 - 5 = ?). |
| 9 | Pre-Álgebra (Resolver la Incógnita X) | Operaciones con incógnita X (Ej: X + 15 = 27; 50 - X = 12). | Multiplicación con incógnita X (Ej: 4X = 48). | División con incógnita X (Ej: X / 5 = 15). |
| 10 | Jerarquía de Operaciones (PEMDAS/BODMAS) | Operaciones complejas con paréntesis (Ej: 5 × (4 + 3) - 10 / 2 = ?). | La complejidad se centra en la aplicación correcta de la jerarquía. | La complejidad se centra en la aplicación correcta de la jerarquía. |

3.  **Modo de Juego Principal: Desafío por Puntuación Fija.**
    * El objetivo es alcanzar **30 respuestas correctas** para ganar el nivel.
    * Se iniciará un **cronómetro** visible (de cuenta ascendente) al inicio del juego para registrar el tiempo total empleado en el desafío (para medir el progreso, no para ejercer presión).
    * El juego genera preguntas aleatorias basadas en la operación y dificultad seleccionada.
    * El jugador introduce la respuesta y el juego proporciona *feedback* inmediato (correcto/incorrecto).
    * Se muestra la **Puntuación** (Respuestas Correctas: X de 10) y el **Cronómetro** actual.
    * Si la respuesta es incorrecta, la puntuación **no avanza**, y se le da una pista o simplemente se le pide que lo intente de nuevo hasta que acierte, pero el tiempo sigue corriendo (fomentando la corrección).
4.  **Modo Tablas de Multiplicar (Específico):** Un modo dedicado para practicar una tabla específica (ej. la tabla del 1, del 2, del 3, del 4, del 5 , del 6, del 7, del 8, del 9, del 10), pueden revisar todas las tablas.

**Requisitos Técnicos Iniciales:**
1.  **HTML (`index.html`):**
    * Estructura básica de la página.
    * Una pantalla de inicio (`#selection-screen`) con:
        * Título del juego.
        * Botones de selección para la Operación (Suma, Resta, Multiplicación, División, Tablas).
        * Botones de selección para el Nivel de Dificultad (1 al 10).
        * Un campo de selección para la Tabla específica (solo visible si se elige el modo "Tablas").
        * Un botón "Empezar Juego".
    * Una pantalla de juego (`#game-screen`) con:
        * Contenedor para el **Cronómetro** y la **Puntuación**.
        * Contenedor para la pregunta de matemáticas (ej. "5 + 3 = ?").
        * Un campo de entrada (`<input type="number">`) para la respuesta.
        * Un botón para verificar la respuesta.
        * Un área para el *feedback* (correcto/incorrecto/inténtalo de nuevo).
    * Una pantalla de resultados (`#result-screen`) que muestre:
        * Mensaje de "¡Felicitaciones!"
        * Puntuación final (10/10).
        * Tiempo Total empleado.
        * Un botón para "Volver a Jugar".
2.  **CSS (`styles.css`):**
    * Un diseño **limpio, legible y atractivo** (estilo "gaming" ligero).
    * La interfaz debe ser **responsiva** y jugable en dispositivos móviles.
    * Estilos para el cronómetro y el *feedback* (ej. texto verde para correcto, rojo para incorrecto).
    * Usar Flexbox/Grid para una disposición moderna.
3.  **JavaScript (`game.js`):**
    * Función para generar operaciones matemáticas aleatorias según la dificultad.
    * Funciones para manejar la lógica del juego:
        * `startGame()`: Inicializa el juego y el cronómetro.
        * `generateQuestion()`: Genera una nueva pregunta y la muestra.
        * `checkAnswer()`: Verifica la respuesta, actualiza la puntuación/feedback.
        * `updateTimer()`: Función que actualiza el cronómetro ascendente.
        * `endGame()`: Muestra los resultados finales.
    * Manejo de eventos para la interacción con los botones y el campo de respuesta.

**Tu Tarea:**
Crea el contenido completo de todos los archivos necesarios... `index.html`, `styles.css` y `game.js` para establecer la **estructura del juego** (pantalla de selección, pantalla de juego y pantalla de resultados) e implementa toda la funcionalidad para utilizar todo el juego que se pueda utilizar añadiendo al idex.html de la raiz. Incluye también el archivo `prompts.md` con este mismo prompt, y con los siguientes que se vayan añadiendo.

**Instrucción de Formato:** Proporciona el código de cada archivo separado por encabezados
Sigue buenas prácticas.
(`###`).

---

## Respuesta al Prompt #2

### Cambios Realizados

Se refactorizó completamente el juego para implementar el nuevo modo **"Desafío por Puntuación Fija"**:

#### 1. **`index.html`** - Estructura actualizada:
   - Nueva pantalla de selección (`#selection-screen`) con:
     - Selección de operación (Suma, Resta, Multiplicación, División, Tablas)
     - Selección de nivel (1-10) con descripción dinámica
     - Selección de tabla específica (visible solo para modo Tablas)
     - Selección de cantidad de preguntas (20, 30, 40)
     - Botón "Empezar" que se habilita al seleccionar operación y nivel
   - Pantalla de juego (`#game-screen`) con:
     - Indicador de operación y nivel actual
     - Cronómetro ascendente (formato MM:SS)
     - Puntuación (X / Total)
     - Racha de respuestas correctas
     - Barra de progreso visual
     - Campo de respuesta con botón verificar
     - Área de feedback con pistas
     - Teclado numérico para móviles
     - Botones de pausa y salir
   - Pantalla de pausa con estadísticas
   - Pantalla de resultados (`#results-screen`) con:
     - Respuestas correctas totales
     - Tiempo total empleado
     - Mejor racha conseguida
     - Precisión (porcentaje)
     - Intentos totales
     - Promedio de tiempo por pregunta
     - Badge de nuevo récord (menor tiempo)

#### 2. **`styles.css`** - Estilos actualizados:
   - Variables CSS para colores, sombras, tipografía
   - Diseño gaming moderno con gradientes y efectos glow
   - Diseño completamente responsivo
   - Animaciones para feedback (shake, pulse, bounce)
   - Teclado numérico oculto en desktop, visible en móvil
   - Estados visuales para botones seleccionados

#### 3. **`game.js`** - Lógica completamente nueva:
   - **10 niveles de dificultad** configurables con operaciones específicas:
     - Nivel 1: Básica y Tablas (números 1-10)
     - Nivel 2: Números Medianos (1-100)
     - Nivel 3: Grandes Enteros (1-1000)
     - Nivel 4: Decimales Simples (X.X)
     - Nivel 5: Decimales Complejos (X.XXX)
     - Nivel 6: Números Negativos
     - Nivel 7: Cadenas de Operaciones
     - Nivel 8: Jerarquía sin paréntesis (PEMDAS)
     - Nivel 9: Pre-Álgebra (resolver X)
     - Nivel 10: PEMDAS completo con paréntesis
   - **Modo Desafío por Puntuación Fija**:
     - Cronómetro ascendente (no descendente)
     - Si responde mal, puede reintentar (no avanza pero da pistas)
     - El tiempo sigue corriendo aunque falle
     - Victoria al alcanzar el número de respuestas correctas seleccionado
   - **Sistema de racha** con tracking de mejor racha
   - **Pistas dinámicas** cuando responde incorrectamente
   - **Sistema de récords** guardados en localStorage (mejor tiempo)
   - **Pausa completa** con ajuste de tiempo

### Características Principales

- **Modo principal:** Desafío por Puntuación Fija (20/30/40 preguntas)
- **Operaciones:** Suma, Resta, Multiplicación, División, Tablas
- **10 niveles de dificultad** progresivos
- **Cronómetro ascendente** (sin presión de tiempo)
- **Sistema de reintentos:** Si falla, puede intentar de nuevo
- **Pistas inteligentes** basadas en la respuesta correcta
- **Tracking de racha** y mejor racha
- **Récords de tiempo** por operación/nivel/cantidad
- **Diseño responsivo** con teclado numérico móvil
- **Sistema de pausa** con compensación de tiempo

---

## Historial de Cambios

| Fecha | Versión | Descripción |
|-------|---------|-------------|
| 11/12/2024 | 1.0 | Creación inicial del juego: Modo Desafío por Puntuación Fija, 10 niveles, sistema de reintentos |
| 11/12/2024 | 1.1 | Implementación de sistema de temas claro/oscuro con botón toggle |

---

## Prompt #2 - Implementación de Tema Claro/Oscuro

**Fecha:** 11 de Diciembre de 2024

**Rol:** Eres un Líder de Producto (Product Manager) y Diseñador de UX/Accesibilidad en un equipo de desarrollo de videojuegos. Tu tarea es implementar un tema visual claro, por ergonomía. Un botón arriba a la derecha que permita elegir claro u oscuro.

**Tu Tarea:**
Actualiza los ficheros necesarios, y el fichero de prompts.md, con este prompt.

---

## Respuesta al Prompt #2

### Implementación del Sistema de Temas

Se implementó un sistema completo de cambio de tema claro/oscuro con las siguientes características:

#### 1. **`index.html`** - Nuevo botón de tema:
   - Botón circular fijo en esquina superior derecha
   - Iconos animados: luna (tema oscuro) y sol (tema claro)
   - Accesible con `aria-label` y `title`
   - Visible en todas las pantallas del juego

#### 2. **`styles.css`** - Sistema de temas CSS:
   - **Tema oscuro** (por defecto): Variables en `:root`
   - **Tema claro**: Variables en `[data-theme="light"]`
   - Colores ergonómicos para reducir fatiga visual
   - Transiciones suaves entre temas
   - Ajustes específicos para bordes, sombras y fondos en tema claro
   - Estilos del botón toggle con animaciones de rotación
   - Responsive para móviles

#### 3. **`game.js`** - Lógica de gestión de temas:
   - `initTheme()`: Inicializa el tema al cargar
   - `toggleTheme()`: Cambia entre claro y oscuro
   - `setTheme()`: Aplica el tema especificado
   - Persistencia en `localStorage` (clave: `mathmaster_theme`)
   - Detecta preferencia del sistema (`prefers-color-scheme`)
   - Escucha cambios en preferencia del sistema

### Características del Sistema de Temas

| Característica | Descripción |
|----------------|-------------|
| Botón toggle | Esquina superior derecha, siempre visible |
| Iconos animados | Luna/Sol con rotación y escala |
| Tema claro | Fondos claros (#f8fafc), textos oscuros, sombras suaves |
| Tema oscuro | Fondos oscuros (#0f172a), textos claros, efectos glow |
| Persistencia | Guarda preferencia en localStorage |
| Auto-detección | Respeta `prefers-color-scheme` del sistema |
| Ergonomía | Colores con buen contraste WCAG |
| Responsive | Botón más pequeño en móviles |

### Beneficios de UX/Accesibilidad

- **Reducción de fatiga visual**: El tema claro es más ergonómico en ambientes iluminados
- **Preferencia del usuario**: El usuario puede elegir según su comodidad
- **Persistencia**: No necesita volver a seleccionar cada vez
- **Accesibilidad**: Contraste adecuado en ambos temas

---

## Notas para Futuras Actualizaciones

- Considerar añadir efectos de sonido
- Implementar sistema de logros/medallas
- Añadir modo supervivencia
- Integrar sistema de cuentas de usuario
- Añadir estadísticas históricas
- Implementar modo multijugador local
- Añadir animaciones más elaboradas al acertar/fallar
