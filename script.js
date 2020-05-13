const urls = ['events.json', 'ncGZ.json', 'ncRZ.json'];
let jsonArray = [];
let eventsArray = [];
let zaalArray = [];
let voorstellingen = [];

waitFordata();

// Reload page every 4 hours        1s     1m   1h   4h
setTimeout(() => location.reload(), 1000 * 60 * 60 * 4);

// async methode
async function waitFordata() {
  let a = await getData(urls[0]);
  await getData(urls[1]);
  await getData(urls[2]);
  //   console.log(a); // dit is voor reference
  //   console.log(jsonArray)

  // set data variables
  let eventsJson = jsonArray[0];
  let groteZaalJson = jsonArray[1];
  let raboZaalJson = jsonArray[2];
  let mergedJson = groteZaalJson.concat(raboZaalJson);

  // Process events json data
  processEvents(eventsJson);

  // Process zaal json data
  processZalen(mergedJson);

  // Combine events and zaal data
  combineData(eventsArray, zaalArray);

  // Add timestamp logic
  processData(voorstellingen);

  // Create html
  createHTML(voorstellingen);
}

// function to get JSON data and push to jsonArray
function getData(url) {
  return new Promise((resolve, reject) => {
    fetch(url).then((response) => {
      return response.json().then((result) => {
        jsonArray.push(result.data);
        return resolve('dit is voor reference, zo werkt die return');
      });
    });
  });
}

// Dit werkt ook .then methode
// getData(urls[0]).then(() => {
//   getData(urls[1]).then(() => {
//     getData(urls[2]).then(() => {
//       //   console.log(jsonArray);
//       let eventsJson = jsonArray[0];
//       let groteZaalJson = jsonArray[1];
//       let raboZaalJson = jsonArray[2];
//       let mergedJson = groteZaalJson.concat(raboZaalJson);
//       //   console.log(mergedJson);
//       processData(eventsJson, mergedJson);
//     });
//   });
// });

// Process Event Data
function processEvents(eventsData) {
  let eventObj;

  // Loop over the events array, create data variables
  eventsData.forEach((event) => {
    let eventid = event.id;
    let locatie = event.locations[0].name;
    let start = event.defaultschedulestarttime;
    let eind = event.defaultscheduleendtime;

    // if the location of the event is either grote zaal or rabo zaal, set objects and push to array
    if (locatie.toLowerCase() == 'grote zaal' || locatie.toLowerCase() == 'rabo zaal') {
      eventObj = {
        eventid: eventid,
        locatie: locatie,
        start: start,
        eind: eind,
      };
      eventsArray.push(eventObj);
    }
  });
  // sort array by eventID
  eventsArray.sort(compareID);
}

// Process Zalen data
function processZalen(zaalData) {
  let zaalObj;

  // Loop over array, create data variables
  zaalData.forEach((voorstelling) => {
    let eventid = voorstelling.event.id;
    let titel = voorstelling.items[0].children[0].value;
    let artiest = voorstelling.items[0].children[1].value;
    let kleedkamers = voorstelling.items[2].children;
    let pauze = voorstelling.items[4].children[1].value;
    let vb;
    let afb;

    // Only set value if it exists
    if (voorstelling.items[3].value !== null) {
      vb = voorstelling.items[3].value.contact.name;
    }

    // Only set value if it exists
    if (voorstelling.items[1].value !== null) {
      afb = voorstelling.items[1].value.originalname;
    }

    // Create objects and push to array
    zaalObj = {
      eventid: eventid,
      titel: titel,
      artiest: artiest,
      kleedkamers: kleedkamers,
      pauze: pauze,
      vber: vb,
      afb: afb,
    };
    zaalArray.push(zaalObj);
  });
  // Sort array by eventID
  zaalArray.sort(compareID);
}

// Combine data from eventsArray and zaalArray and push to voorstellingen array
function combineData(eventsArray, zaalArray) {
  // Dates to add timestamps for narrowcasting start & end
  let d = new Date();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  eventsArray.forEach((el, i) => {
    if (el.eventid == eventsArray[i].eventid) {
      let mergedObj = {
        eventid: eventsArray[i].eventid,
        locatie: eventsArray[i].locatie,
        titel: zaalArray[i].titel,
        artiest: zaalArray[i].artiest,
        start: eventsArray[i].start,
        ncstart: new Date(`${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${el.start}`).valueOf() / 3600000 - 4,
        nceind: new Date(`${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${el.eind}`).valueOf() / 3600000 + 1,
        pauze: zaalArray[i].pauze,
        eind: eventsArray[i].eind,
        vber: zaalArray[i].vber,
        kleedkamers: zaalArray[i].kleedkamers,
        afb: zaalArray[i].afb,
      };
      // Only if there is an uploaded yesplan img, push to array
      if (zaalArray[i].afb) {
        voorstellingen.push(mergedObj);
      }
    }
  });
  // Sort array by voorstelling start time
  voorstellingen.sort(compareTime);

  // Sort array by voorstelling location
  voorstellingen.sort(compareLocatie);
}

