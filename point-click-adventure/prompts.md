# Prompts Utilizados para el Desarrollo

Este documento contiene los prompts utilizados en esta conversación para crear la aventura gráfica point & click.

## Prompt Principal (Prompt del Usuario)

```
Actúa como un desarrollador frontend con experiencia en videojuegos point & click web.

Objetivo:

Crear un MVP de una aventura gráfica point & click que funcione completamente en el navegador.

Alcance del MVP:

- Una sola habitación (pantalla única).

- Un protagonista controlado solo por clicks (sin caminar).

- El objetivo es salir del cuarto.

- Una llave está escondida en un jarrón.

- El jugador debe:

  1. Hacer click en el jarrón → aparece la llave.

  2. Hacer click en la llave → se añade al inventario.

  3. Hacer click en la puerta con la llave → gana el juego.

Tecnologías:

- React con Vite

- JavaScript (no TypeScript para simplificar)

- HTML + CSS

- Sin canvas: todo renderizado con componentes React y CSS

- Estado manejado con useState

Requisitos funcionales mínimos:

- Objetos clickeables:

  - Jarrón

  - Llave

  - Puerta

- Inventario mínimo:

  - Muestra la llave cuando se obtiene

- Sistema de mensajes de texto (una línea):

  - Ej: "El jarrón está vacío", "Has conseguido una llave"

- Lógica simple de interacción:

  - Click directo (sin verbos como usar/mirar)

Gráficos:

- Sprites muy simples:

  - Usar divs con CSS, SVG o imágenes placeholder

- Vista en 2D, estilo ilustración plana

- No animaciones (opcional)

Estructura mínima de componentes:

- App / Game

- Room

- Object (reutilizable para jarrón, llave y puerta)

- Inventory

- MessageBox

Flujo del juego:

1. Carga la habitación

2. El jugador explora haciendo click

3. Descubre la llave

4. Abre la puerta

5. Muestra mensaje de victoria

Entrega:

1. Explicación breve del enfoque

2. Estructura de carpetas simple

3. Código funcional y comentado

4. Instrucciones para ejecutar el proyecto (npm install + npm run dev)
```

## Prompt Secundario (Rectificación)

```
rectifica y elimina los archivos relacionados con el videojuego snake y centrate solo en el point-click-adventure creando un archivo prompts.md  con los prompts usado en esta conversacion
```

## Implementación Realizada

### Estructura del Proyecto Creada

```
point-click-adventure/
├── src/
│   ├── components/
│   │   ├── Room.jsx          # Componente de la habitación
│   │   ├── Object.jsx        # Componente reutilizable para objetos
│   │   ├── Inventory.jsx     # Componente del inventario
│   │   └── MessageBox.jsx    # Componente de mensajes
│   ├── App.jsx               # Componente principal con lógica del juego
│   ├── main.jsx              # Punto de entrada de React
│   └── styles.css            # Estilos globales
├── index.html                # HTML principal
├── package.json              # Dependencias y scripts
├── vite.config.js            # Configuración de Vite
├── README.md                 # Documentación completa
├── prompts.md                # Este archivo
└── .gitignore                # Archivos a ignorar
```

### Componentes Implementados

**App.jsx**: 
- Gestiona todo el estado del juego usando `useState`
- Estados: `inventory`, `message`, `gameWon`, `keyFound`, `keyInInventory`
- Maneja las interacciones con objetos mediante `handleObjectClick`
- Controla el flujo completo del juego

**Room.jsx**:
- Renderiza la habitación con fondo degradado
- Posiciona los objetos de forma absoluta dentro de la habitación
- Controla la visibilidad condicional de la llave (solo aparece después de hacer click en el jarrón)

**Object.jsx**:
- Componente reutilizable para todos los objetos clickeables
- Recibe props: `type`, `label`, `position`, `onClick`
- Muestra sprites simples usando emojis (🏺, 🗝️, 🚪)
- Incluye efectos hover para mejor UX

**Inventory.jsx**:
- Muestra los items recogidos por el jugador
- Estado vacío cuando no hay items
- Renderiza cada item con su sprite correspondiente

**MessageBox.jsx**:
- Muestra mensajes de feedback al jugador
- Actualización dinámica según las acciones realizadas
- Diseño visual destacado para mejor visibilidad

### Lógica del Juego Implementada

El flujo de interacción es simple y directo:

1. **Click en jarrón**:
   - Si `keyFound` es `false` → `keyFound` se pone en `true`, la llave aparece en la habitación
   - Si `keyFound` es `true` → muestra mensaje "El jarrón está vacío."

2. **Click en llave**:
   - Solo funciona si `keyFound` es `true` y `keyInInventory` es `false`
   - Añade la llave al inventario
   - `keyInInventory` se pone en `true`
   - La llave desaparece de la habitación

3. **Click en puerta**:
   - Si `keyInInventory` es `true` → `gameWon` se pone en `true`, muestra mensaje de victoria
   - Si `keyInInventory` es `false` → muestra mensaje "La puerta está cerrada. Necesitas una llave."

### Estilos CSS

- Diseño moderno con gradientes y sombras
- Objetos posicionados de forma absoluta dentro de la habitación
- Hover effects y transiciones suaves
- Responsive design para móviles
- Emojis como sprites simples (🏺, 🗝️, 🚪)
- Paleta de colores coherente y atractiva

### Desafíos y Soluciones

**Desafío 1**: Controlar la visibilidad de la llave
- **Solución**: Usar dos estados separados (`keyFound` y `keyInInventory`) para controlar cuándo mostrar la llave en la habitación vs. en el inventario

**Desafío 2**: Prevenir clicks después de ganar
- **Solución**: Agregar verificación al inicio de `handleObjectClick` para retornar temprano si `gameWon` es `true`

**Desafío 3**: Feedback visual claro
- **Solución**: Implementar hover effects, labels en objetos, y mensajes descriptivos en cada acción

## Resultado Final

El juego funciona completamente en el navegador, es interactivo, y cumple con todos los requisitos del MVP. La estructura es escalable y fácil de expandir con más habitaciones, objetos y puzzles.

### Instrucciones de Ejecución

1. Navegar a la carpeta del proyecto: `cd point-click-adventure`
2. Instalar dependencias: `npm install`
3. Ejecutar en modo desarrollo: `npm run dev`
4. Abrir en el navegador la URL proporcionada por Vite (normalmente `http://localhost:5173`)
