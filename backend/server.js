// server.js
import express from "express";
import cors from "cors";
import { nanoid } from "nanoid";

const app = express();
const PORT = 4000;

// Middlewares básicos
app.use(cors());
app.use(express.json());

// "Banco de dados" em memória
const appointments = [];

// Função utilitária para métricas simples
function buildMetrics() {
  const total = appointments.length;
  const open = appointments.filter(a => a.status === "aguardando").length;
  const done = appointments.filter(a => a.status === "atendido").length;

  // Cálculo bem simples de tempo médio estimado (só pra DEMO)
  // Exemplo: 4 minutos para cada paciente aguardando.
  const estimatedAvgWaitMinutes = open * 4;

  return {
    totalAppointments: total,
    openAppointments: open,
    doneAppointments: done,
    estimatedAvgWaitMinutes
  };
}

// Healthcheck
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Listar atendimentos
app.get("/api/appointments", (req, res) => {
  // Ordena: prioridade primeiro (preferencial > normal) + hora de criação
  const sorted = [...appointments].sort((a, b) => {
    const priorityOrder = { preferencial: 0, normal: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  res.json(sorted);
});

// Criar atendimento
app.post("/api/appointments", (req, res) => {
  const { name, serviceType, priority } = req.body;

  if (!name || !serviceType) {
    return res.status(400).json({ error: "Nome e tipo de atendimento são obrigatórios." });
  }

  const newAppointment = {
    id: nanoid(),
    name,
    serviceType,
    priority: priority === "preferencial" ? "preferencial" : "normal",
    status: "aguardando", // aguardando | atendendo | atendido | cancelado
    createdAt: new Date().toISOString()
  };

  appointments.push(newAppointment);

  res.status(201).json(newAppointment);
});

// Atualizar status
app.patch("/api/appointments/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["aguardando", "atendendo", "atendido", "cancelado"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Status inválido." });
  }

  const appointment = appointments.find(a => a.id === id);

  if (!appointment) {
    return res.status(404).json({ error: "Atendimento não encontrado." });
  }

  appointment.status = status;

  res.json(appointment);
});

// Remover atendimento
app.delete("/api/appointments/:id", (req, res) => {
  const { id } = req.params;
  const index = appointments.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Atendimento não encontrado." });
  }

  appointments.splice(index, 1);

  res.status(204).send();
});

// Métricas
app.get("/api/metrics", (req, res) => {
  res.json(buildMetrics());
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`FilaFácil backend rodando em http://localhost:${PORT}`);
});
