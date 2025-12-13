# 🏎️ Outrun JS - Juego de Carreras Estilo Arcade

Un juego de carreras inspirado en Outrun, desarrollado con JavaScript vanilla y Canvas 2D. Conduce un Ferrari a través de múltiples etapas, esquiva vehículos enemigos, usa nitro para ganar velocidad y completa cada etapa antes de que se agote el tiempo.

## 🎮 Características Principales

### 🚗 Sistema de Vehículo
- **Ferrari jugable** con animaciones realistas
- Sprites dinámicos que cambian según la dirección y velocidad
- El vehículo sigue correctamente los desniveles de la carretera
- Movimiento fluido con física de aceleración y frenado

### 🛣️ Sistema de Carretera y Paisaje
- **Carretera 3D** con perspectiva realista
- **15 temas de paisaje diferentes** (Autobahn, Wilderness, Wheat Field, Cloudy Mountain, Vineyard, Alps, Desert, Coconut Beach, Old Capital, Seaside Town, Death Valley, Desolation Hill, Devils Canyon, Gateaway, Lakeside)
- **Elementos decorativos dinámicos** (árboles, rocas, edificios, señales) que aparecen a los lados de la carretera
- Las curvas se hacen más pronunciadas según avanzas de etapa

### 🎯 Sistema de Etapas
- **Múltiples etapas** con dificultad progresiva
- Cada etapa tiene una **distancia objetivo** (3 km) y un **tiempo límite**
- El **tiempo restante** de una etapa se suma automáticamente a la siguiente
- Cada etapa tiene su propio tema de paisaje único

### 🚙 Vehículos Enemigos
- **Vehículos enemigos** que obstaculizan la carretera
- Se mueven según la velocidad relativa del Ferrari
- **Sistema de colisiones** - evita chocar o perderás
- La cantidad y velocidad de los enemigos aumenta con cada etapa

### ⚡ Sistema de Nitro
- **3 usos de nitro por etapa**
- Presiona **N** para activar el nitro
- Aumenta la velocidad en **+20 km/h durante 10 segundos**
- El contador de nitros y el tiempo restante se muestran en el HUD

### 📊 Sistema de HUD (Heads-Up Display)
- **Velocidad actual** en km/h (máximo 240 km/h)
- **Tiempo restante** de la etapa (formato MM:SS)
- **Distancia restante** en kilómetros
- **Número de etapa** actual
- **Contador de impactos** (máximo 3 antes de Game Over)
- **Contador de nitros** restantes
- **Tiempo restante del nitro** cuando está activo

### 🎵 Sistema de Música
- **3 pistas musicales** que se reproducen aleatoriamente
- Reproducción continua con transición automática entre canciones
- La música comienza al interactuar con el juego

### 💀 Sistema de Game Over
El juego termina cuando:
- Se agota el **tiempo** sin completar la etapa
- El jugador sufre **3 impactos graves** con vehículos enemigos

### 📈 Dificultad Progresiva
- **Curvas más cerradas** en etapas avanzadas
- **Más vehículos enemigos** en pantalla
- **Mayor velocidad** de los vehículos enemigos
- La dificultad aumenta automáticamente con cada etapa completada

## 🎮 Controles

- **Flecha Arriba / W**: Acelerar
- **Flecha Abajo / S**: Frenar
- **Flecha Izquierda / A**: Girar a la izquierda
- **Flecha Derecha / D**: Girar a la derecha
- **ESPACIO**: Reiniciar etapa (cuando el juego no está en curso) / Continuar a la siguiente etapa (cuando completas una etapa)
- **N**: Activar nitro
- **R**: Reiniciar juego completo (desde Game Over)

## 🏗️ Arquitectura del Código

El proyecto está organizado en módulos JavaScript para facilitar el mantenimiento:

### Archivos Principales
- **`index.html`**: Punto de entrada HTML, carga todos los scripts en orden
- **`src/index.js`**: Lógica principal del juego, bucle de juego y renderizado
- **`src/constants.js`**: Constantes globales del juego (dimensiones, colores, mapas)
- **`src/keys.js`**: Manejo de entrada de teclado
- **`src/projection.js`**: Funciones de proyección 3D a 2D
- **`src/road.js`**: Renderizado de la carretera y funciones de mapa
- **`src/car.js`**: Sistema del vehículo del jugador (Ferrari)
- **`src/enemyVehicles.js`**: Sistema de vehículos enemigos
- **`src/landscape.js`**: Sistema de elementos decorativos del paisaje
- **`src/difficulty.js`**: Sistema de dificultad progresiva (curvas dinámicas)
- **`src/hud.js`**: Sistema de interfaz (HUD) y gestión de estado del juego
- **`src/music.js`**: Sistema de música de fondo

### Assets
- **`assets/sprites/ferrari/`**: Sprites del vehículo del jugador
- **`assets/sprites/vehicles/`**: Sprites de vehículos enemigos (vehicle-0 a vehicle-10)
- **`assets/sprites/landscape/`**: Sprites de paisajes y elementos decorativos
- **`assets/sounds/music/`**: Pistas musicales (music-0.mp3, music-1.mp3, music-2.mp3)

## 🚀 Requisitos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Servidor web local (opcional, pero recomendado para evitar problemas de CORS)
- No se requieren dependencias externas - JavaScript vanilla puro

## 📝 Licencia

Este proyecto es un juego educativo desarrollado para fines de aprendizaje.

---

**¡Disfruta conduciendo a toda velocidad! 🏁**

## 📝 Agradecimientos
- https://github.com/erendn/outrun-js
- https://github.com/alexyu132/outrun-js
- https://github.com/NathanielWroblewski/outrun
