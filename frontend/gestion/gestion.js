import { api } from '../js/api.js';
const status = document.querySelector('#admin-status');
const table = document.querySelector('#reservations');
const editForm = document.querySelector('#edit-form');

function cell(row, text) { const td = row.insertCell(); td.textContent = text; return td; }
const isCancelled = r => ['cancelled', 'cancelada'].includes(r.status);

async function loadReservations() {
  status.textContent = 'Cargando reservas…';
  try {
    const data = await api('/api/reserves');
    const list = Array.isArray(data) ? data : (data.reserves || []);
    table.replaceChildren();
    for (const r of list) {
      const row = table.insertRow();
      [r.id, r.name, r.date, r.time, r.diners, r.status || 'activa'].forEach(v => cell(row, v));
      const actions = row.insertCell();
      if (!isCancelled(r)) {
        const edit = document.createElement('button');
        edit.type = 'button'; edit.textContent = 'Editar';
        edit.addEventListener('click', () => selectReservation(r));
        const cancel = document.createElement('button');
        cancel.type = 'button'; cancel.textContent = 'Cancelar';
        cancel.addEventListener('click', () => cancelReservation(r.id));
        actions.append(edit, cancel);
      }
    }
    status.textContent = `${list.length} reservas.`;
  } catch (error) { status.textContent = error.message; }
}
function selectReservation(r) {
  for (const k of ['id', 'name', 'date', 'time', 'diners']) editForm.elements[k].value = r[k];
}
async function updateReservation(event) {
  event.preventDefault();
  const f = editForm.elements;
  const body = { name: f.name.value.trim(), date: f.date.value, time: f.time.value, diners: Number(f.diners.value) };
  try {
    await api(`/api/reserves/${encodeURIComponent(f.id.value)}`, { method: 'PUT', body });
    status.textContent = 'Reserva modificada.';
    await loadReservations();
  } catch (error) {
    status.textContent = error.status === 409 ? 'Ese coche ya está reservado a esa hora. Cambia los datos e inténtalo de nuevo.' : error.message;
  }
}
async function cancelReservation(id) {
  if (!confirm(`¿Cancelar la reserva ${id}?`)) return;
  try { await api(`/api/reserves/${encodeURIComponent(id)}`, { method: 'DELETE' }); await loadReservations(); }
  catch (error) { status.textContent = error.message; }
}
document.querySelector('#refresh').addEventListener('click', loadReservations);
editForm.addEventListener('submit', updateReservation);
loadReservations();
