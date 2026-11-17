// Construye palabras.js: diccionario completo + 365 retos diarios.
// Uso: node tools/build.js
//  - diccionario.txt : todas las palabras válidas de 4 letras (diccionario español completo)
//  - palabras.txt    : extras a mano (slang mexicano, etc.)
//  - frecuentes.txt  : palabras ordenadas por uso; de aquí salen las palabras de inicio
const fs = require('fs');
const path = require('path');
const leer = f => fs.readFileSync(path.join(__dirname, f), 'utf8').split('\n').filter(l => !l.startsWith('#')).join(' ').toLowerCase().split(/\s+/).filter(w => /^[a-zñ]{4}$/.test(w));

// Palabras que nunca serán inicio (groserías, temas delicados, nombres raros)
const NO_INICIO = new Set(`caca caga cago cagas cagan pedo pene puta puto joto teta popo pipi nazi sida coño culo mear meas mojo jode joda jodo follo folla polla puto puta cojo coja nalga sexo semen orto ano pito maricon marica mato mata matas drogas`.split(/\s+/));

const words = [...new Set([...leer('diccionario.txt'), ...leer('palabras.txt')])].sort();
const set = new Set(words);
const ABC = 'abcdefghijklmnñopqrstuvwxyz';
const vecinos = w => { const o = []; for (let i = 0; i < 4; i++) for (const c of ABC) { if (c === w[i]) continue; const n = w.slice(0, i) + c + w.slice(i + 1); if (set.has(n)) o.push(n); } return o; };
// Palabras comunes: las que usan el par y las pistas (para que el camino óptimo sea con palabras normales)
const lemas = new Set(leer('comunes.txt'));
const RARAS = new Set('caia auca amia asca anta ceca veca hayo amis caco cuca'.split(' '));
const comunes = new Set([...leer('frecuentes.txt').slice(0, 2000), ...leer('palabras.txt').filter(w => lemas.has(w))].filter(w => set.has(w) && !RARAS.has(w)));
const vecinosC = w => vecinos(w).filter(n => comunes.has(n));
const dist = { caca: 0 }; const q = ['caca'];
while (q.length) { const w = q.shift(); for (const n of vecinosC(w)) if (!(n in dist)) { dist[n] = dist[w] + 1; q.push(n); } }
console.log('comunes:', comunes.size);
const hist = {}; for (const w in dist) hist[dist[w]] = (hist[dist[w]] || 0) + 1;
console.log('palabras válidas:', words.length, '| llegan a caca:', Object.keys(dist).length, '| por distancia:', JSON.stringify(hist));

// Palabras de inicio: solo las más usadas (reconocibles)
const pareceEspanol = w => !/[wk]/.test(w) && /[aeiouslnrdzy]$/.test(w) && !/ss|^ch[ae]u$/.test(w) && !EXTRANJERAS.has(w);
const EXTRANJERAS = new Set('anos ano lady iran troy frey zulu lulu fifi dean lord tell true aron inga siro rita romi tito bren deis enes vilo frey olio pepa lena momo trol huno rele ende quid dino fido guie crie chai chau show film miss blue band jazz club golf bar soul rock team fans pony cola okay hola chao ciao tour star free love baby boys girl gays sexy rosa juan jose luis ana pepe dios maria nena nene'.split(' '));
const COMUNES = new Set([...leer('comunes.txt'), ...leer('palabras.txt')]);

const frecuentes = leer('frecuentes.txt').slice(0, 1400).filter(w => COMUNES.has(w) && w in dist && !NO_INICIO.has(w) && pareceEspanol(w));

let seed = 20261117;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const buckets = {};
for (const w of frecuentes) (buckets[dist[w]] ||= []).push(w);
for (const d in buckets) shuffle(buckets[d]);
console.log('inicios por distancia:', JSON.stringify(Object.fromEntries(Object.entries(buckets).map(([d, a]) => [d, a.length]))));

// Día 0 = martes 17 nov 2026. Lunes fácil → sábado de terror.
const OBJ = { 0: 5, 1: 3, 2: 4, 3: 4, 4: 4, 5: 5, 6: 6 };
const retos = [];
for (let i = 0; i < 365; i++) {
  const wd = (2 + i) % 7, d = OBJ[wd];
  const order = wd === 6 ? [6, 7, 8, 5, 4, 3] : [d, d - 1, d + 1, d + 2, 3, 4, 5, 6, 7];
  let w; for (const x of order) if (buckets[x]?.length) { w = buckets[x].shift(); break; }
  retos.push(w);
}
const ph = {}; retos.forEach(w => ph[dist[w]] = (ph[dist[w]] || 0) + 1);
console.log('retos:', retos.length, '| únicos:', new Set(retos).size, '| par:', JSON.stringify(ph));
console.log('primeros 14:', retos.slice(0, 14).map(w => `${w}(${dist[w]})`).join(' '));

fs.writeFileSync(path.join(__dirname, '..', 'palabras.js'),
  `// Generado por tools/build.js — no editar a mano.\nwindow.PALABRAS = ${JSON.stringify(words.join(' '))}.split(' ');\nwindow.COMUNES = ${JSON.stringify([...comunes].sort().join(' '))}.split(' ');\nwindow.RETOS = ${JSON.stringify(retos)};\n`);
