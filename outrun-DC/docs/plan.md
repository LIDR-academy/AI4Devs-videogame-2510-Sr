## Plan de Ejecución

### 1. Carretera

Como experto programador FrontEnd de juegos, utilizando como base el código existente añade ser un vehículo que se mueva por la carretera. 
Las imágenes del vehículo las tienes en assets/sprites/ferrari

### 2. Marcadores

Debe aparecer en pantalla, la velocidad a la que va el vehículo en km/h, con un máximo de 240km/h. Así mismo, debe aparecer una cuenta atrás de lo que le queda para finalizar la etapa tanto en segundos como en Km. 
La etapa durará un máximo de dos minutos a una velocidad media de 200Km/h. 
Cuando finalice el tiempo si conseguir la etapa, el usuario tendrá que volver a empezar a jugar. 

### 3. Vehículos

Los vehículos irán a una determinada velocidad, si el ferrari va más lento, los vehículos se alejarán, si el ferrari va más rápido, los vehículos se acercarán. Si el ferrari no los esquiva, habrá colisión. 
Los vehículos deben seguir la dirección de la carretera. 
Las imágenes de los vehículos obstaculizando la carretera están en assets/sprites/vehicles

### 4. Paisaje

Debe haber elementos decorativos e identificativos de cada etapa. Estos elementos deben estar fuera de la carretera. Debe mantenerse la sensación de velocidad, de tal manera que esos elementos se irán haciendo más grandes a medida que el ferrari se acerca a ellos. Utiliza assets/sprites/landscape para cada una de esas etapas.

### 4. Fin de Etapa. Bifurcación

Cuando finalice la etapa, debes mostrar una bifucarción de carretera para que el jugador elija por dónde quiere ir. Una vez finalice la etapa, los segundos que le hayan quedado restantes en la etapa anterior, se sumarán a la etapa siguiente.

### 5. Música

Debe haber música sonando. Los audios los tienes en assets/sounds/music. Cada canción debe sonar de forma aleatoria, cuando finalice una canción, debe sonar automáticamente la otra.

### 6. Botón Nitro

+20 km/h mientras se mantiene (3 usos/etapa)

### 7. Game Over

El juego finaliza cuando:
- El jugador no llegue a finalizar la etapa.
- El jugador tenga tres impactos graves con los vehículos que obstaculizan la carretera. El número de impactos


