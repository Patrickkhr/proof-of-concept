// 1. Opzetten van de webserver

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Stel het basis endpoint in
const apiUrl = "https://fdnd-agency.directus.app/items/"

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
// View engine zorgt ervoor dat data die je ophaalt uit de api, waar je in je code dingen mee doet, daar html van maakt
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))

// Zorg dat werken met request data makkelijker wordt
app.use(express.urlencoded({ extended: true }));

// Maak een array om de evenementen op te slaan
let events = [];

// Functie om evenementen voor het hele jaar te genereren
const generateYearlyEvents = () => {
  const roles = ['1', '2', '3', '4', '5'];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      for (const role of roles) {
        events.push({
          date: new Date(currentYear, month, day).toISOString().split('T')[0],
          description: '',
          role: role
        });
      }
    }
  }
};

// Genereer evenementen voor het jaar bij serverstart
generateYearlyEvents();

/*** Routes & data ***/

// Maak een GET route voor de index
app.get('/', function(request, response) {
  response.render('index')
})

// Maak een GET route voor het overzicht
app.get('/overzicht', function(request, response) {
  Promise.all([
    fetchJson('https://fdnd-agency.directus.app/items/anwb_persons'),
    fetchJson('https://fdnd-agency.directus.app/items/anwb_roles')
  ]).then(([personData, roleData]) => {
    response.render('overzicht', {
      person: personData.data,
      role: roleData.data
    })
  });
})

// GET route voor het ophalen van events
app.get('/events', (req, res) => {
  res.json(events);
});

// POST route voor het opslaan van nieuwe events
app.post('/plan_piket', (req, res) => {
  const { eventDate, eventDescription, roleSelect } = req.body;

  // Vind het evenement en werk de beschrijving en rol bij
  const eventIndex = events.findIndex(event => event.date === eventDate && event.role === roleSelect);
  if (eventIndex !== -1) {
    events[eventIndex].description = eventDescription;
  } else {
    const newEvent = { date: eventDate, description: eventDescription, role: roleSelect };
    events.push(newEvent);
  }

  console.log('Piket gepland:', { date: eventDate, description: eventDescription, role: roleSelect });

  res.redirect('/piket_planner');
});

app.get('/piket_planner', function(request, response) {
  Promise.all([
    fetchJson('https://fdnd-agency.directus.app/items/anwb_persons'),
    fetchJson('https://fdnd-agency.directus.app/items/anwb_roles')
  ]).then(([personData, roleData]) => {
    response.render('piket_planner', {
      person: personData.data,
      role: roleData.data
    })
  });
})

app.get('/profiel', function(request, response) {
  Promise.all([
    fetchJson('https://fdnd-agency.directus.app/items/anwb_persons'),
    fetchJson('https://fdnd-agency.directus.app/items/anwb_roles')
  ]).then(([personData, roleData]) => {
    response.render('profiel', {
      person: personData.data,
      role: roleData.data
    })
  });
})

// 3. Start de webserver
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})
