# 📋 Guía de Configuración - Outrun JS

Esta guía te ayudará a configurar y ejecutar el juego Outrun JS en tu entorno local.

## 🔧 Requisitos Previos

### Software Necesario
- **Navegador web moderno**: Chrome (recomendado), Firefox, Edge o Safari
- **Editor de código** (opcional): VS Code, Sublime Text, o cualquier editor de tu preferencia
- **Servidor web local** (recomendado): 
  - Python 3 (incluido en la mayoría de sistemas)
  - Node.js con http-server
  - VS Code con extensión Live Server
  - Cualquier servidor HTTP local

## 📥 Instalación

### Opción 1: Clonar el Repositorio

Si tienes acceso al repositorio Git:

```bash
git clone <url-del-repositorio>
cd outrun-DC
```

### Opción 2: Descargar el Proyecto

1. Descarga el proyecto como ZIP
2. Extrae el contenido en una carpeta de tu elección
3. Navega a la carpeta `outrun-DC`

## 🌐 Ejecutar el Juego

### Método 1: Servidor HTTP con Python (Recomendado)

Si tienes Python 3 instalado:

**En Windows:**
```bash
cd outrun-DC
python -m http.server 8000
```

**En macOS/Linux:**
```bash
cd outrun-DC
python3 -m http.server 8000
```

Luego abre tu navegador y visita: `http://localhost:8000`

### Método 2: Servidor HTTP con Node.js

Si tienes Node.js instalado:

```bash
# Instalar http-server globalmente (solo la primera vez)
npm install -g http-server

# Ejecutar el servidor
cd outrun-DC
http-server -p 8000
```

Luego abre tu navegador y visita: `http://localhost:8000`

### Método 3: VS Code Live Server

1. Instala la extensión "Live Server" en VS Code
2. Abre la carpeta `outrun-DC` en VS Code
3. Haz clic derecho en `index.html`
4. Selecciona "Open with Live Server"

### Método 4: Abrir Directamente (No Recomendado)

⚠️ **Advertencia**: Algunos navegadores pueden bloquear la carga de recursos por políticas de CORS cuando abres el archivo directamente.

Si aún así quieres intentarlo:
1. Abre `index.html` con tu navegador
2. Si aparecen errores en la consola sobre CORS, usa uno de los métodos de servidor arriba mencionados

## 🔍 Verificar la Instalación

1. Abre el juego en tu navegador
2. Abre la consola del desarrollador (F12)
3. Deberías ver mensajes como:
   - `"enemyVehicles.js cargado"`
   - `"landscape.js cargado"`
   - `"music.js cargado"`
   - `"Sistema de música inicializado..."`
   - `"Todos los sprites de vehículos enemigos cargados correctamente"`

4. Si no aparecen errores en rojo, el juego está configurado correctamente

## 🐛 Solución de Problemas

### El juego no carga / Pantalla negra

**Posibles causas:**
- Los recursos no se están cargando (problema de CORS)
- Algún archivo JavaScript no se está cargando

**Soluciones:**
1. Usa un servidor HTTP local (métodos 1-3 arriba)
2. Verifica que todos los archivos estén en sus ubicaciones correctas
3. Revisa la consola del navegador (F12) para ver errores específicos

### La música no reproduce

**Causa:** Los navegadores modernos requieren interacción del usuario antes de reproducir audio.

**Solución:** 
- Presiona cualquier tecla o haz clic en el canvas
- La música debería comenzar automáticamente

### Los sprites no aparecen

**Posibles causas:**
- Los archivos de imagen no están en las rutas correctas
- Problema de CORS al cargar imágenes

**Soluciones:**
1. Verifica que la carpeta `assets/` esté en la raíz del proyecto
2. Verifica que todos los archivos `.png` y `.mp3` estén presentes
3. Usa un servidor HTTP local

### El nitro no funciona

