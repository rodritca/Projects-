// Construye palabras.js: diccionario + 365 retos diarios (palabra inicial y par).
// Uso: node tools/build.js
const fs = require('fs');
const path = require('path');

const QUITAR = new Set(`veca voca feca duto buta fuca muca tuca soca suca lusa reca caua cofa gofo hapa hata hart haza huca kepi cadi cefa coje dela deca dena dore doto duce enes eral gora guta haca hico hita jira lera lita loga maco meda medo mino nica pama pane pape peco pilo pode poma pore pota raca reze rena roda rodo rona sace sapa sema sere sita sobe sopo sora sore sura suro tafo tale tama tamo teno toce tola tole tora tore tota tuco tupa tupo ucha vada valo vamo veia vele vira vire viro vise viso vita zopa zopo caze teña taña haña gaña muña cuja cule bale balo bama bufo bula buca buda cañe dana habe tena gaja gago fata fato fico bofe bife cata cate cato cava cave came camo cape mame mamo mime moje mude muse peta pele peno rame rapo reme rimo sace sane sudo sude sume supe tase taso tazo tela tole tona tupe vare vara zafo raye lame lamo lato late lapo lega lene leno leso levo bear dige dasa daza bema bena bara bare bure bosa bogo bubu dema desa dita dosa gaba hayo mosa muca nini opas orba orlo resa yaga yena mari avea avas asio oseo dele dome fara fava fana bela gimo lela pajo poza hare duto amia alia cobo bofo molo rolo vide ceso teso dota boto hozo tape mita romo mema dono mixe`.split(/\s+/));

// Palabras poco comunes: válidas para jugar, pero nunca como palabra inicial.
const NO_INICIO = new Set(`caga cago cagas cagan caca pedo pene puta puto joto teta popo pipi nazi sida`.split(/\s+/));

const raw = fs.readFileSync(path.join(__dirname, 'palabras.txt'), 'utf8');
const words = [...new Set(raw.toLowerCase().split(/\s+/)
  .filter(w => /^[a-zñ]{4}$/.test(w) && !QUITAR.has(w)))].sort();

const set = new Set(words);
const ABC = 'abcdefghijklmnñopqrstuvwxyz';
const neighbors = w => {
  const out = [];
  for (let i = 0; i < 4; i++) for (const c of ABC) {
    if (c === w[i]) continue;
    const n = w.slice(0, i) + c + w.slice(i + 1);
    if (set.has(n)) out.push(n);
  }
  return out;
};

// BFS desde "caca"
const dist = { caca: 0 };
const q = ['caca'];
while (q.length) {
  const w = q.shift();
  for (const n of neighbors(w)) if (!(n in dist)) { dist[n] = dist[w] + 1; q.push(n); }
}

const hist = {};
for (const w of Object.keys(dist)) hist[dist[w]] = (hist[dist[w]] || 0) + 1;
console.log('palabras:', words.length, 'alcanzables:', Object.keys(dist).length, 'por distancia:', hist);

// PRNG determinista para que la lista sea siempre la misma
let seed = 20261117;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

const pool = d => shuffle(Object.keys(dist).filter(w => dist[w] === d && !NO_INICIO.has(w)));
const buckets = {};
for (let d = 3; d <= 15; d++) buckets[d] = pool(d);
// Día 0 = martes 17 nov 2026. Dificultad por día de la semana (0 = domingo).
// Lunes fácil, sábado durísimo.
const OBJ = { 0: 5, 1: 3, 2: 4, 3: 4, 4: 4, 5: 5, 6: 7 };
const retos = [];
for (let i = 0; i < 365; i++) {
  const wd = (2 + i) % 7;
  const d = OBJ[wd];
  const order = wd === 6 ? [7, 8, 6, 9, 10, 11, 5, 4, 3] : [d, d + 1, d - 1, d + 2, d + 3, 3, 4, 5, 6];
  let w;
  for (const x of order) if (buckets[x] && buckets[x].length) { w = buckets[x].shift(); break; }
  retos.push(w);
}
const pars = retos.map(w => dist[w]);
const ph = {}; pars.forEach(p => ph[p] = (ph[p] || 0) + 1);
console.log('retos:', retos.length, 'únicos:', new Set(retos).size, 'par:', ph);

const out = `// Generado por tools/build.js — no editar a mano.\nwindow.PALABRAS = ${JSON.stringify(words.join(' '))}.split(' ');\nwindow.RETOS = ${JSON.stringify(retos)};\n`;
fs.writeFileSync(path.join(__dirname, '..', 'palabras.js'), out);
console.log('primeros 10 días:', retos.slice(0, 10).map((w, i) => `${w}(${pars[i]})`).join(' '));
