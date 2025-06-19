// data.js
// Nueva estructura organizada por medicamento para una gestión más sencilla.

export const medicationList = [
  {
    name: "Bromuro de Ipratropio",
    description: "Broncodilatador",
    schedules: [
      { time: "6:00 am", dosage: "3 puffs" },
      { time: "2:00 pm", dosage: "3 puffs" },
      { time: "10:00 pm", dosage: "3 puffs" }
    ]
  },
  {
    name: "Omeprazol (Esomeprazol)",
    description: "Protector gástrico",
    dosage: "1 pastilla",
    schedules: [
      { time: "8:00 am" }
    ]
  },
  {
    name: "Apixaban (Eliquis)",
    description: "Anticoagulante",
    schedules: [
      { time: "8:00 am", dosage: "Dosis 1 de 2" },
      { time: "8:00 pm", dosage: "Dosis 2 de 2" }
    ]
  },
  {
    name: "Metoprolol (Betaloc ZOK)",
    description: "Antihipertensivo",
    dosage: "1 pastilla",
    schedules: [
      { time: "8:00 am" }
    ]
  },
  {
    name: "Amlodipino",
    description: "Antihipertensivo",
    dosage: "1 pastilla",
    schedules: [
      { time: "8:00 am" }
    ]
  },
  {
    name: "Colchicina",
    description: "Gota",
    dosage: "1 pastilla",
    schedules: [
      { time: "8:00 am" }
    ]
  },
  {
    name: "Alopurinol",
    description: "Ácido úrico",
    dosage: "1 pastilla",
    schedules: [
      { time: "8:00 am" }
    ]
  },
  {
    name: "Aciclovir",
    description: "Antiviral",
    dosage: "1 pastilla",
    schedules: [
      { time: "8:00 am" }
    ]
  },
  {
    name: "Trimetropim",
    description: "Antibiótico",
    dosage: "1 pastilla",
    days: [2, 4, 6], // Mar, Jue, Sab
    schedules: [
      { time: "8:00 am" }
    ]
  },
  {
    name: "Albisan (Sulfato Oral)",
    description: "Lavado bucal",
    dosage: "5cm con jeringa",
    note: { text: "Aplicar en la boca", level: "regular" },
    schedules: [
      { time: "8:45 am" },
      { time: "1:30 pm" },
      { time: "8:45 pm" }
    ]
  },
  {
    name: "Tiotropio (Spiriva)",
    description: "Broncodilatador",
    dosage: "2 puffs",
    schedules: [
      { time: "11:00 am" }
    ]
  },
  {
    name: "Sitagliptina + Metformina (Janumet)",
    description: "Antidiabético",
    dosage: "1 pastilla",
    schedules: [
      { time: "12:30 pm" }
    ]
  },
  {
    name: "Vitamina D",
    description: "Vitamina",
    dosage: "1 pastilla",
    note: { text: "Con el almuerzo", level: "regular" },
    schedules: [
      { time: "12:30 pm" }
    ]
  },
  {
    name: "Fluticasona (Relvar)",
    description: "Corticoide inhalado",
    dosage: "1 puff",
    schedules: [
      { time: "8:00 pm" }
    ]
  },
  {
    name: "Loratadina",
    description: "Antihistamínico",
    dosage: "1 pastilla",
    schedules: [
      { time: "8:00 pm" }
    ]
  }
];
