# Mi Rutina de Gym

App web (PWA) de rutina de gimnasio de 5 días, pensada para el celular.

## Qué incluye

- **Rutina de 5 días** balanceada por grupo muscular, con duración calculada entre 1h30 y 2h.
- **Fotos reales** de cada ejercicio ([free-exercise-db](https://github.com/yuhonas/free-exercise-db), dominio público), con dos tomas alternándose para mostrar el movimiento.
- **Temporizador de calentamiento** (10 / 12 / 15 min) y **temporizador de descanso** (45s / 1min / 2min).
- **Alarma con pantalla apagada**: el pitido se programa por adelantado en el AudioContext, así suena aunque el celular esté bloqueado.
- **Pantalla siempre encendida** mientras entrenas (Screen Wake Lock API).
- **Seguimiento de series** con checkboxes, guardado en `localStorage`.
- **Rotación mensual**: un botón cambia los ejercicios por sus variantes (A/B/C) y mueve los músculos a otro día de la semana.
- **Funciona sin internet**: el service worker guarda la app y las fotos que ya viste.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La app completa (HTML + CSS + JS) |
| `manifest.json` | Datos de instalación de la PWA (nombre, íconos, colores) |
| `sw.js` | Service worker: caché offline de la app y de las fotos |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | Íconos de la app |

## Cómo publicarla

1. Subir estos archivos a un repositorio de GitHub.
2. Activar **GitHub Pages** en `Settings → Pages`, rama `main`, carpeta `/ (root)`.
3. Abrir la URL en Chrome en el celular y usar **"Instalar aplicación"**.

> La app debe abrirse por **https** (GitHub Pages ya lo es) para que funcionen
> la instalación, el bloqueo de pantalla y el modo sin conexión.

## Rotación de rutina

El botón **🔄 Rotar** avanza un ciclo. Cada ciclo:

- cambia cada ejercicio por su variante (A → B → C → A…),
- corre el orden de los días (para no entrenar siempre el mismo músculo el lunes),
- borra las series marcadas para empezar el mes limpio.

Las series, repeticiones y descansos **no cambian** al rotar, por eso la duración
estimada de cada día se mantiene igual.
