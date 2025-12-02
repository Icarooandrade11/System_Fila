// src/components/AppointmentForm.jsx
import { useState } from "react";

export default function AppointmentForm({ onCreate, loading }) {
  const [form, setForm] = useState({
    name: "",
    serviceType: "Combo clássico",
    priority: "normal"
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    await onCreate(form);
    setForm(prev => ({ ...prev, name: "" }));
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="card-header">
        <div>
          <p className="eyebrow">Nova comanda</p>
          <h2 className="card-title">Abrir pedido Noc-Food</h2>
        </div>
        <p className="muted">Cadastre clientes e mantenha a cozinha no ritmo.</p>
      </div>

      <label className="field">
        <span>Nome do cliente</span>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Ex: Camila - Combo Big Noc"
          required
        />
      </label>

      <label className="field">
        <span>Tipo de pedido</span>
        <select
          name="serviceType"
          value={form.serviceType}
          onChange={handleChange}
        >
          <option>Combo clássico</option>
          <option>Sobremesa gelada</option>
          <option>Linha signature</option>
          <option>Acompanhamentos</option>
          <option>Entrega prioritária</option>
        </select>
      </label>

      <label className="field">
        <span>Prioridade</span>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="priority"
              value="normal"
              checked={form.priority === "normal"}
              onChange={handleChange}
            />
            Padrão
          </label>
          <label>
            <input
              type="radio"
              name="priority"
              value="preferencial"
              checked={form.priority === "preferencial"}
              onChange={handleChange}
            />
            Preferencial (prioridade máxima)
          </label>
        </div>
      </label>

      <button type="submit" className="cta" disabled={loading}>
        {loading ? "Enviando..." : "Disparar pedido"}
      </button>
    </form>
  );
}
