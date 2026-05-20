// src/Data/PreguntasMantenimiento.jsx
export const PreguntasMantenimiento = [
  {
    id: 1,
    text: "Cual opcion describe mejor tu equipo  ",
    options: [
      { value: "a", label: "Funciona bien y solo requiere mantenimiento preventivo" },
      { value: "b", label: "Ha perdido rendimiento con el tiempo" },
      { value: "c", label: "Presente ruidos, olores o/y comportamientos irregular" }
    ]
  },
  {
    id: 2,
    text: "Cual de estas situaciones se parece mas a tu caso ",
    options: [
      { value: "a", label: "Un equipo en uso normal con mantenimineto reciente " },
      { value: "b", label: "Uno o varios equipos sin manteniminento hace varios meses " },
      { value: "c", label: "Varios equipos que no han recibido mantenimineto en mucho tiempo " }
    ]
  },
  {
    id: 3,
    text: "Como necesitas realizar el servicio",
    options: [
      { value: "a", label: "Atencion lo mas pronto posible " },
      { value: "b", label: "Programarlo en los proximos dias" },
      { value: "c", label: "Estoy comparando opciones " }
    ]
  }
];