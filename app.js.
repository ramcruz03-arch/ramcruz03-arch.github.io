'use strict';

const FESTIVALS = [
  ['Oct – Nov', 'Skanda Sashti', "Six days marking Murugan's victory over Surapadman, culminating in Soorasamharam. Most vividly observed at Tiruchendur."],
  ['Jan – Feb', 'Thaipusam', 'Devotees carry kavadi in fulfilment of vows, especially at Palani.'],
  ['Mar – Apr', 'Panguni Uthiram', "Celebrates Murugan's marriage to Deivanai."],
  ['May – Jun', 'Vaikasi Visakam', "Marks Murugan's birth star, observed grandly at Swamimalai and Tiruchendur."],
  ['Weekly', 'Kandha Sashti Kavasam day', 'Many devotees set aside a fixed weekday for reciting protective verses and temple visits.']
];

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

// --- favourites (device-local) ---
const FAV_KEY = 'murugan.favs';
let favs = new Set();
try { favs = new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]')); } catch (e) {}
const saveFavs = () => {
  try { localStorage.setItem(FAV_KEY, JSON.stringify([...favs])); } catch (e) {}
};

let DATA = null;

// --- accordion helper ---
function accordion(title, bodyHtml, extraHeader) {
  const el = document.createElement('div');
  el.className = 'acc';
  el.tabIndex = 0;
  el.setAttribute('role', 'button');
  el.innerHTML =
    `<div class="row"><h3>${title}</h3><div>${extraHeader || ''}<span class="arrow">›</span></div></div>` +
    `<div class="body">${bodyHtml}</div>`;
  const toggle = () => el.classList.toggle('open');
  el.addEventListener('click', ev => { if (!ev.target.closest('.star')) toggle(); });
  el.addEventListener('keydown', ev => {
    if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); toggle(); }
  });
  return el;
}

// --- renderers ---


function renderLives() {
  $('lives').innerHTML = (DATA.stories || []).map(s => `
    <div class="card life">
      <h3>${esc(s.name)}</h3>
      <div class="who">${esc(s.tamil)}</div>
      <div class="when">${esc(s.when)}</div>
      <div class="role">${esc(s.role)}</div>
      ${s.body.map(p => `<p>${esc(p).replace(/\*(.+?)\*/g, '<em>$1</em>')}</p>`).join('')}
    </div>`).join('');
}

function renderTexts() {
  const host = $('texts');
  host.innerHTML = '';
  (DATA.texts || []).forEach(t => {
    const card = document.createElement('div');
    card.className = 'card life';
    card.innerHTML = `
      <h3>${esc(t.name)}</h3>
      <div class="who">${esc(t.tamil)}</div>
      <div class="who2">${esc(t.who)}</div>
      <div class="role">${esc(t.note)}</div>
      ${t.body.map(p => `<p>${esc(p).replace(/\*(.+?)\*/g, '<em>$1</em>')}</p>`).join('')}
      ${t.structure ? `<p class="struct">${esc(t.structure)}</p>` : ''}`;
    host.appendChild(card);

    if (t.sections && t.sections.length) {
      const body = t.sections.map(s => `
        <div class="ksec">
          <div class="khead">${esc(s.heading)}</div>
          <div class="knote">${esc(s.note)}</div>
          <div class="verse">${esc(s.verse).replace(/\n/g, '<br>')}</div>
        </div>`).join('') +
        (t.textnote ? `<p class="struct">${esc(t.textnote)}</p>` : '');
      const acc = accordion(`Read the full text &middot; ${t.sections.length} sections`, body);
      acc.classList.add('fulltext');
      host.appendChild(acc);
    }
  });
}

function renderSangam() {
  $('sangam').innerHTML = (DATA.sangam || []).map(s => `
    <div class="card life">
      <h3>${esc(s.name)}</h3>
      <div class="who">${esc(s.tamil)}</div>
      <div class="when">${esc(s.when)}</div>
      <p>${esc(s.body).replace(/\*(.+?)\*/g, '<em>$1</em>')}</p>
    </div>`).join('');
}

function renderVenues(query) {
  const q = (query || '').trim().toLowerCase();
  const host = $('venues');
  const list = (DATA.venues || []).filter(v =>
    !q || v.ta.toLowerCase().includes(q) || v.en.toLowerCase().includes(q));
  $('venue-count').textContent = (DATA.venues || []).length + ' places in the corpus.';
  host.innerHTML = list.length
    ? list.map(v => `<div class="venue"><span class="ta">${esc(v.ta)}</span><span class="en">${esc(v.en)}</span></div>`).join('')
    : '<div class="empty">No places match that search.</div>';
}

