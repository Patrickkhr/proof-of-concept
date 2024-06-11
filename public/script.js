document.addEventListener("DOMContentLoaded", () => {
  const daysContainer = document.querySelector(".dagen");
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");
  const todayBtn = document.querySelector(".today");
  const month = document.querySelector(".month");

  const months = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];

  const date = new Date();
  let currentMonth = date.getMonth();
  let currentYear = date.getFullYear();

  let events = []; // Array om evenementen op te slaan

  const renderCalendar = () => {
    date.setDate(1);
    const firstDayIndex = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Bereken de index van de eerste dag van de maand
    const lastDay = new Date(currentYear, currentMonth + 1, 0); // Laatste dag van de huidige maand
    const lastDayIndex = (lastDay.getDay() + 6) % 7; // Bereken de index van de laatste dag van de maand
    const lastDayDate = lastDay.getDate(); // Datum van de laatste dag van de maand
    const prevLastDay = new Date(currentYear, currentMonth, 0); // Laatste dag van de vorige maand
    const prevLastDayDate = prevLastDay.getDate(); // Datum van de laatste dag van de vorige maand
    const nextDays = 6 - lastDayIndex; // Aantal dagen van de volgende maand om de rij compleet te maken

    month.innerHTML = `${months[currentMonth]} ${currentYear}`; // Toon de huidige maand en jaar

    daysContainer.innerHTML = ""; // Maak de container leeg

    const dayTemplate = document.getElementById("day-template").content;
    const eventTemplate = document.getElementById("event-template").content;

    // Voeg de dagen van de vorige maand toe
    for (let x = firstDayIndex; x > 0; x--) {
      const prevDayElement = document.importNode(dayTemplate, true).firstElementChild;
      prevDayElement.classList.add("prev");
      prevDayElement.querySelector(".datum").textContent = prevLastDayDate - x + 1;
      daysContainer.appendChild(prevDayElement);
    }

    // Voeg de dagen van de huidige maand toe
    for (let i = 1; i <= lastDayDate; i++) {
      const currentDayElement = document.importNode(dayTemplate, true).firstElementChild;
      currentDayElement.querySelector(".datum").textContent = i;
      if (
        i === new Date().getDate() &&
        currentMonth === new Date().getMonth() &&
        currentYear === new Date().getFullYear()
      ) {
        currentDayElement.classList.add("today");
      }

      // Controleer of er een evenement is voor deze dag
      const event = events.find(event => event.date.getDate() === i && event.date.getMonth() === currentMonth && event.date.getFullYear() === currentYear);
      if (event) {
        const eventElement = document.importNode(eventTemplate, true).firstElementChild;
        eventElement.textContent = event.description;
        currentDayElement.appendChild(eventElement);
      }

      daysContainer.appendChild(currentDayElement);
    }

    // Voeg de dagen van de volgende maand toe
    for (let j = 1; j <= nextDays; j++) {
      const nextDayElement = document.importNode(dayTemplate, true).firstElementChild;
      nextDayElement.classList.add("next");
      nextDayElement.querySelector(".datum").textContent = j;
      daysContainer.appendChild(nextDayElement);
    }

    hideTodayBtn(); // Verberg de 'Vandaag' knop indien nodig
  };

  // Event listener voor de volgende knop
  nextBtn.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
  });

  // Event listener voor de vorige knop
  prevBtn.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar();
  });

  // Event listener voor de 'Vandaag' knop
  todayBtn.addEventListener("click", () => {
    currentMonth = date.getMonth();
    currentYear = date.getFullYear();
    renderCalendar();
  });

  // Verberg de 'Vandaag' knop als we in de huidige maand en jaar zijn
  function hideTodayBtn() {
    if (
      currentMonth === new Date().getMonth() &&
      currentYear === new Date().getFullYear()
    ) {
      todayBtn.disabled = true;
    } else {
      todayBtn.disabled = false;
    }
  }

  // Controleer of de elementen voor het toevoegen van evenementen aanwezig zijn
  const eventDateInput = document.getElementById("eventDate");
  const eventDescriptionInput = document.getElementById("eventDescription");
  const roleSelect = document.getElementById("roleSelect");
  const addEventBtn = document.getElementById("addEventBtn");

  if (eventDateInput && eventDescriptionInput && roleSelect && addEventBtn) {
    // Event listener voor de 'Plan piket' knop
    addEventBtn.addEventListener("click", () => {
      const eventDate = new Date(eventDateInput.value);
      const eventDescription = eventDescriptionInput.value;
      const selectedRole = roleSelect.value;

      if (!isNaN(eventDate.getTime()) && eventDescription && selectedRole) { // Controleer of de datum, beschrijving en rol geldig zijn
        const roleText = roleSelect.options[roleSelect.selectedIndex].text; // Haal de naam van de rol op
        events.push({ date: eventDate, description: `${eventDescription}, ${roleText}` });
        renderCalendar(); // Vernieuw de kalender om het nieuwe evenement weer te geven
      }
    });
  }

  renderCalendar(); // Render de kalender bij het laden van de pagina
});
