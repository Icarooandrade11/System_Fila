// src/App.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [syncing, setSyncing] = useState(true);
  const [globalError, setGlobalError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setGlobalError("");
      setSyncing(true);
      const [apps, m] = await Promise.all([
        fetchAppointments(),
        fetchMetrics()
      ]);
      setAppointments(apps);
      setMetrics(m);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setGlobalError(err.message || "Erro ao carregar dados.");
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadData();
    }, 15000);
    return () => clearInterval(interval);
  }, [loadData]);

  const sortedAppointments = useMemo(() => {
    const priorityOrder = { preferencial: 0, normal: 1 };
    return [...appointments].sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
  }, [appointments]);

  async function handleCreate(formData) {
    try {
      setLoading(true);
      setGlobalError("");
      const created = await createAppointment(formData);
      setAppointments(prev => [...prev, created]);
      const updatedMetrics = await fetchMetrics();
      setMetrics(updatedMetrics);
      setLastUpdated(new Date());
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
      setAppointments(prev => prev.map(a => (a.id === updated.id ? updated : a)));
      const updatedMetrics = await fetchMetrics();
      setMetrics(updatedMetrics);
      setLastUpdated(new Date());
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
      setLastUpdated(new Date());
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Noc-Food • Cozinha ágil</p>
          <h1>Noc-Food</h1>
          <p className="lede">
            Monitor de filas com ritmo de fast-food, inspirado no fluxo do iFood
            e no visual do McDonald’s. Controle pedidos, estados e métricas em
            tempo real.
          </p>
          <div className="chip-row">
            <span className="pill pill-strong">Fluxo express</span>
            <span className="pill pill-soft">Atualização automática</span>
            <span className="pill pill-strong">Experiência Noc-Food</span>
          </div>
          <div className="hero-actions">
            <button
              type="button"
              className="cta"
              onClick={loadData}
              disabled={loading || syncing}
            >
              {syncing ? "Sincronizando..." : "Sincronizar fila"}
            </button>
            <div className="sync-info">
              <span className="sync-dot" aria-hidden />
              {lastUpdated
                ? `Atualizado às ${lastUpdated.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}`
                : "Aguardando primeira sincronização"}
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-title">Dashboard da cozinha</div>
          <MetricCards metrics={metrics} />
          <p className="muted">Dados calculados em tempo real para manter o ritmo.</p>
        </div>
      </header>

      <main className="layout">
        <section className="left-column">
          <AppointmentForm onCreate={handleCreate} loading={loading} />
        </section>

        <section className="right-column">
          {globalError && <div className="error">{globalError}</div>}
          <AppointmentList
            appointments={sortedAppointments}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            loading={loading}
          />
        </section>
      </main>

      <footer className="footer">
        <p>
          Noc-Food — inspirado na velocidade do fast-food, desenvolvido com React
          + Vite e pronto para produção.
        </p>
      </footer>
    </div>
  );
}
