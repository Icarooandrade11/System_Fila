// src/components/MetricCards.jsx

export default function MetricCards({ metrics }) {
  const {
    totalAppointments = 0,
    openAppointments = 0,
    doneAppointments = 0,
    estimatedAvgWaitMinutes = 0
  } = metrics || {};

  return (
    <div className="metrics">
      <div className="metric-card">
        <span>Total do dia</span>
        <strong>{totalAppointments}</strong>
      </div>
      <div className="metric-card">
        <span>Na fila</span>
        <strong>{openAppointments}</strong>
      </div>
      <div className="metric-card">
        <span>Atendidos</span>
        <strong>{doneAppointments}</strong>
      </div>
      <div className="metric-card">
        <span>Espera média estimada</span>
        <strong>{estimatedAvgWaitMinutes} min</strong>
      </div>
    </div>
  );
}
