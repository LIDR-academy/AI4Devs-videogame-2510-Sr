# 🎮 **Prompt: OutRun JavaScript Arcade Racer**

## **📋 Título del Proyecto**
**OutRun JavaScript Arcade Racer** - Clon moderno del clásico arcade de Sega

## **🎯 Visión General del Juego**
**Tipo:** Videojuego de carreras arcade con perspectiva pseudo-3D inspirado en *OutRun* (1986)

**Objetivo Principal:** Controlar un coche deportivo a gran velocidad por una carretera infinita, llegando a checkpoints antes de que el tiempo se agote.

**Características Clave:**
- Perspectiva pseudo-3D (modo "Sprite Scaler")
- Carrera contra reloj con tiempo extendible
- Tráfico AI como obstáculos dinámicos
- Sistema de rutas ramificadas (múltiples finales)
- Efectos de velocidad y profundidad
- Se espera código modular, bien comentado.

## **⚙️ Stack Tecnológico**

Javascript Vanilla con la mínima dependencia posible de librerías externas.

## **🛠️ Requisitos Técnicos Detallados**


### **Estructura de Etapas**
```
Mínimo 6 etapas inspiradas en OutRun original:
Las etapas serán, totalmente, aleatorias para que el jugador no aprenda el circuito.
Cada etapa incluye:
- 2 bifurcaciones al final (izquierda/derecha)
- Dificultad progresiva (curvas + tráfico)
```



## **🎵 Sistema de Audio Completo**

### **Estructura de Archivos de Audio:**
```plaintext
📁 assets/audio/
├── engine/
│   ├── idle.ogg (motor al ralentí)
│   ├── low_rpm.ogg (0-100 km/h)
│   ├── medium_rpm.ogg (100-200 km/h)
│   └── high_rpm.ogg (200+ km/h)
├── effects/
│   ├── skid.ogg (derrape en curvas)
│   ├── crash_light.ogg (toque ligero)
│   ├── crash_heavy.ogg (choque fuerte)
│   ├── boost.ogg (activación nitro)
│   └── nitro.ogg (sonido nitro activo)
├── ui/
│   ├── menu_select.ogg (selección opciones)
│   ├── countdown.ogg (3-2-1-¡GO!)
│   ├── checkpoint.ogg (pasar checkpoint)
│   ├── route_select.ogg (elección bifurcación)
│   └── time_warning.ogg (tiempo crítico)
└── music/
    ├── menu.ogg (música menú principal)
    ├── stage_[1-6].ogg (música por etapa)
    ├── victory.ogg (llegada a meta)
    └── game_over.ogg (fin del juego)
```

**Requisitos Audio:**
- Música estilo synthwave/80s (como el original)
- Transiciones suaves entre pistas
- Volúmenes configurables por categoría

## **🚗 Componentes Clave del Juego**

### **Sistema de Renderizado Pseudo-3D**
```javascript
// Técnica "Sprite Scaler" para simular 3D:
- Segmentación de carretera en 500 segmentos
- Fórmula de proyección: scale = 1 / (z * depth)
- Parallax en 4 capas de fondo (cielo, montañas, árboles, cercano)
- Sprites de tráfico con escalado dinámico según distancia
```

### **Elementos Visuales Obligatorios**
- **Carretera:** 3-4 carriles con marcaciones dinámicas
- **Vehículo jugador:** Sprite animado (luces, humo, inclinación)
- **Tráfico AI:** 5 tipos de vehículos con comportamientos distintos
- **Paisaje:** Elementos temáticos por etapa (palmeras, cactus, edificios)
- **Efectos:** Partículas (polvo, humo, chispas), blur de velocidad

### **Interfaz de Usuario (HUD)**
```
┌─────────────────────────────────────┐
│ STAGE 03       TIME: 01:23    🏁 45 │
├─────────────────────────────────────┤
│                                     │
│           [ROAD RENDER]             │
│                                     │
├─────────────────────────────────────┤
│ SPEED: 245 km/h   NITRO: 🚀🚀🚀     │
└─────────────────────────────────────┘

Elementos HUD:
- Temporizador cuenta atrás (formato MM:SS)
- Velocímetro analógico/digital
- Contador de cargas nitro (3 máx/etapa)
- Indicador de etapa actual
- Distancia al próximo checkpoint
```

## **🎮 Funcionalidad y Jugabilidad**

### **Sistema de Controles**
| Tecla | Acción | Efecto |
|-------|--------|--------|
| **← / →** | Dirección lateral | Movimiento en carril (suavizado) |
| **A** | Acelerar | Aumento progresivo de velocidad |
| **Z** | Freno/Retroceso | Reducción de velocidad |
| **N** | Nitro (hold) | +20 km/h mientras se mantiene (3 usos/etapa) |
| **Espacio** | Freno de mano | Derrape controlado en curvas |
| **P** | Pausa | Menú pausa con opciones |

### **Mecánicas de Juego**
1. **Movimiento del Jugador:**
   - Movimiento lateral limitado a bordes de carretera
   - Física arcade simplificada (sin vuelcos)
   - Efecto "drift" en curvas cerradas

2. **Sistema de Colisiones:**
   - Tipos: Leve (reduce velocidad 30%), Fuerte (detención + 3s penalización)
   - Efectos visuales: Destellos, partículas, animación de golpe
   - Recuperación automática tras colisión

3. **Gestión de Tiempo:**
   - Tiempo inicial por etapa: 2 minutos
   - Bonus por checkpoint: +30 segundos
   - Penalización por colisión: -10 segundos
   - Advertencia sonora últimos 30 segundos

