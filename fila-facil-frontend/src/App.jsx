// src/App.jsx
import { useEffect, useState } from "react";
import {
  fetchAppointments,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  fetchMetrics
} from "./api.js";
import AppointmentForm from "./components/AppointmentForm.jsx";
import AppointmentList from "./components/AppointmentList.jsx";
import MetricCards from "./components/MetricCards.jsx";

export default function App() {
  const [appointments, setAppointments] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  async function loadData() {
    try {
      setGlobalError("");
      const [apps, m] = await Promise.all([
        fetchAppointments(),
        fetchMetrics()
      ]);
      setAppointments(apps);
      setMetrics(m);
    } catch (err) {
      console.error(err);
      setGlobalError(err.message || "Erro ao carregar dados.");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreate(formData) {
    try {
      setLoading(true);
      setGlobalError("");
      const created = await createAppointment(formData);
      setAppointments(prev => [...prev, created]);
      const updatedMetrics = await fetchMetrics();
      setMetrics(updatedMetrics);
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id, status) {
    try {
      setLoading(true);
      setGlobalError("");
      const updated = await updateAppointmentStatus(id, status);
      setAppointments(prev =>
        prev.map(a => (a.id === updated.id ? updated : a))
      );
      const updatedMetrics = await fetchMetrics();
      setMetrics(updatedMetrics);
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      setLoading(true);
      setGlobalError("");
      await deleteAppointment(id);
      setAppointments(prev => prev.filter(a => a.id !== id));
      const updatedMetrics = await fetchMetrics();
      setMetrics(updatedMetrics);
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <div>
          <h1>FilaFácil</h1>
          <p>
            Gestão simples e inteligente de filas para postos de saúde. Menos
            caos na recepção, mais respeito ao tempo do paciente.
          </p>
          <ul className="hero-list">
            <li>Organiza fila por prioridade + ordem de chegada</li>
            <li>Mostra tempo médio de espera estimado</li>
            <li>Pronto para ser ampliado para TVs, apps e painéis</li>
          </ul>
        </div>
        <div className="hero-highlight">
          <span>Demo em tempo real</span>
          <strong>Cadastre pacientes e veja a fila mudar na hora.</strong>
        </div>
      </header>

      <main className="layout">
        <section className="left-column">
          <AppointmentForm onCreate={handleCreate} loading={loading} />
          <MetricCards metrics={metrics} />
        </section>

        <section className="right-column">
          {globalError && <div className="error">{globalError}</div>}
          <AppointmentList
            appointments={appointments}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            loading={loading}
          />
        </section>
      </main>

      <footer className="footer">
        <p>
          Protótipo FilaFácil – desenvolvido em React + Vite (frontend) e
          Node.js + Express (backend).
        </p>
      </footer>
    </div>
  );
}
