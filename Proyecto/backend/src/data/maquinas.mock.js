export const maquinas = [
  // LOCAL 1
  {
    id: "M001",
    local: "Local 1",
    numero: 1,
    estado: "En espera para revisión",
    ultimaRevision: "2025-11-11" // Próxima revisión vence hoy (2025-12-11)
  },
  {
    id: "M002",
    local: "Local 1",
    numero: 2,
    estado: "Operativa",
    ultimaRevision: "2025-11-21" // Queda a 10 días de su próxima revisión (2025-12-21)
  },
  // LOCAL 2
  {
    id: "M003",
    local: "Local 2",
    numero: 1,
    estado: "En espera para revisión",
    ultimaRevision: "2025-11-11"
  },
  {
    id: "M004",
    local: "Local 2",
    numero: 2,
    estado: "Operativa",
    ultimaRevision: "2025-12-02"
  }
];

// Registro de mantenimientos realizados
export const registroMantenimientos = [];

// Registro de revisiones agendadas
export const revisionesAgendadas = [];