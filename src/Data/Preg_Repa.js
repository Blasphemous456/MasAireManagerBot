// src/Data/PreguntasReparacion.jsx
export const PreguntasReparacion = [
  {
    id: 1,
    text: "Cual opcion describe mejor lo que le pasa a tu equipo",
    options: [
      { value: "a", label: "No enfria correctamente " },
      { value: "b", label: "Presenta fugas, ruidos y/o comportamientos extraños " },
      { value: "c", label: " No enciende o dejo de funcionar " }
    ]
  },
  {
    id: 2,
    text: "Como ha evolucionado el problema ",
    options: [
      { value: "a", label: "Aparecio recientemente " },
      { value: "b", label: "Ha estado ocurriendo de forma intermitente " },
      { value: "c", label: "Lleva tiempo y ha empeorado " }
    ]
  },
  {
    id: 3,
    text: "Cual opcion describe mejor el funcionamiento actual ",
    options: [
      { value: "a", label: " Funciona correctamente  " },
      { value: "b", label: "Funciona de forma inestable y con fallas " },
      { value: "c", label: " No funciona en absoluto " }
    ]
  }
];