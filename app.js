// JavaScript para el encabezado pegajoso y la actualización de fecha/hora
const header = document.getElementById('mainHeader');
const fullDateSpan = document.getElementById('fullDate');
const fullTimeSpan = document.getElementById('fullTime');
const scrolledDateTimeSpan = document.getElementById('scrolledDateTime');
const addCalendarButton = document.getElementById('addCalendarButton');
const scrollThreshold = 100; // Píxeles después de los cuales el encabezado se encoge

// Nombres de los días de la semana en español para la lógica
const daysOfWeek = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

// Función para actualizar la fecha y hora en el encabezado
function updateDateTime() {
    const now = new Date();
    // Opciones completas para la fecha (ej. "Sábado, 14 de junio")
    const optionsFullDate = { weekday: 'long', day: 'numeric', month: 'long' };
    // Opciones para la hora (ej. "11:30 PM")
    const optionsFullTime = { hour: '2-digit', minute: '2-digit', hour12: true };

    // Opciones para la fecha y hora cuando se hace scroll (ej. "Sáb. 11:30 PM")
    const optionsScrolledDate = { weekday: 'short' }; // Ej. "Sáb."

    // Formatea la fecha y hora para mostrar en el encabezado
    const fullDate = now.toLocaleDateString('es-ES', optionsFullDate);
    const fullTime = now.toLocaleTimeString('es-ES', optionsFullTime);
    const scrolledDate = now.toLocaleDateString('es-ES', optionsScrolledDate);
    const scrolledTime = now.toLocaleTimeString('es-ES', optionsFullTime);

    // Actualiza el contenido de los elementos HTML
    // Capitaliza la primera letra del día de la semana para 'fullDate'
    fullDateSpan.textContent = `${fullDate.charAt(0).toUpperCase() + fullDate.slice(1)}`;
    fullTimeSpan.textContent = fullTime;
    scrolledDateTimeSpan.textContent = `${scrolledDate}. ${scrolledTime}`;

    // Obtiene el día de la semana actual en minúsculas para la comparación con data-days
    const currentDayIndex = now.getDay();
    const currentDay = daysOfWeek[currentDayIndex]; // "lunes", "martes", etc.

    // Aplica la lógica para mostrar/ocultar medicamentos según el día
    applyDaySpecificLogic(currentDay);

    // Resalta el próximo bloque de tiempo de medicamento
    highlightCurrentTimeSlot(now);
}

// Función para aplicar lógica de días específicos a los medicamentos
// Muestra/oculta medicamentos y chips según el día de la semana
function applyDaySpecificLogic(currentDay) {
    document.querySelectorAll('.medication-item[data-days]').forEach(item => {
        const daysAttr = item.getAttribute('data-days');
        const specificDays = daysAttr.split(',').map(day => day.trim());
        const medicationNameElement = item.querySelector('.medication-name');
        let eyebrow = item.querySelector('.day-specific-eyebrow');
        let noTakeChip = item.querySelector('.no-take-chip');

        // Crea el elemento 'eyebrow' si no existe
        if (!eyebrow) {
            eyebrow = document.createElement('span');
            eyebrow.className = 'day-specific-eyebrow hidden';
            item.prepend(eyebrow); // Añadir como primer hijo del item
        }

        // Crea el chip "Hoy no se toma" si no existe
        if (!noTakeChip) {
            noTakeChip = document.createElement('span');
            noTakeChip.className = 'no-take-chip hidden';
            noTakeChip.innerHTML = '<span>🚫</span> Hoy no se toma'; // Incluye el emoji aquí
            medicationNameElement.appendChild(noTakeChip); // Añadir como hijo del nombre del medicamento
        }

        // Formatea la lista de días para mostrar en el 'eyebrow'
        const formattedDays = specificDays.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ');
        eyebrow.innerHTML = `<span>🗓️</span> Tomar: ${formattedDays}`; // Incluye el emoji aquí

        // Muestra el 'eyebrow' ya que es un medicamento de día específico
        eyebrow.classList.remove('hidden');

        // Comprueba si el medicamento se toma hoy
        if (specificDays.includes(currentDay)) {
            // Si hoy se toma: Quita el tachado y oculta el chip "Hoy no se toma"
            medicationNameElement.classList.remove('strikethrough');
            noTakeChip.classList.add('hidden');
        } else {
            // Si hoy NO se toma: Añade el tachado y muestra el chip "Hoy no se toma"
            medicationNameElement.classList.add('strikethrough');
            noTakeChip.classList.remove('hidden');
        }
    });
}

