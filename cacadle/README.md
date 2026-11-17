# Cacadle 💩

Juego diario de escalera de palabras en español mexicano: llega a **CACA** cambiando una letra a la vez.

- Cada paso debe ser una palabra real de 4 letras (sin acentos, la Ñ cuenta).
- **Par** = el camino más corto posible (calculado con BFS sobre el diccionario).
- Medallas: 🏆 par · 🥈 par+1 · 🥉 par+2 · 🧻 más.
- Un reto nuevo cada medianoche (hora del centro de México, UTC-6). El reto #1 es el 17 nov 2026; la lista de 365 retos se repite cada año.
- Dificultad por día: lunes fácil (par 3), martes a jueves normal (4), viernes y domingo difíciles (5), sábado de terror (7+).
- Interfaz minimalista: toca la letra que quieres cambiar y luego la nueva (o escribe la palabra completa).
- Racha 🔥, logros, 3 pistas por reto, deshacer, modo práctica y resultado para compartir sin spoilers.
- Todo se guarda en el navegador (localStorage). No hay servidor ni cuentas.

## Archivos

- `index.html`: el juego completo (HTML + CSS + JS).
- `palabras.js`: diccionario y lista de los 365 retos. Lo genera el script de abajo.
- `tools/palabras.txt`: lista de palabras editable.
- `tools/build.js`: filtra la lista, calcula distancias a CACA y elige los retos por día de la semana.

```sh
node tools/build.js   # después de editar tools/palabras.txt
```

Para publicarlo, sube la carpeta a cualquier hosting estático (GitHub Pages, Netlify, Vercel).
