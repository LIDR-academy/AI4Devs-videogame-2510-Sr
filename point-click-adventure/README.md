# Aventura Point & Click

Un MVP de aventura gráfica point & click desarrollado con React y Vite.

## 🎮 Descripción del Juego

Una aventura gráfica minimalista donde el objetivo es escapar de una habitación. El jugador debe explorar haciendo click en los objetos para encontrar una llave y abrir la puerta.

## 🎯 Objetivo

Salir de la habitación encontrando la llave escondida en el jarrón y usándola para abrir la puerta.

## 🕹️ Cómo Jugar

1. **Explora la habitación** haciendo click en los objetos
2. **Haz click en el jarrón** para encontrar la llave
3. **Haz click en la llave** para añadirla al inventario
4. **Haz click en la puerta** con la llave en el inventario para ganar

## 🚀 Instalación y Ejecución

### Requisitos previos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador:**
   El juego se abrirá automáticamente en `http://localhost:5173`

### Comandos adicionales

- **Construir para producción:**
  ```bash
  npm run build
  ```

- **Previsualizar build de producción:**
  ```bash
  npm run preview
  ```

## 📁 Estructura del Proyecto

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
├── README.md                 # Este archivo
└── prompts.md                # Documentación del proceso de desarrollo
```

## 🏗️ Arquitectura

### Componentes

- **App**: Gestiona el estado global del juego (inventario, mensajes, victoria)
- **Room**: Renderiza la habitación y los objetos interactivos
- **Object**: Componente reutilizable para objetos clickeables (jarrón, llave, puerta)
- **Inventory**: Muestra los items que el jugador ha recogido
- **MessageBox**: Muestra mensajes de feedback al jugador

### Estado del Juego

El estado se maneja con `useState` de React:
- `inventory`: Array de items en el inventario
- `message`: Mensaje actual mostrado al jugador
- `gameWon`: Boolean que indica si el juego ha sido completado
- `keyFound`: Boolean que indica si la llave está visible en la habitación
- `keyInInventory`: Boolean que indica si la llave está en el inventario

### Flujo de Interacción

1. El jugador hace click en un objeto
2. `handleObjectClick` procesa la acción según el tipo de objeto
3. Se actualiza el estado correspondiente
4. Los componentes se re-renderizan con el nuevo estado

## 🎨 Características

- ✅ Sistema de objetos clickeables
- ✅ Inventario funcional
- ✅ Sistema de mensajes de feedback
- ✅ Lógica de juego simple y directa
- ✅ Diseño responsive
- ✅ Estilos CSS modernos con gradientes

## 🛠️ Tecnologías Utilizadas

- **React 18**: Biblioteca de UI
- **Vite**: Build tool y dev server
- **CSS3**: Estilos y animaciones
- **JavaScript (ES6+)**: Lógica del juego

## 📝 Notas de Desarrollo

Este es un MVP minimalista diseñado para demostrar los conceptos básicos de una aventura gráfica point & click. Se puede expandir con:
- Más habitaciones
- Más objetos e interacciones
- Sistema de verbos (mirar, usar, tomar)
- Animaciones
- Sonidos
- Más puzzles

## 📄 Licencia

Este proyecto es parte de un ejercicio educativo de AI4Devs.