// Check timevalues to schedule show visibility, checked every few seconds from CreateHTML timer function
function processData(voorstellingen, HTMLtimer) {
  let currentTime = new Date().getTime() / 3600000;
  console.log(`${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`);

  voorstellingen.forEach((voorstelling, i) => {
    // Start de narrowcasting wanneer het later is dan ncstart tijd (ncstart = starttijd - 4 uur)
    if (currentTime >= voorstelling.ncstart) {
      // NARROWCASTING STARTEN
      console.log(`Start de Narrowcasting voor Artiest: ${voorstelling.artiest} Voorstelling: ${voorstelling.titel}`);

      // Wanneer er voorstellingen zijn:
      if (voorstellingen.length) {
        // Laat voorstellingsdata zien
        showContainer();
        // Verberg theater gesloten scherm
        hideClosedScreen();
      }
    }

    // Verwijder de voorstelling wanneer het later is dan nceind (nceind = eindtijd - 0.25 uur (15min))
    if (currentTime >= voorstelling.nceind) {
      console.log(`Stop de Narrowcasting voor Artiest: ${voorstelling.artiest} Voorstelling: ${voorstelling.titel}`);
      voorstellingen.splice(voorstelling[i], 1);
    }
  });

  // Wanneer alle voorstellingen zijn afgelopen:
  if (!voorstellingen.length) {
    // Verberg voorstellingstemplate
    console.log(voorstellingen.length);
    hideContainer();

    // Theather Gesloten scherm
    showClosedScreen();

    // INTERVAL STOPPEN
    clearInterval(HTMLtimer); // interval timer that switches between shows from the CreateHTML function
  }
}

// Paint the DOM
function createHTML(voorstellingen) {
  let count;
  let timer;
  let firstrun = false;

  if (!firstrun) {
    count = 0;
  } else {
    count = -1;
  }

  let titel = document.querySelector('.titel');
  let artiest = document.querySelector('.artiest');
  let img = document.querySelector('.img');
  let locatie = document.querySelector('.locatie');
  let start = document.querySelector('.start');
  let pauze = document.querySelector('.pauze');
  let einde = document.querySelector('.einde');

  // First run
  titel.innerHTML = voorstellingen[count].titel;
  artiest.innerHTML = voorstellingen[count].artiest;
  img.src = `./afbeeldingen/${voorstellingen[count].afb}`;
  locatie.innerHTML = voorstellingen[count].locatie;
  start.innerHTML = voorstellingen[count].start;
  einde.innerHTML = voorstellingen[count].eind;

  if (voorstellingen[count].pauze == null) {
    pauze.innerHTML = '-';
  } else {
    pauze.innerHTML = voorstellingen[count].pauze;
  }

  console.log(count);
  console.log(voorstellingen.length);

  // Interval die voor de switch tussen voorstellingen zorgt
  timer = setInterval(() => {
    processData(voorstellingen, timer);

    // loop door de array met voorstellingen, switch om de zoveel seconden
    if (count < voorstellingen.length - 1) {
      firstrun = true;
      count++;
      console.log(count);

      titel.innerHTML = voorstellingen[count].titel;
      artiest.innerHTML = voorstellingen[count].artiest;
      img.src = `./afbeeldingen/${voorstellingen[count].afb}`;
      locatie.innerHTML = voorstellingen[count].locatie;
      start.innerHTML = voorstellingen[count].start;
      einde.innerHTML = voorstellingen[count].eind;

      if (voorstellingen[count].pauze == null) {
        pauze.innerHTML = '-';
      } else {
        pauze.innerHTML = voorstellingen[count].pauze;
      }
    } else if (count == voorstellingen.length - 1) {
      count = 0;

      titel.innerHTML = voorstellingen[count].titel;
      artiest.innerHTML = voorstellingen[count].artiest;
      img.src = `./afbeeldingen/${voorstellingen[count].afb}`;
      locatie.innerHTML = voorstellingen[count].locatie;
      start.innerHTML = voorstellingen[count].start;
      einde.innerHTML = voorstellingen[count].eind;

      if (voorstellingen[count].pauze == null) {
        pauze.innerHTML = '-';
      } else {
        pauze.innerHTML = voorstellingen[count].pauze;
      }
    }
  }, 10000);
}

// Some helper functions //

// Sort by eventid
function compareID(a, b) {
  if (a.eventid < b.eventid) {
    return -1;
  }
  if (a.eventid > b.eventid) {
    return 1;
  }
  return 0;
}

// Sort by start time
function compareTime(a, b) {
  if (a.ncstart < b.ncstart) {
    return -1;
  }
  if (a.ncstart > b.ncstart) {
    return 1;
  }
  return 0;
}

// Sort by location
function compareLocatie(a, b) {
  if (a.locatie < b.locatie) {
    return -1;
  }
  if (a.locatie > b.locatie) {
    return 1;
  }
  return 0;
}

// Container
function hideContainer() {
  let container = document.querySelector('.container');
  container.classList.remove('container--visible');
}

function showContainer() {
  let container = document.querySelector('.container');
  container.classList.add('container--visible');
}

// Closed
function hideClosedScreen() {
  let closed = document.querySelector('.closed');
  closed.classList.remove('closed--visible');
}

function showClosedScreen() {
  let closed = document.querySelector('.closed');
  closed.classList.add('closed--visible');
}

// Tot Ziens
function hideTotziens() {
  let totziens = document.querySelector('.totziens');
  totziens.classList.remove('totziens--visible');
}

function showTotziens() {
  let totziens = document.querySelector('.totziens');
  totziens.classList.add('totziens--visible');
}
