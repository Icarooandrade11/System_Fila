// src/components/AppointmentList.jsx
const statusLabels = {
  aguardando: "Na fila",
  atendendo: "Em preparo",
  atendido: "Finalizado",
  cancelado: "Cancelado"
};

const priorityLabels = {
  preferencial: "Prioritário",
  normal: "Padrão"
};

function formatTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function AppointmentList({
  appointments = [],
  onStatusChange,
  onDelete,
  loading
}) {
  const hasAppointments = appointments.length > 0;

  return (
    <div className="card queue-card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Expedição Noc-Food</p>
          <h2 className="card-title">Pedidos em andamento</h2>
        </div>
        <div className="pill pill-soft">{appointments.length} pedidos</div>
      </div>

      {hasAppointments ? (
        <ul className="order-list">
          {appointments.map(order => (
            <li className="order-card" key={order.id}>
              <div className="order-info">
                <div className="order-header">
                  <div className="order-name">{order.name}</div>
                  <div className="pill-row">
                    <span
                      className={`pill ${order.priority === "preferencial" ? "pill-priority" : "pill-soft"}`}
                    >
                      {priorityLabels[order.priority] || order.priority}
                    </span>
                    <span className={`pill status-${order.status}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                </div>

                <p className="order-service">{order.serviceType}</p>
                <p className="order-meta">
                  Criado às <strong>{formatTime(order.createdAt)}</strong>
                </p>
              </div>

              <div className="order-actions">
                <label className="field inline-field">
                  <span>Status</span>
                  <select
                    value={order.status}
                    onChange={e => onStatusChange(order.id, e.target.value)}
                    disabled={loading}
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option value={value} key={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="action-buttons">
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => onDelete(order.id)}
                    disabled={loading}
                  >
                    Remover
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <p>Nenhum pedido na fila. A cozinha Noc-Food está pronta!</p>
        </div>
      )}
    </div>
  );
}
