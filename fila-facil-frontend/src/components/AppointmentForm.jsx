// src/components/AppointmentForm.jsx
import { useState } from "react";

export default function AppointmentForm({ onCreate, loading }) {
  const [form, setForm] = useState({
    name: "",
    serviceType: "Consulta",
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
      <h2 className="card-title">Registrar paciente</h2>

      <label className="field">
        <span>Nome do paciente</span>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Ex: Maria da Silva"
          required
        />
      </label>

      <label className="field">
        <span>Tipo de atendimento</span>
        <select
          name="serviceType"
          value={form.serviceType}
          onChange={handleChange}
        >
          <option>Consulta</option>
          <option>Exame</option>
          <option>Farmácia</option>
          <option>Curativo</option>
          <option>Emergência</option>
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
            Normal
          </label>
          <label>
            <input
              type="radio"
              name="priority"
              value="preferencial"
              checked={form.priority === "preferencial"}
              onChange={handleChange}
            />
            Preferencial (idosos, gestantes...)
          </label>
        </div>
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Registrando..." : "Adicionar à fila"}
      </button>
    </form>
  );
}