function renderWorld() {
  $('world').innerHTML = (DATA.worldTemples || []).map(t => `
    <div class="card">
      <h3>${esc(t.name)}</h3>
      <div class="meta">${esc(t.place)}</div>
      <p>${esc(t.note)}</p>
    </div>`).join('');
}


let CREDITS = {};

function applyCredits() {
  document.querySelectorAll('[data-credit-for]').forEach(el => {
    const c = CREDITS[el.dataset.creditFor];
    if (!c) { el.remove(); return; }
    const lic = c.licence_url
      ? `<a href="${esc(c.licence_url)}" target="_blank" rel="noopener">${esc(c.licence)}</a>`
      : esc(c.licence);
    el.innerHTML = `${esc(c.author)} &middot; ${lic}` +
      (c.source ? ` &middot; <a href="${esc(c.source)}" target="_blank" rel="noopener">source</a>` : '');
  });
}

function renderAbodes() {
  $('abodes').innerHTML = DATA.abodes.map(a => `
    <div class="card">
      ${a.photo ? `<figure class="shot">
          <img src="./${esc(a.photo)}" alt="${esc(a.name)} temple" loading="lazy"
               onerror="this.closest('figure').remove()">
          <figcaption data-credit-for="${esc(a.photo.split('/').pop())}"></figcaption>
        </figure>` : ''}
      <div class="num">${esc(a.num)}</div>
      <h3>${esc(a.name)}</h3>
      <div class="tname tamil">${esc(a.tamil)}</div>
      <div class="meta">${esc(a.meta)}</div>
      <p>${esc(a.desc)}</p>
      <span class="tag">${esc(a.tag)}</span>
    </div>`).join('');
}

function renderSongs(query) {
  const q = (query || '').trim().toLowerCase();
  const host = $('song-index');
  host.innerHTML = '';
  let shown = 0;

  DATA.templeIndex.forEach(group => {
    const hitTemple = group.temple.toLowerCase().includes(q);
    const songs = q && !hitTemple
      ? group.songs.filter(s => s.t.toLowerCase().includes(q) || String(s.n) === q ||
                                (s.verse && s.verse.toLowerCase().includes(q)))
      : group.songs;
    if (!songs.length) return;
    shown += songs.length;

    const body = songs.map(s => {
      if (!s.verse) {
        return `<div class="songline tamil"><span class="idx">${s.n}</span>${esc(s.t)}</div>`;
      }
      const meta = [s.raga && 'Raga: ' + s.raga, s.thalam && 'Thalam: ' + s.thalam]
        .filter(Boolean).map(esc).join(' &middot; ');
      return `<div class="songfull">
          <div class="songline tamil" style="border:none;background:none;padding:0 0 8px">
            <span class="idx">${s.n}</span>${esc(s.t)}${starBtn('tp-' + s.n)}
          </div>
          ${meta ? `<div class="songmeta">${meta}</div>` : ''}
          <div class="verse">${esc(s.verse).replace(/\n/g, '<br>')}</div>
          ${s.summary ? `<div class="meaning">${esc(s.summary)}</div>` : ''}
        </div>`;
    }).join('');
    const el = accordion(esc(group.temple), `<p class="meaning">${songs.length} songs</p>${body}`);
    if (q) el.classList.add('open');
    host.appendChild(el);
  });

  if (!shown) host.innerHTML = '<div class="empty">No songs match that search.</div>';
}

function verseBody(v) {
  return `<div class="verse">${esc(v.tamil).replace(/\n/g, '<br>')}</div>` +
         `<div class="meaning">${esc(v.meaning)}</div>`;
}

function starBtn(id) {
  const on = favs.has(id) ? ' on' : '';
  return `<button class="star${on}" data-fav="${id}" aria-label="Save verse">★</button>`;
}

function renderAnubhuti(query) {
  const q = (query || '').trim().toLowerCase();
  const host = $('anu-list');
  host.innerHTML = '';
  let shown = 0;

  DATA.anubhuti.forEach((v, i) => {
    const n = i + 1;
    if (q && !v.tamil.toLowerCase().includes(q) &&
             !v.meaning.toLowerCase().includes(q) &&
             String(n) !== q) return;
    shown++;
    const el = accordion(`Verse ${n}`, verseBody(v), starBtn('anu-' + n));
    if (q) el.classList.add('open');
    host.appendChild(el);
  });

  if (!shown) host.innerHTML = '<div class="empty">No verses match that search.</div>';
}

