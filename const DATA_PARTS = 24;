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
      <div class="role"
