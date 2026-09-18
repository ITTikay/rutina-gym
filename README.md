# Mi Rutina de Gym

App web (PWA) de rutina de gimnasio de 5 días, pensada para el celular.

## Qué incluye

- **Rutina de 5 días** balanceada por grupo muscular, con duración calculada entre 1h30 y 2h.
- **Fotos reales** de cada ejercicio ([free-exercise-db](https://github.com/yuhonas/free-exercise-db), dominio público), con dos tomas alternándose para mostrar el movimiento.
- **Temporizador de calentamiento** (10 / 12 / 15 min) y **temporizador de descanso** (45s / 1min / 2min).
- **Alarma con pantalla apagada**: el pitido se programa por adelantado en el AudioContext, así suena aunque el celular esté bloqueado.
- **Pantalla siempre encendida** mientras entrenas (Screen Wake Lock API).
- **Seguimiento de series** con checkboxes, guardado en `localStorage`.
- **Registro de peso por ejercicio** (kg o lb) con botones −/+ y comparación contra la semana anterior (▲ subiste / ▼ bajaste / = igual).
- **Meta semanal (sobrecarga progresiva) con 75% mínimo de cumplimiento**: la meta es subir un escalón (2.5 kg / 5 lb) si la semana anterior (1) hiciste al menos el **75% de la rutina del día** — así puedes saltar ejercicios cuando en tu gimnasio no hay la máquina — y (2) de ese ejercicio hiciste al menos el **75% de sus series** (3 de 4, 4 de 5, 3 de 3). Si no, la meta es repetir el peso. La meta aparece en gris dentro del campo vacío y al tocarlo se copia. Si repites el peso cuando tocaba subir, sale un aviso amarillo.
- **Indicador del 75% durante el entrenamiento**: el anillo de progreso del día está naranja y se pone verde al llegar al 75%, con el mensaje "Llegaste al 75%: la próxima semana toca subir peso".
- **Reporte de pesos de la semana anterior**: se abre solo la primera vez que entras a cada día en la semana (y con el botón 📋). Muestra por ejercicio: semana anterior, meta de hoy y lo que llevas esta semana, con un resumen de cuántos subiste / igual / bajaste. Desde ahí también puedes reiniciar las series viejas. Reiniciar solo desmarca las series; los pesos se conservan (~6 meses de historial por ejercicio).
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

El historial de pesos va ligado a cada ejercicio (no a su posición), así que al
rotar las variantes nuevas empiezan sin peso y, cuando vuelve una variante, su
historial reaparece.

## Actualizar la app publicada

Sube los archivos modificados al repo (`Add file → Upload files`, mismo nombre
los reemplaza). La app instalada en el celular — sea desde Chrome o el APK de
PWABuilder — carga desde GitHub Pages, así que se actualiza sola: cierra la app
por completo y vuelve a abrirla con internet. **No hace falta generar otro APK.**