// Función para resaltar el bloque de tiempo "Próximo"
// Identifica el siguiente slot de medicamentos basado en la hora actual y lo resalta visualmente.
function highlightCurrentTimeSlot(now) {
    const timeSlots = document.querySelectorAll('.time-slot');
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    let nextSlot = null;
    let firstSlot = null; // Para el caso de que todas las horas ya hayan pasado (ej. después de medianoche)

    // Primero, reinicia todos los resaltados y oculta los indicadores "Próximo"
    timeSlots.forEach(slot => {
        slot.classList.remove('is-next');
        const nextIndicator = slot.querySelector('.next-indicator');
        if (nextIndicator) {
            nextIndicator.style.display = 'none'; // Ocultar todos los indicadores 'Próximo'
        }
    });

    // Itera sobre los bloques de tiempo para encontrar el próximo
    for (let i = 0; i < timeSlots.length; i++) {
        const slot = timeSlots[i];
        if (!firstSlot) firstSlot = slot; // Guarda el primer slot por si todas las horas ya pasaron

        const timeAttr = slot.getAttribute('data-time'); // Obtiene la hora del atributo data-time (ej. "HH:MM")
        if (timeAttr) {
            const [hours, minutes] = timeAttr.split(':').map(Number);
            const slotTimeInMinutes = hours * 60 + minutes;

            // Si la hora del slot es igual o posterior a la hora actual, lo consideramos el próximo
            if (slotTimeInMinutes >= currentTimeInMinutes) {
                nextSlot = slot;
                break; // Encontramos el próximo slot y salimos del bucle
            }
        }
    }

    // Aplica el resaltado al slot encontrado
    if (nextSlot) {
        nextSlot.classList.add('is-next');
        const nextIndicator = nextSlot.querySelector('.next-indicator');
        if (nextIndicator) {
            nextIndicator.style.display = 'inline-flex'; // Muestra el indicador 'Próximo' para este slot
        }
    } else if (firstSlot) {
        // Si no se encontró ningún slot futuro (es decir, ya pasó la última hora del día),
        // resaltamos el primer slot del día, asumiendo que es el "próximo" del siguiente ciclo.
        firstSlot.classList.add('is-next');
        const nextIndicator = firstSlot.querySelector('.next-indicator');
        if (nextIndicator) {
            nextIndicator.style.display = 'inline-flex'; // Muestra el indicador 'Próximo'
        }
    }
}

// Función para hacer scroll al próximo medicamento resaltado
function scrollToNextMedication() {
    const nextMedicationSlot = document.querySelector('.time-slot.is-next');
    if (nextMedicationSlot) {
        // Hace scroll al elemento, centrándolo en la vista de manera suave.
        // Se mantiene el setTimeout brevemente para permitir que los estilos de highlight se apliquen primero,
        // aunque con CSS transitions rápidas, podría no ser estrictamente necesario.
        setTimeout(() => {
            nextMedicationSlot.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100); // Reducido el tiempo para un scroll más ágil.
    }
}

// *** LÓGICA DE INICIALIZACIÓN DE LA APLICACIÓN ***
// Se ejecuta una vez que el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa la fecha/hora, aplica la lógica de días y resalta el próximo slot
    updateDateTime();
    // Hace scroll al próximo slot al cargar la página
    scrollToNextMedication();
});

// Actualiza la fecha y hora y la lógica de días específicos cada minuto
// Esto mantiene la aplicación actualizada sin recargar la página.
setInterval(updateDateTime, 60000); // Actualiza cada 60 segundos

// Listener de evento de scroll para el comportamiento del encabezado (sticky header)
window.addEventListener('scroll', () => {
    // Si el usuario ha hecho scroll más allá del umbral, añade la clase 'scrolled' al header
    if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
    } else {
        // Si está por encima del umbral, quita la clase 'scrolled'
        header.classList.remove('scrolled');
    }
});

// Event listener para el botón "Añadir al Calendario (iOS)"
addCalendarButton.addEventListener('click', () => {
    console.log('Se hizo clic en Añadir al Calendario (iOS)');

    // Mostrar un mensaje temporal al usuario (reemplazo de alert() para PWAs)
    const messageBox = document.createElement('div');
    messageBox.textContent = 'Funcionalidad de añadir al calendario no implementada en esta demo.';
    messageBox.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--card-background);
        color: var(--text-primary);
        padding: 12px 25px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
        border: 1px solid var(--card-border);
    `;
    document.body.appendChild(messageBox);

    // Animar la aparición y desaparición del mensaje
    setTimeout(() => { messageBox.style.opacity = 1; }, 50); // Muestra el mensaje
    setTimeout(() => {
        messageBox.style.opacity = 0; // Oculta el mensaje
        // Elimina el mensaje del DOM una vez que la transición de opacidad haya terminado
        messageBox.addEventListener('transitionend', () => messageBox.remove());
    }, 3000); // El mensaje permanecerá visible por 3 segundos
});