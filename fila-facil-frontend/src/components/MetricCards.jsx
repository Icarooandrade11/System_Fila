// src/components/MetricCards.jsx

export default function MetricCards({ metrics }) {
  const {
    totalAppointments = 0,
    openAppointments = 0,
    doneAppointments = 0,
    estimatedAvgWaitMinutes = 0
  } = metrics || {};

  const cards = [
    {
      label: "Pedidos do dia",
      value: totalAppointments,
      tone: "amber",
      hint: "Acompanhando o volume total de tickets"
    },
    {
      label: "Na fila",
      value: openAppointments,
      tone: "red",
      hint: "Pedidos aguardando produção"
    },
    {
      label: "Finalizados",
      value: doneAppointments,
      tone: "green",
      hint: "Já entregues ao cliente"
    },
    {
      label: "Espera média",
      value: `${estimatedAvgWaitMinutes} min`,
      tone: "dark",
      hint: "Estimativa com base na fila"
    }
  ];

  return (
    <div className="metrics-grid">
      {cards.map(card => (
        <div className={`metric-card accent-${card.tone}`} key={card.label}>
          <span>{card.label}</span>
          <strong>{card.value}</strong>
          <small>{card.hint}</small>
        </div>
      ))}
    </div>
  );
}
