// data.js
// Este archivo contiene únicamente la lista de medicamentos.
// Para actualizar el horario, solo tienes que editar este archivo.

export const medicationSchedule = [
  { 
    time: "6:00 am", 
    medications: [ 
      { name: "Bromuro de Ipratropio", description: "Broncodilatador", dosage: "3 puffs" }
    ]
  },
  { 
    time: "8:00 am", 
    medications: [ 
      { name: "Omeprazol (Esomeprazol)", description: "Protector gástrico", dosage: "1 pastilla" },
      { name: "Apixaban (Eliquis)", description: "Anticoagulante", dosage: "Dosis 1 de 2" },
      { name: "Metoprolol (Betaloc ZOK)", description: "Antihipertensivo", dosage: "1 pastilla" },
      { name: "Amlodipino", description: "Antihipertensivo", dosage: "1 pastilla" },
      { name: "Colchicina", description: "Gota", dosage: "1 pastilla" },
      { name: "Alopurinol", description: "Ácido úrico", dosage: "1 pastilla" },
      { name: "Aciclovir", description: "Antiviral", dosage: "1 pastilla" },
      { name: "Trimetropim", description: "Antibiótico", dosage: "1 pastilla", days: [0, 2, 4] } // Dom, Mar, Jue
    ]
  },
  { 
    time: "8:45 am", 
    medications: [ 
      { name: "Albisan (Sulfato Oral)", description: "Lavado bucal", dosage: "5cm con jeringa", note: { text: "Aplicar en la boca", level: "regular" } } 
    ]
  },
  { 
    time: "11:00 am", 
    medications: [ 
      { name: "Tiotropio (Spiriva)", description: "Broncodilatador", dosage: "2 puffs" } 
    ]
  },
  { 
    time: "12:30 pm", 
    medications: [ 
      { name: "Sitagliptina + Metformina (Janumet)", description: "Antidiabético", dosage: "1 pastilla" },
      { name: "Vitamina D", description: "Vitamina", dosage: "1 pastilla", note: { text: "Con el almuerzo", level: "regular" } }
    ]
  },
  { 
    time: "1:30 pm", 
    medications: [ 
      { name: "Albisan (Sulfato Oral)", description: "Lavado bucal", dosage: "Aplicar", note: { text: "Lavado bucal", level: "regular" } }
    ]
  },
  { 
    time: "2:00 pm", 
    medications: [ 
      { name: "Bromuro de Ipratropio", description: "Broncodilatador", dosage: "3 puffs" }
    ]
  },
  { 
    time: "8:00 pm", 
    medications: [ 
      { name: "Fluticasona (Relvar)", description: "Corticoide inhalado", dosage: "1 puff" },
      { name: "Apixaban (Eliquis)", description: "Anticoagulante", dosage: "Dosis 2 de 2" }
    ]
  },
  {
    time: "8:45 pm",
    medications: [
      { name: "Albisan (Sulfato Oral)", description: "Lavado bucal", dosage: "Aplicar", note: { text: "Lavado bucal", level: "regular" } }
    ]
  },
  { 
    time: "10:00 pm", 
    medications: [ 
      { name: "Bromuro de Ipratropio", description: "Broncodilatador", dosage: "3 puffs" }
    ]
  }
];
