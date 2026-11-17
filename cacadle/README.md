# Cacadle 💩

Juego diario de escalera de palabras en español mexicano: llega a **CACA** cambiando una letra a la vez.

- Cada paso debe ser una palabra real de 4 letras (sin acentos, la Ñ cuenta).
- **Par** = el camino más corto posible (calculado con BFS sobre el diccionario).
- Medallas: 🏆 par · 🥈 par+1 · 🥉 par+2 · 🧻 más.
- Un reto nuevo cada medianoche (hora del centro de México, UTC-6). El reto #1 es el 17 nov 2026; la lista de 365 retos se repite cada año.
- Dificultad por día: lunes fácil (par 3), martes a jueves normal (4), viernes y domingo difíciles (5), sábado de terror (7+).
- Interfaz minimalista: toca la letra que quieres cambiar, elige la nueva y pícale ENVIAR (o escribe la palabra y Enter).
- Modo claro/oscuro con botón (recuerda tu elección).
- Más de 3,000 palabras válidas para jugar; el par y las pistas usan solo ~1,400 palabras comunes.
- Racha 🔥, logros, 3 pistas por reto, deshacer, modo práctica y resultado para compartir sin spoilers.
- Todo se guarda en el navegador (localStorage). No hay servidor ni cuentas.

## Monetización

Al inicio del `<script>` de `index.html` está el objeto `CONFIG`:

- `ADSENSE_CLIENT` / `ADSENSE_SLOT`: con tu cuenta de Google AdSense aparece un anuncio en la pantalla de resultados (no estorba mientras juegas). Sin AdSense se muestra un recuadro "Tu marca aquí".
- `CONTACTO_ANUNCIOS`: correo para vender anuncios directos y patrocinios.
- `APOYO_URL`: link de donaciones (Ko-fi, Buy Me a Coffee, Mercado Pago…). Sale en el botón ♥.
- `PATROCINIOS`: `{ 12: { nombre: 'Tacos El Güero', url: 'https://…' } }` muestra "reto patrocinado por…" ese día.

## Archivos

- `index.html`: el juego completo (HTML + CSS + JS).
- `palabras.js`: diccionario y lista de los 365 retos. Lo genera el script de abajo.
- `tools/palabras.txt`: palabras extra a mano (slang mexicano).
- `tools/diccionario.txt`: todas las palabras válidas de 4 letras ([an-array-of-spanish-words](https://github.com/words/an-array-of-spanish-words), MIT).
- `tools/frecuentes.txt` / `tools/comunes.txt`: palabras por uso ([FrequencyWords](https://github.com/hermitdave/FrequencyWords)) y lemas es-MX ([wooorm/dictionaries](https://github.com/wooorm/dictionaries)); definen las palabras comunes y las de inicio.
- `tools/build.js`: filtra la lista, calcula distancias a CACA y elige los retos por día de la semana.

```sh
node tools/build.js   # después de editar tools/palabras.txt
```

Para publicarlo, sube la carpeta a cualquier hosting estático (GitHub Pages, Netlify, Vercel).
