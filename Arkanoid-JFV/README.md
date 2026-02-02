# Arkanoid Web Game

Juego basado en el clásico Arkanoid desarrollado con **Phaser 3** y **Vite**.

## 🚀 Cómo Ejecutar el Juego

1.  Abre una terminal en la carpeta del proyecto.
2.  Instala las dependencias (si no lo has hecho ya):
    ```bash
    npm install
    ```
3.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
4.  Abre la URL que aparece en la terminal (normalmente `http://localhost:5173`) en tu navegador web.

## 🎮 Controles

| Acción | Teclado | Ratón |
| :--- | :--- | :--- |
| **Mover Pala** | Flechas Izquierda / Derecha | Mover el Ratón |
| **Lanzar Bola** | Barra Espaciadora | Clic Izquierdo |
| **Saltar Nivel (Debug)** | Tecla 'N' | - |

## 🕹️ Cómo Jugar

El objetivo es destruir los ladrillos y avanzar a través de los niveles sin perder todas tus vidas.

### Niveles
*   **Nivel 1**: Rejilla de ladrillos estándar.
*   **Nivel 2 (Barrera)**: Ladrillos grises **indestructibles** bloquean el camino. 
*   **Nivel 3 (Jefe DOH)**: Derrota al jefe final (cabeza Moai).
    *   Tiene 20 puntos de vida.
    *   Parpadea en rojo cuando recibe daño.
    *   La bola rebota con fuerza al golpearlo.

### Power-Ups
Al destruir ladrillos, pueden caer cápsulas de poder:
*   **Cian (Alargar)**: Hace que tu pala sea más ancha durante 10 segundos.
*   **Violeta (Disrupción)**: Divide tu bola principal en 3 bolas. ¡No pierdes vida hasta que caigan todas!

### Vidas
*   Comienzas con **3 vidas**.
*   Si la bola cae por debajo de la pala, pierdes una vida.
*   Si pierdes todas las vidas, el juego termina (**Game Over**). Haz clic para reiniciar.

### Notas
*   El desarrollo fue bastante sencillo hasta que intenté hacer que la bola cambiase un poco su dirección dependiendo de en que punto de la pala golpease. Eso requirió muchos intentos y debug hasta descubrir que los parámetros que recibía la función podían estar intercambiados, a veces se recibía (bola, pala) y otras (pala, bola), con lo que, al intentar aplicar los efectos, pasaban cosas de lo más extrañas. Una vez solucionado eso, el resto fue sencillo.
*   Sólo he implementado un par de pantallas y el jefe final. El juego original tenía 33 pantallas.