function renderSaved() {
  const host = $('saved-list');
  host.innerHTML = '';
  const ids = [...favs];
  if (!ids.length) {
    host.innerHTML = '<div class="empty">Nothing saved yet. Tap the \u2605 on any verse.</div>';
    return;
  }
  const songByNum = {};
  DATA.templeIndex.forEach(g => g.songs.forEach(s => { songByNum[s.n] = s; }));

  ids.filter(id => id.startsWith('anu-'))
     .sort((a, b) => +a.slice(4) - +b.slice(4))
     .forEach(id => {
       const n = +id.slice(4);
       const v = DATA.anubhuti[n - 1];
       if (!v) return;
       host.appendChild(accordion(`Anubhuti \u00b7 Verse ${n}`, verseBody(v), starBtn(id)));
     });

  ids.filter(id => id.startsWith('tp-'))
     .sort((a, b) => +a.slice(3) - +b.slice(3))
     .forEach(id => {
       const n = +id.slice(3);
       const s = songByNum[n];
       if (!s) return;
       const body = (s.verse ? `<div class="verse">${esc(s.verse).replace(/\n/g, '<br>')}</div>` : '') +
                    (s.summary ? `<div class="meaning">${esc(s.summary)}</div>` : '');
       host.appendChild(accordion(`Thiruppugazh \u00b7 ${n}`, body, starBtn(id)));
     });
}

function renderFestivals() {
  $('festivals').innerHTML = FESTIVALS.map(([when, name, desc]) => `
    <div class="fest">
      <div class="when">${esc(when)}</div>
      <div><h4>${esc(name)}</h4><p>${esc(desc)}</p></div>
    </div>`).join('');
}

// --- favourite toggling (delegated) ---
document.addEventListener('click', ev => {
  const btn = ev.target.closest('.star');
  if (!btn) return;
  ev.stopPropagation();
  const id = btn.dataset.fav;
  if (favs.has(id)) favs.delete(id); else favs.add(id);
  saveFavs();
  document.querySelectorAll(`.star[data-fav="${id}"]`)
          .forEach(b => b.classList.toggle('on', favs.has(id)));
  renderSaved();
});

// --- tabs ---
$('nav').addEventListener('click', ev => {
  const btn = ev.target.closest('.tab-btn');
  if (!btn) return;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('main section').forEach(s => s.classList.remove('active'));
  btn.classList.add('active');
  $(btn.dataset.tab).classList.add('active');
  if (btn.dataset.tab === 'saved') renderSaved();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- search (debounced) ---
function debounce(fn, ms) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}
$('song-search').addEventListener('input', debounce(e => renderSongs(e.target.value), 150));
$('anu-search').addEventListener('input', debounce(e => renderAnubhuti(e.target.value), 150));

// --- boot ---
fetch('./data.json')
  .then(r => {
    if (!r.ok) throw new Error('data.json ' + r.status);
    return r.json();
  })
  .then(d => {
    DATA = d;
    renderAbodes();
    renderVenues('');
    renderWorld();
    renderLives();
    renderTexts();
    renderSangam();
    renderSongs('');
    renderAnubhuti('');
    renderSaved();
    renderFestivals();
    return fetch('./art/photos/credits.json')
      .then(r => r.ok ? r.json() : {})
      .then(c => { CREDITS = c; applyCredits(); })
      .catch(() => applyCredits());
  })
  .catch(err => {
    console.error(err);
    $('abodes').innerHTML =
      '<div class="empty">Content could not load. Check your connection and reload.</div>';
  });

$('temple-subnav').addEventListener('click', ev => {
  const btn = ev.target.closest('.sub-btn');
  if (!btn) return;
  $('temple-subnav').querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tview').forEach(v => v.classList.remove('active'));
  btn.classList.add('active');
  $('view-' + btn.dataset.view).classList.add('active');
});

$('story-subnav').addEventListener('click', ev => {
  const btn = ev.target.closest('.sub-btn');
  if (!btn) return;
  $('story-subnav').querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.sview').forEach(v => v.classList.remove('active'));
  btn.classList.add('active');
  $('view-' + btn.dataset.view).classList.add('active');
});

$('venue-search').addEventListener('input', debounce(e => renderVenues(e.target.value), 150));

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(e => console.warn('SW:', e));
  });
  }
