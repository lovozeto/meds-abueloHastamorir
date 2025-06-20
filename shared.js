import { medicationList } from './data.js';

export function timeToMinutes(t) {
  const [h, p] = t.split(' ');
  let [hr, m] = h.split(':').map(Number);
  if (p.toLowerCase() === 'pm' && hr !== 12) hr += 12;
  if (p.toLowerCase() === 'am' && hr === 12) hr = 0;
  return hr * 60 + m;
}

export function generateDayText(d) {
  return d.map(i => ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"][i]).join(', ');
}

export function getColorForNoteLevel(l) {
  return {'critical':'danger','important':'warning'}[l] || 'success';
}

export function processMedicationData(list) {
  const scheduleByTime = {};
  list.forEach(med => {
    med.schedules.forEach(scheduleItem => {
      const time = scheduleItem.time;
      if (!scheduleByTime[time]) {
        scheduleByTime[time] = { time: time, medications: [] };
      }
      const medicationEntry = {
        name: med.name,
        description: med.description,
        dosage: scheduleItem.dosage || med.dosage,
        days: med.days,
        note: med.note
      };
      scheduleByTime[time].medications.push(medicationEntry);
    });
  });
  return Object.values(scheduleByTime).sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
}

export const medicationSchedule = processMedicationData(medicationList);