4. **Sistema de Rutas Ramificadas:**
   ```
   Al alcanzar checkpoint:
   1. Aparece señalización "← LEFT / RIGHT →"
   2. Jugador elige dirección en 3 segundos
   3. Transición suave a nueva etapa
   4. Registro de ruta para final múltiple
   ```

5. **Sistema Nitro:**
   - Recarga: 1 carga cada 2 checkpoints
   - Efecto: +20 km/h durante 4 segundos
   - Visual: Partículas azules, distorsión de velocidad
   - Sonido: Boost característico

## **🎨 Estilismo y Gráficos**

### **Guía de Arte**
- **Resolución:** Sprites 32x32 a 64x64 pixels
- **Paleta Colores:** Vibrante, alta saturación, estilo años 80
- **Estilo Visual:** Pixel-art con shading básico
- **Animaciones:** 2-3 frames por sprite (mínimo)

### **Elementos Gráficos Requeridos**
```
📁 assets/sprites/
├── vehicles/ (6 jugables + 5 AI)
├── road/ (segmentos, curvas, marcaciones)
├── scenery/ (etapa 1-6 elementos únicos)
├── ui/ (HUD, menús, botones)
└── effects/ (partículas, destellos, nitro)

📁 assets/backgrounds/
├── sky/ (día/noche por etapa)
├── parallax/ (4 capas por etapa)
└── transitions/ (animaciones cambio etapa)
```

```


## **⚡ Optimización y Buenas Prácticas**

### **Código Estructurado**
```javascript
// Arquitectura modular sugerida:
src/
├── main.js
├── scenes/
│   ├── BootScene.js (precarga)
│   ├── MenuScene.js (menús)
│   ├── StageScene.js (escena principal carrera)
│   ├── ForkScene.js (elección ruta)
│   └── GameOverScene.js (resultados)
├── classes/
│   ├── Vehicle.js (coches jugador/AI)
│   ├── RoadRenderer.js (motor pseudo-3D)
│   ├── TrafficManager.js (gestión tráfico)
│   └── AudioManager.js (wrapper Howler)
├── utils/
│   ├── math3d.js (funciones perspectiva)
│   ├── constants.js (configuraciones)
│   └── helpers.js (utilidades)
└── ui/
    ├── HUD.js (interfaz)
    ├── MenuUI.js (menús)
    └── Effects.js (efectos visuales)
```

### **Técnicas de Optimización**
- Pooling de objetos (segmentos de carretera, tráfico)
- Pre-cálculo de curvas y elevaciones
- LOD (Level of Detail) para elementos lejanos
- Compresión de assets (TinyPNG, OGG Vorbis q4)
- Carga progresiva de etapas

## **🧪 Plan de Pruebas**

### **Casos de Prueba Obligatorios**
1. **Rendimiento:** 60 FPS en hardware mínimo (CPU 2 core, GPU integrada)
2. **Colisiones:** Detección precisa en todos los bordes
3. **Transiciones:** Suaves entre etapas y rutas
4. **Audio:** Sin cortes, mezcla balanceada
5. **Controles:** Respuesta inmediata (<100ms)
6. **Navegadores:** Chrome, Firefox, Safari, Edge
7. **Móvil:** Controles táctiles opcionales (botones virtuales)

### **Métricas de Calidad**
- Tiempo de carga inicial: < 5 segundos
- Uso memoria: < 500 MB
- Tamaño total assets: < 50 MB comprimidos
- Latencia input: < 3 frames

## **📦 Entregables Finales**

### **1. Estructura del Proyecto Completada**
```
outrun-racer/
├── index.html (punto entrada)
├── package.json (dependencias)
├── README.md (documentación)
├── src/ (código fuente completo)
├── assets/
│   ├── audio/ (estructura completa OGG/MP3)
│   ├── sprites/ (todos los sprites organizados)
│   ├── fonts/ (fuentes pixel)
│   └── icons/ (favicon, iconos UI)
├── dist/ (build optimizado)
├── config/ (configuraciones por entorno)
└── docs/ (guías de desarrollo)
```

### **Assets e Iconografía Completa**
- **Spritesheets:** Todos los vehículos (jugable + AI) en diferentes ángulos
- **Tilesets:** Paquetes completos para cada etapa (32x32, 64x64)
- **UI Kit:** Botones, sliders, HUD elements en múltiples estados
- **Iconos:** Set completo de iconos 16x16, 32x32, 64x64
- **Fuentes:** Pixel font estilo arcade (.ttf + .woff)


### **Sistema de Audio Completo**
- **Música:** 8 pistas completas (formato .ogg y .mp3)
- **Efectos de sonido:** 25+ efectos categorizados
- **Mix profiles:** Configuraciones para diferentes dispositivos
- **Scripts de audio:** Implementación Howler.js completa

### **Documentación Adicional**
- `SETUP.md` - Guía de instalación y configuración
- `ASSETS.md` - Especificación de todos los recursos
- `API.md` - Documentación de clases y métodos
- `BUILD.md` - Instrucciones de compilación
- `TESTING.md` - Plan de pruebas y QA

---

## **🎯 Criterios de Éxito**
- ✅ Perspectiva pseudo-3D fluida y convincente
- ✅ 6 etapas jugables con bifurcaciones funcionales
- ✅ 6 vehículos distintos con características únicas
- ✅ Sistema de audio completo e inmersivo
- ✅ Performance estable a 60 FPS
- ✅ Jugabilidad adictiva y fiel al espíritu OutRun

## Proyectos similares
Puedes inspirarte en estos proyectos para desarrollar el juego
- https://github.com/erendn/outrun-js
- https://github.com/alexyu132/outrun-js
- https://github.com/NathanielWroblewski/outrun



