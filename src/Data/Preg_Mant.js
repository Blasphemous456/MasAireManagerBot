// src/Data/PreguntasMantenimiento.jsx
export const PreguntasMantenimiento = [
  {
    id: 1,
    text: "Cual opcion describe mejor el estado actual de tu equipo",
    options: [
      { value: "a", label: "Funciona bien y solo requiere mantenimiento preventivo" },
      { value: "b", label: "Ha perdido rendimiento con el tiempo" },
      { value: "c", label: "Presenta ruidos, olores o comportamientos irregulares" }
    ]
  },
  {
    id: 2,
    text: "Cual de estas situaciones se parece mas a tu caso",
    options: [
      { value: "a", label: "Un equipo en uso normal con mantenimineto reciente" },
      { value: "b", label: "Un equipo que ha estado en uso intensivo sin mantenimiento" },
      { value: "c", label: "Un equipo que presenta síntomas de falla y necesita reparación" }
    ]
  },
  {
    id: 3,
    text: "Como necesitas realizar el servicio",
    options: [
      { value: "a", label: "Atencion lo mas pronto posible" },
      { value: "b", label: "Programarlo en los proximos dias" },
      { value: "c", label: "Estoy comparando opciones " }
    ]
  }
];