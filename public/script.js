document.addEventListener("DOMContentLoaded", () => {
  const daysContainer = document.querySelector(".dagen"); // Container voor dagen
  const nextBtn = document.querySelector(".next"); // Knop voor volgende maand
  const prevBtn = document.querySelector(".prev"); // Knop voor vorige maand
  const todayBtn = document.querySelector(".today"); // Knop om naar vandaag te gaan
  const month = document.querySelector(".month"); // Element voor huidige maand
  const eventDateInput = document.getElementById('eventDate'); // Input voor geselecteerde datum
  const kalenderSelect = document.getElementById('kalender-select');
  const piketForm = document.getElementById('piket-form');
  const vakantieForm = document.getElementById('vakantie-form');
  const formHeader = document.getElementById('form-header');

  const months = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];

  // Huidige datum ophalen
  const date = new Date();
  let currentMonth = date.getMonth(); // Huidige maand
  let currentYear = date.getFullYear(); // Huidig jaar

  let events = []; // Array om events op te slaan

  // Functie om events op te halen van de server
  const fetchEvents = async () => {
    try {
      const response = await fetch('/events'); // Fetchen van events
      events = await response.json(); // events omzetten naar JSON formaat
      renderCalendar(); // Kalender renderen na het ophalen van events
    } catch (error) {
    }
  };

  // Functie om de kalender te renderen
  const renderCalendar = () => {
    date.setDate(1); // Datum instellen op de eerste dag van de maand
    const firstDayIndex = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Index van de eerste dag van de maand
    const lastDay = new Date(currentYear, currentMonth + 1, 0); // Laatste dag van de huidige maand
    const lastDayIndex = (lastDay.getDay() + 6) % 7; // Index van de laatste dag van de maand
    const lastDayDate = lastDay.getDate(); // Datum van de laatste dag van de maand
    const prevLastDay = new Date(currentYear, currentMonth, 0); // Laatste dag van de vorige maand
    const prevLastDayDate = prevLastDay.getDate(); // Datum van de laatste dag van de vorige maand
    const nextDays = 6 - lastDayIndex; // Aantal dagen van de volgende maand die worden weergegeven

    // Maand en jaar weergeven in de interface
    month.innerHTML = `${months[currentMonth]} ${currentYear}`;
    daysContainer.innerHTML = ""; // Leegmaken van de dagen container

    const dayTemplate = document.getElementById("day-template").content; // Template voor dagen
    const eventTemplate = document.getElementById("event-template").content; // Template voor events

    // Render dagen van de vorige maand
    for (let x = firstDayIndex; x > 0; x--) {
      const prevDayElement = document.importNode(dayTemplate, true).firstElementChild; // Dag element maken vanuit template
      const prevDayDate = prevLastDayDate - x + 1; // Datum van de vorige maand

      prevDayElement.classList.add("prev");
      prevDayElement.querySelector(".datum").textContent = prevDayDate; // Datum toevoegen aan dag element

      // events filteren voor dagen van de vorige maand
      const prevMonthEvents = events.filter(event => {
        const eventDate = new Date(event.date); // Datum van het event
        return (
          eventDate.getUTCDate() === prevDayDate &&
          eventDate.getUTCMonth() === (currentMonth === 0 ? 11 : currentMonth - 1) &&
          eventDate.getUTCFullYear() === (currentMonth === 0 ? currentYear - 1 : currentYear)
        );
      });

      // events renderen in het dag element
      prevMonthEvents.forEach(event => {
        const eventElement = document.importNode(eventTemplate, true).firstElementChild; // event maken vanuit template
        eventElement.querySelector('.event-description').textContent = event.description; // Beschrijving toevoegen aan event

        // Controleren of er een beschrijving is (naam van een persoon)
        if (!event.description) {
          eventElement.classList.add('no-person-assigned'); // Class toevoegen wanneer er geen persoon is geselecteerd
        }

        eventElement.querySelector('.piket-lijn').textContent = event.role; // Rol toevoegen aan event

        prevDayElement.appendChild(eventElement); // event toevoegen aan dag template
      });

      // Bij het klikken op een dag, de geselecteerde datum instellen
      prevDayElement.addEventListener('click', () => {
        const selectedDate = new Date(Date.UTC(currentYear, currentMonth - 1, prevDayDate)).toISOString().split('T')[0]; // Geselecteerde datum omzetten naar ISO
        eventDateInput.value = selectedDate; // Geselecteerde datum toevoegen aan input
      });

      daysContainer.appendChild(prevDayElement); // Dag element toevoegen aan de dagen container
    }

    // Render dagen van de huidige maand
    for (let i = 1; i <= lastDayDate; i++) {
      const currentDayElement = document.importNode(dayTemplate, true).firstElementChild; // Dag element maken vanuit template
      currentDayElement.querySelector(".datum").textContent = i; // Datum toevoegen aan dag template

      // Huidige dag markeren als "vandaag"
      if (
        i === new Date().getDate() &&
        currentMonth === new Date().getMonth() &&
        currentYear === new Date().getFullYear()
      ) {
        currentDayElement.classList.add("today");
      }

      // Bij het klikken op een dag, de geselecteerde datum instellen
      currentDayElement.addEventListener('click', () => {
        const selectedDate = new Date(Date.UTC(currentYear, currentMonth, i)).toISOString().split('T')[0]; // Geselecteerde datum omzetten naar ISO
        eventDateInput.value = selectedDate; // Geselecteerde datum toevoegen aan input
      });

      // events filteren voor dagen van de huidige maand
      const currentMonthEvents = events.filter(event => {
        const eventDate = new Date(event.date); // Datum van het event
        return (
          eventDate.getUTCDate() === i &&
          eventDate.getUTCMonth() === currentMonth &&
          eventDate.getUTCFullYear() === currentYear
        );
      });

      // events renderen in het dag element
      currentMonthEvents.forEach(event => {
        const eventElement = document.importNode(eventTemplate, true).firstElementChild; // event maken vanuit template
        eventElement.querySelector('.event-description').textContent = event.description; // Beschrijving toevoegen aan event

        // Controleren of er een beschrijving is (naam van een persoon)
        if (!event.description) {
          eventElement.classList.add('no-person-assigned'); // Class toevoegen wanneer er geen persoon is geselecteerd
        }

        eventElement.querySelector('.piket-lijn').textContent = event.role; // Rol toevoegen aan event

        currentDayElement.appendChild(eventElement); // event element toevoegen aan dag template
      });

      daysContainer.appendChild(currentDayElement); // Dag element toevoegen aan de dagen container
    }

    // Render dagen van de volgende maand
    for (let j = 1; j <= nextDays; j++) {
      const nextDayElement = document.importNode(dayTemplate, true).firstElementChild; // Dag maken vanuit template
      nextDayElement.classList.add("next"); // Class toevoegen voor als de dag van de volgende maand is
      nextDayElement.querySelector(".datum").textContent = j; // Datum toevoegen aan de dag template

      // Events filteren voor dagen van de volgende maand
      const nextMonthEvents = events.filter(event => {
        const eventDate = new Date(event.date); // Datum van het event
        return (
          eventDate.getUTCDate() === j &&
          eventDate.getUTCMonth() === (currentMonth === 11 ? 0 : currentMonth + 1) &&
          eventDate.getUTCFullYear() === (currentMonth === 11 ? currentYear + 1 : currentYear)
        );
      });

      // events renderen in de dag template
      nextMonthEvents.forEach(event => {
        const eventElement = document.importNode(eventTemplate, true).firstElementChild; // Event maken vanuit template
        eventElement.querySelector('.event-description').textContent = event.description; // Beschrijving toevoegen aan event

        // Controleren of er een beschrijving is (naam van een persoon)
        if (!event.description) {
          eventElement.classList.add('no-person-assigned'); // Class toevoegen wanneer er geen persoon is geselecteerd
        }

        eventElement.querySelector('.piket-lijn').textContent = event.role; // Rol toevoegen aan event

        nextDayElement.appendChild(eventElement); // Event toevoegen aan de dag template
      });

      // Bij het klikken op een dag, de geselecteerde datum instellen
      nextDayElement.addEventListener('click', () => {
        const selectedDate = new Date(Date.UTC(currentYear, currentMonth + 1, j)).toISOString().split('T')[0]; // Geselecteerde datum omzetten naar ISO
        eventDateInput.value = selectedDate; // Geselecteerde datum toevoegen aan input veld
      });

      daysContainer.appendChild(nextDayElement); // Dag element toevoegen aan dagen container
    }

    // "Vandaag" knop uitschakelen als de huidige maand wordt weergegeven
    if (currentMonth === date.getMonth() && currentYear === date.getFullYear()) {
      todayBtn.disabled = true; // Knop uitschakelen
    } else {
      todayBtn.disabled = false; // Knop inschakelen
    }
  };

  // Event listeners voor knoppen voor volgende maand, vorige maand en vandaag
  nextBtn.addEventListener("click", () => {
    currentMonth++; // Naar volgende maand gaan
    if (currentMonth > 11) {
      currentMonth = 0; // Terug naar januari als het einde van het jaar is bereikt
      currentYear++;
    }
    renderCalendar();
  });

  prevBtn.addEventListener("click", () => {
    currentMonth--; // Naar vorige maand gaan
    if (currentMonth < 0) {
      currentMonth = 11; // Terug naar december als het begin van het jaar is bereikt
      currentYear--;
    }
    renderCalendar();
  });

  todayBtn.addEventListener("click", () => {
    currentMonth = date.getMonth(); // Terug naar huidige maand
    currentYear = date.getFullYear(); // Terug naar huidig jaar
    renderCalendar();
  });

  kalenderSelect.addEventListener('change', () => {
    const selectedValue = kalenderSelect.value;
    if (selectedValue === 'vakantie planning') {
      piketForm.style.display = 'none';
      vakantieForm.style.display = 'block';
      formHeader.textContent = 'Plan uw vakantie';
    } else {
      piketForm.style.display = 'block';
      vakantieForm.style.display = 'none';
      formHeader.textContent = 'Plan uw piket';
    }
  });

  fetchEvents(); // events ophalen bij het laden van de pagina
});
