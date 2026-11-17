import { api } from './api.js';

const bookingForm = document.querySelector('#booking-form');
const bookingStatus = document.querySelector('#booking-status');
const chatForm = document.querySelector('#chat-form');
const chatStatus = document.querySelector('#chat-status');
const messages = document.querySelector('#messages');
let conversationId = null;
let availabilityRequest = 0;

function setStatus(el, text, kind = '') { el.textContent = text; el.className = kind; }

async function loadBusiness() {
  try {
    const config = await api('/api/config');
    const min = config.minDate || config.today || config.fechaMinima;
    if (min) bookingForm.elements.date.min = min;
    const max = config.maxDiners || config.max;
    if (max) bookingForm.elements.diners.max = max;
  } catch (error) {
    setStatus(bookingStatus, 'No se pudo cargar la configuración del negocio.', 'error');
  }
}

async function loadAvailability() {
  const select = bookingForm.elements.time;
  const date = bookingForm.elements.date.value;
  const request = ++availabilityRequest;
  select.innerHTML = '';
  select.disabled = true;
  if (!date) { select.add(new Option('Elige primero una fecha', '')); return; }
  setStatus(bookingStatus, 'Cargando disponibilidad…');
  try {
    const data = await api(`/api/disponibilitat?fecha=${encodeURIComponent(date)}`);
    if (request !== availabilityRequest) return; // respuesta de una fecha anterior
    const list = Array.isArray(data) ? data : (data.slots || data.disponibles || []);
    const free = list.filter(s => typeof s === 'string' || s.available !== false)
                     .map(s => typeof s === 'string' ? s : (s.time || s.hora));
    if (!free.length) {
      select.add(new Option('Sin horas libres', ''));
      setStatus(bookingStatus, 'No hay horas libres ese día.');
      return;
    }
    select.add(new Option('Elige una hora', ''));
    free.forEach(t => select.add(new Option(t, t)));
    select.disabled = false;
    setStatus(bookingStatus, '');
  } catch (error) {
    if (request === availabilityRequest) setStatus(bookingStatus, error.message, 'error');
  }
}

async function submitReservation(event) {
  event.preventDefault();
  const button = bookingForm.querySelector('button');
  const f = bookingForm.elements;
  const body = { name: f.name.value.trim(), date: f.date.value, time: f.time.value, diners: Number(f.diners.value) };
  button.disabled = true;
  setStatus(bookingStatus, 'Enviando reserva…');
  try {
    await api('/api/reserves', { method: 'POST', body });
    setStatus(bookingStatus, `Reserva confirmada para ${body.date} a las ${body.time}.`, 'ok');
    bookingForm.reset();
    await loadAvailability();
  } catch (error) {
    setStatus(bookingStatus, error.message, 'error');
    if (error.status === 409) await loadAvailability();
  } finally {
    button.disabled = false;
  }
}

function addMessage(text, kind) {
  const p = document.createElement('p');
  p.className = `msg ${kind}`;
  p.textContent = text; // nunca HTML sin escapar
  messages.append(p);
  messages.scrollTop = messages.scrollHeight;
}

async function sendMessage(event) {
  event.preventDefault();
  const button = chatForm.querySelector('button');
  const input = chatForm.elements.message;
  const message = input.value.trim();
  if (!message || button.disabled) return;
  addMessage(message, 'user');
  input.value = '';
  button.disabled = true;
  setStatus(chatStatus, 'El asistente está escribiendo…');
  try {
    const data = await api('/api/chat', { method: 'POST', body: { message, conversationId } });
    conversationId = data.conversationId ?? conversationId;
    addMessage(data.reply || data.message || '(sin respuesta)', 'bot');
    setStatus(chatStatus, '');
  } catch (error) {
    const text = error.status === 503 ? 'El asistente no está disponible ahora. Puedes usar el formulario de reserva.' : error.message;
    addMessage(text, 'error');
    setStatus(chatStatus, '');
  } finally {
    button.disabled = false;
    input.focus();
  }
}

addMessage('¡Hola! Soy el asistente de KYNIC. ¿Qué día y a qué hora quieres recoger el coche, y por cuántas horas lo usarás?', 'bot');
bookingForm.elements.date.addEventListener('change', loadAvailability);
bookingForm.addEventListener('submit', submitReservation);
chatForm.addEventListener('submit', sendMessage);
loadBusiness();

// Logo y menú: el logo lleva al inicio y el menú marca la sección visible.
const links = [...document.querySelectorAll('nav a[href^="#"]')];
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) {
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
  }
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach(s => observer.observe(s));
document.querySelectorAll('img[src$="kynic-logo.png"]').forEach(img =>
  img.addEventListener('error', () => { img.replaceWith(Object.assign(document.createElement('strong'), { textContent: 'KYNIC' })); }));
