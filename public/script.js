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

  // Array voor het opslaan van evenementen
  let events = [];

  // Functie om evenementen op te halen van de server
  const fetchEvents = async () => {
    try {
      const response = await fetch('/events'); // Haalt de evenementen op van de server
      events = await response.json(); // Slaat de opgehaalde evenementen op
      renderCalendar(); // Roept de functie aan om de kalender te renderen
    } catch (error) {
    }
  };

  const renderCalendar = () => {
    date.setDate(1); // Stelt de datum in op de eerste dag van de maand
    const firstDayIndex = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Berekent de dag van de week van de eerste dag van de maand
    const lastDay = new Date(currentYear, currentMonth + 1, 0); // Berekent de laatste dag van de maand
    const lastDayIndex = (lastDay.getDay() + 6) % 7; // Berekent de dag van de week van de laatste dag van de maand
    const lastDayDate = lastDay.getDate(); // Haalt de datum van de laatste dag van de maand op
    const prevLastDay = new Date(currentYear, currentMonth, 0); // Berekent de laatste dag van de vorige maand
    const prevLastDayDate = prevLastDay.getDate(); // Haalt de datum van de laatste dag van de vorige maand op
    const nextDays = 6 - lastDayIndex; // Berekent het aantal dagen in de volgende maand dat in de huidige kalenderweergave moet worden getoond

    month.innerHTML = `${months[currentMonth]} ${currentYear}`; // Stelt de maand en het jaar in de header in
    daysContainer.innerHTML = "";

    const dayTemplate = document.getElementById("day-template").content;
    const eventTemplate = document.getElementById("event-template").content; 

    // Voeg dagen van de vorige maand toe aan de kalender
    for (let x = firstDayIndex; x > 0; x--) {
      const prevDayElement = document.importNode(dayTemplate, true).firstElementChild; // Maakt een kopie van de dag template
      prevDayElement.classList.add("prev"); // Voegt een class toe aan de dag van de vorige maand
      prevDayElement.querySelector(".datum").textContent = prevLastDayDate - x + 1; // Stelt de datum in
      daysContainer.appendChild(prevDayElement); // Voegt de dag toe aan de container
    }

    // Voeg dagen van de huidige maand toe aan de kalender
    for (let i = 1; i <= lastDayDate; i++) {
      const currentDayElement = document.importNode(dayTemplate, true).firstElementChild; // Maakt een kopie van de dag template
      currentDayElement.querySelector(".datum").textContent = i; // Stelt de datum in

      if (
        i === new Date().getDate() &&
        currentMonth === new Date().getMonth() &&
        currentYear === new Date().getFullYear()
      ) {
        currentDayElement.classList.add("today"); // Voegt een class toe voor de dag van vandaag
      }

      // Filter de evenementen voor de huidige dag
      const dailyEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === i && eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
      });

      // Voeg de evenementen toe aan de dag
      dailyEvents.forEach(event => {
        const eventElement = document.importNode(eventTemplate, true).firstElementChild; // Maakt een kopie van het event template
        eventElement.querySelector('.event-description').textContent = event.description; // Stelt de beschrijving van het evenement in
        eventElement.querySelector('.piket-lijn').textContent = event.role; // Stelt de rol van het evenement in
        currentDayElement.appendChild(eventElement); // Voegt het evenement toe aan de dag
      });

      daysContainer.appendChild(currentDayElement); // Voegt de dag toe aan de container
    }

    // Voeg dagen van de volgende maand toe aan de kalender
    for (let j = 1; j <= nextDays; j++) {
      const nextDayElement = document.importNode(dayTemplate, true).firstElementChild; // Maakt een kopie van de dag template
      nextDayElement.classList.add("next"); // Voegt een class toe aan de dag van de volgende maand
      nextDayElement.querySelector(".datum").textContent = j; // Stelt de datum in
      daysContainer.appendChild(nextDayElement); // Voegt de dag toe aan de container
    }

    hideTodayBtn(); // Verberg of toon de "Vandaag" knop
  };

  // Voeg event listeners toe aan de knoppen
  nextBtn.addEventListener("click", () => {
    currentMonth++; 
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++; 
    }
    renderCalendar(); // Render de kalender opnieuw
  });

  prevBtn.addEventListener("click", () => {
    currentMonth--; 
    if (currentMonth < 0) {
      currentMonth = 11; 
      currentYear--; 
    }
    renderCalendar(); 
  });

  todayBtn.addEventListener("click", () => {
    currentMonth = date.getMonth(); // Zet de maand naar de huidige maand
    currentYear = date.getFullYear(); // Zet het jaar naar het huidige jaar
    renderCalendar(); 
  });

  // Functie om de "Vandaag" knop te verbergen of te tonen
  function hideTodayBtn() {
    if (
      currentMonth === new Date().getMonth() &&
      currentYear === new Date().getFullYear()
    ) {
      todayBtn.disabled = true; // Verberg de knop als we al in de huidige maand en jaar zijn
    } else {
      todayBtn.disabled = false; // Toon de knop als we niet in de huidige maand en jaar zijn
    }
  }

  fetchEvents(); // Haal de evenementen op wanneer de pagina geladen is
});

