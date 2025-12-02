// src/api.js
const API_URL = "http://localhost:4000/api";

async function handleResponse(res) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.error || `Erro na requisição: ${res.status}`;
    throw new Error(message);
  }
  return res.json();
}

export async function fetchAppointments() {
  const res = await fetch(`${API_URL}/appointments`);
  return handleResponse(res);
}

export async function createAppointment(payload) {
  const res = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function updateAppointmentStatus(id, status) {
  const res = await fetch(`${API_URL}/appointments/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  return handleResponse(res);
}

export async function deleteAppointment(id) {
  const res = await fetch(`${API_URL}/appointments/${id}`, {
    method: "DELETE"
  });

  if (!res.ok && res.status !== 204) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.error || `Erro na requisição: ${res.status}`;
    throw new Error(message);
  }

  return true;
}

export async function fetchMetrics() {
  const res = await fetch(`${API_URL}/metrics`);
  return handleResponse(res);
}