**Verificación:**
1. Abre la consola del navegador (F12)
2. Presiona la tecla **N**
3. Deberías ver un mensaje: `"Nitro activado! Restantes: X"`
4. Verifica que aparezca "Nitro: 3" en el HUD (esquina superior derecha)

**Si no funciona:**
- Verifica que `keys.js` esté cargado correctamente
- Verifica que `hud.js` esté cargado después de `keys.js`
- Revisa los mensajes de error en la consola

### La colisión no funciona correctamente

**Verificación:**
1. Conduce directamente hacia un vehículo enemigo
2. Deberías ver una reducción drástica de velocidad
3. El contador de impactos debería aumentar

**Ajustes:**
- Los valores de colisión están en `src/enemyVehicles.js` en la función `checkCollision()`
- Puedes ajustar `collisionWidth` y `collisionDepth` si es necesario

## 📁 Estructura de Directorios

```
outrun-DC/
├── index.html              # Archivo principal HTML
├── README.md               # Documentación del proyecto
├── SETUP.md                # Esta guía
├── src/                    # Código fuente JavaScript
│   ├── constants.js        # Constantes del juego
│   ├── projection.js       # Proyección 3D
│   ├── road.js            # Renderizado de carretera
│   ├── keys.js            # Manejo de teclado
│   ├── car.js             # Sistema del Ferrari
│   ├── enemyVehicles.js   # Sistema de enemigos
│   ├── landscape.js       # Elementos decorativos
│   ├── difficulty.js      # Dificultad progresiva
│   ├── music.js           # Sistema de música
│   ├── hud.js             # Interfaz de usuario
│   └── index.js           # Lógica principal
└── assets/                # Recursos del juego
    ├── sounds/
    │   └── music/         # Pistas musicales
    └── sprites/
        ├── ferrari/       # Sprites del Ferrari
        ├── vehicles/      # Sprites de enemigos
        └── landscape/     # Sprites de paisaje
```

## ⚙️ Configuración Avanzada

### Ajustar Dificultad

Los parámetros de dificultad están en `src/constants.js` y `src/enemyVehicles.js`:

- **Velocidad máxima del Ferrari**: Ajusta el cálculo en `src/hud.js` función `getSpeedInKmh()`
- **Dificultad de curvas**: Modifica `src/difficulty.js` función `getMapForStage()`
- **Cantidad de vehículos enemigos**: Ajusta `ENEMY_MAX_COUNT_BASE` en `src/enemyVehicles.js`
- **Velocidad de enemigos**: Modifica `ENEMY_BASE_SPEED` y `getEnemySpeedForStage()` en `src/enemyVehicles.js`

### Ajustar Nitro

Los parámetros del nitro están en `src/hud.js`:

- **Duración**: Modifica `NITRO_DURATION` (en milisegundos)
- **Boost de velocidad**: Modifica `NITRO_SPEED_BOOST_KMH` (en km/h)
- **Usos por etapa**: Modifica `MAX_NITRO_PER_STAGE`

### Ajustar Tiempo y Distancia de Etapas

Los parámetros están en `src/hud.js`:

- **Duración base de etapa**: Modifica `stageDuration` (en segundos)
- **Distancia de etapa**: Modifica `stageDistanceKm` (en kilómetros)

## 🔄 Actualización del Proyecto

Si el proyecto se actualiza:

1. Cierra el servidor actual
2. Descarga/actualiza los archivos
3. Recarga la página en el navegador (Ctrl+F5 o Cmd+Shift+R para forzar recarga)
4. Si hay problemas, cierra y vuelve a abrir el navegador

## 📞 Soporte

Si encuentras problemas que no se resuelven con esta guía:

1. Revisa la consola del navegador (F12) para mensajes de error específicos
2. Verifica que todos los archivos estén presentes
3. Asegúrate de estar usando un servidor HTTP local (no abriendo el archivo directamente)
4. Verifica que estés usando un navegador moderno y actualizado

---

**¡Listo para empezar a conducir! 🏁**

