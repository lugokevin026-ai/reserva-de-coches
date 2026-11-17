// Función auxiliar para llamar al backend con URLs relativas (/api/...).
export async function api(path, options = {}) {
  const opts = { ...options };
  if (opts.body && typeof opts.body !== 'string') {
    opts.body = JSON.stringify(opts.body);
    opts.headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  }
  const response = await fetch(path, opts);
  let data = null;
  if (response.status !== 204) {
    try { data = await response.json(); } catch { data = null; }
  }
  if (!response.ok) {
    const error = new Error((data && data.error) || `Error ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data;
}
