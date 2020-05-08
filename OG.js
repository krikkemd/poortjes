/*********************************************************************************************************************
 * Get Data
 *********************************************************************************************************************/
const events = new XMLHttpRequest();
events.onreadystatechange = function() {
  if (events.readyState == 4) {
    if (events.status == 200) {
      var eventsData = JSON.parse(events.responseText);
      // console.log(eventsData.data);
      secondCall(eventsData);
    }
    if (events.status == 404) {
      console.log('File or resource not found');
    }
  }
};

// Eventsdata yesplan query: De data wordt uit events_grote_zaal.json gehaald. Deze json wordt elk uur ge update door een cronjob: nano /etc/crontab
events.open('GET', 'events.json', true);
events.send();

// SecondCall
function secondCall(events) {
  const custom = new XMLHttpRequest();
  custom.onreadystatechange = function() {
    if (custom.readyState == 4) {
      if (custom.status == 200) {
        var customData = JSON.parse(custom.responseText);
        // console.log(customData.data);
        getData(events, customData);
      }
      if (custom.status == 404) {
        console.log('File or resource not found');
      }
    }
  };

  // Customdata yesplan query: De data wordt uit nc_grote_zaal.json gehaald. Deze json wordt elk uur ge update door een cronjob: nano /etc/crontab
  custom.open('GET', 'nc.json', true);
  custom.send();
}
/*********************************************************************************************************************
 * DOMStrings
 *********************************************************************************************************************/
let html, wrapper;
html = document.querySelector('html');
wrapper = document.querySelector('.wrapper');
let titel, artiest, plaats, aanvang, pauze, einde, image, beginTijd, eindTijd, n, closed, tijden;

titel = document.querySelector('.titel');
titelLong = document.querySelector('.titel-long');
artiest = document.querySelector('.artiest');
artiestLong = document.querySelector('.artiest-long');
plaats = document.querySelector('.locatie');
aanvang = document.querySelector('.aanvang');
pauze = document.querySelector('.pauze');
einde = document.querySelector('.einde');
image = document.querySelector('.img');
wrapper = document.querySelector('.wrapper');
html = document.querySelector('html');
logo = document.querySelector('.logo');
closed = document.querySelector('.closed');
textAanvang = document.querySelector('.text__aanvang');
textPauze = document.querySelector('.text__pauze');
textEinde = document.querySelector('.text__einde');

/*********************************************************************************************************************
 * Create array(zaal) of objects
 *********************************************************************************************************************/
let zaal = [];
let count = 0;

function getData(events, custom) {
  let object, locatie;

  for (let i = 0; i < events.data.length; i++) {
    // Als de locatie bestaat en er custom.data bestaat
    if (events.data[i].locations[0] && custom.data[i]) {
      locatie = events.data[i].locations[0].name;
      str = events.data[i].name;

      // Titel en artiest van elkaar scheiden
      let newstr = str.split(/;\s/);

      // custom.data[i].items[0].value = Geuploade afbeelding in YesPlan. Als die bestaat, push object dan naar de zaal array.
      if (custom.data[i].items[0].value !== null) {
        object = {
          titel: newstr[0],
          artiest: newstr[1],
          locatie: events.data[i].locations[0].name,
          aanvang: events.data[i].defaultschedulestarttime,
          pauze: custom.data[i].items[0].value.comment,
          einde: events.data[i].defaultscheduleendtime,
          image: custom.data[i].items[0].value
        };
        zaal.push(object);
      }
    }
  }

  // Als de zaal array niet leeg is, en de lengte >= aan 1
  if (zaal[0] !== undefined && zaal.length >= 1) {
    removeShowAfterEnd(zaal);
    trimTitles(zaal);
    createHtml(zaal);

    // Als de zaal array niet leeg is, en er meer dan 1 voorstellingen zijn
    if (zaal[0] !== undefined && zaal.length >= 1) {
      setInterval(counter, 10000);
    }
  } else {
    closed.style.display = 'block';
    closed.setAttribute('src', 'theater_gesloten.jpg');
    plaats.style.display = 'none';
    aanvang.style.display = 'none';
    pauze.style.display = 'none';
    einde.style.display = 'none';
    logo.style.display = 'none';
    textAanvang.style.display = 'none';
    textPauze.style.display = 'none';
    textEinde.style.display = 'none';
  }
}

// Deze functie telt het aantal voorstellingen, en roept de createHTML functie aan voor elke voorstelling na x aantal seconden dmv setInterval. Dit zorgt ervoor dat de content wisselt.
// Als de 'count' gelijk is of groter dan het aantal voorstellingen, springt deze weer op 0. Zo word er constant door de voorstellingen geloopt.
function counter() {
  console.log(`counter is now: ${count}`);
  count++;
  if (count >= zaal.length) {
    count = 0;
    console.log(zaal.length);
  }
  removeShowAfterEnd(zaal);
  trimTitles(zaal);
  createHtml(zaal);
}

/*********************************************************************************************************************
 * Verwijder de show uit array als de show voorbij is(objects[i].einde):
 *********************************************************************************************************************/
function removeShowAfterEnd(objects) {
  n = new Date().getHours();
  for (let i = 0; i < objects.length; i++) {
    if (n > parseInt(objects[i].einde)) {
      console.log(parseInt(objects[i].einde));
      objects.splice([i], 1);
    }
  }
}

/*********************************************************************************************************************
 * TrimTitles: Functie die ervoor zorgt dat de titel & artiesten niet onder het geuploade plaatje doorlopen.
 *********************************************************************************************************************/
function trimTitles(objects) {
  let newTitle = [];
  let newTitle2 = [];

  // Deze functie deelt de titel van een yesplan event op in 2 arrays als deze langer is dan 28 tekens. Dit zodat de titel niet onder de afbeelding doorloopt.
  const limitTitleLength = (title, limit = 25) => {
    if (title.length > limit) {
      title.split(' ').reduce((acc, cur) => {
        if (acc + cur.length <= limit) {
          newTitle.push(cur);
          objects[count].titel = newTitle.join(' ');
        } else {
          newTitle2.push(cur);
          objects[count].titel2 = newTitle2.join(' ');
        }
        return acc + cur.length;
      }, 0);
    }
    return title;
  };

  let newArtiest = [];
  let newArtiest2 = [];

  // Deze functie deelt de artiesten van een yesplan event op in 2 arrays als deze langer is dan 28 tekens. Dit zodat de artiesten niet onder de afbeelding doorloopt.
  const limitArtiestLength = (artiest, limit = 28) => {
    if (objects[count].artiest) {
      if (artiest.length > limit) {
        artiest.split(' ').reduce((acc, cur) => {
          if (acc + cur.length <= limit) {
            newArtiest.push(cur);
            objects[count].artiest = newArtiest.join(' ');
          } else {
            newArtiest2.push(cur);
            objects[count].artiest2 = newArtiest2.join(' ');
          }
          return acc + cur.length;
        }, 0);
      }
      return artiest;
    }
  };
  if (objects[count]) {
    limitTitleLength(objects[count].titel);
    limitArtiestLength(objects[count].artiest);
  }
}

/*********************************************************************************************************************
 * Create HTML
 *********************************************************************************************************************/
function createHtml(events) {
  // Als er geen pauze staat ingevuld toon dan streepje "-"
  if (events[count]) {
    if (events[count].pauze === null || pauze === undefined) {
      events[count].pauze = '-';
    }
  }

  // Huidig uur, Array met alle begin en eind tijden gesorteerd van vroeg naar laat.
  n = new Date().getHours();
  tijden = [];

  for (let i = 0; i < events.length; i++) {
    tijden.push(parseInt(events[i].aanvang));
    tijden.push(parseInt(events[i].einde));
  }

  tijden.sort((a, b) => {
    return a - b;
  });

  // Begin tijd is de vroegste Aanvangst tijd in de events array, eindtijd is de laatste Eind tijd van de dag
  beginTijd = tijden[0];
  eindTijd = tijden[tijden.length - 1];

  // Als de titel of artiesten zijn opgedeeld in twee arrays, en dus langer zijn dan 28 of 33 tekens. Wijzig dan de HTML. (zie ook de trimTitles functie)
  if (events[count]) {
    if (events[count].titel2 || events[count].artiest2) {
      artiest.style.top = '225px';
      titel.innerHTML = '<span>' + events[count].titel + '</span>';
      titelLong.innerHTML = '<span>' + events[count].titel2 + '</span>';
      artiest.innerHTML = '<span>' + events[count].artiest + '</span>';
      artiestLong.innerHTML = '<span>' + events[count].artiest2 + '</span>';
      if (titelLong.textContent === 'undefined') {
        titelLong.textContent = '';
      }
      if (artiestLong.textContent === 'undefined') {
        artiestLong.textContent = '';
      }
      if (artiest.textContent === 'undefined') {
        artiest.textContent = '';
      }
    } else {
      titelLong.innerHTML = '';
      artiestLong.innerHTML = '';
    }
  }

  // Standaard gesloten scherm tonen
  if (n < beginTijd - 4) {
    closed.style.display = 'block';
    closed.setAttribute('src', 'theater_gesloten.jpg');
    plaats.style.display = 'none';
    aanvang.style.display = 'none';
    pauze.style.display = 'none';
    einde.style.display = 'none';
    logo.style.display = 'none';
    textAanvang.style.display = 'none';
    textPauze.style.display = 'none';
    textEinde.style.display = 'none';

    titel.innerHTML = '';
    titelLong.innerHTML = '';
    artiest.innerHTML = '';
    artiestLong.innerHTML = '';
  }

  console.log('Huidig uur: ' + n);
  console.log('Start: ' + beginTijd);
  console.log('Eind: ' + eindTijd);

  // 4 uur voorafgaand aan de starttijd van de eerste voorstelling, de voorstellingsinformatie tonen
  if (n + 4 >= beginTijd) {
    // Insert HTML
    titel.innerHTML = '<span>' + events[count].titel + '</span>';
    artiest.innerHTML = '<span>' + events[count].artiest + '</span>';
    plaats.textContent = events[count].locatie;
    aanvang.textContent = events[count].aanvang;
    pauze.textContent = events[count].pauze;

    //  Als er geen artiest is ingevuld toon dan niks ipv undefined.
    if (events[count].artiest === undefined) {
      artiest.textContent = '';
    }

    // Als er geen einde staat ingesteld toon dan '-'
    if (events[count].einde !== null) {
      einde.textContent = '± ' + events[count].einde;
    }
    // Als er geen afbeelding staat ingesteld, toon dan nog niks
    if (events[count].image !== null) {
      image.setAttribute('src', './afbeeldingen/' + events[count].image.originalname);
    } else {
      logo.style.left = '1720px';
    }
  }

  // Als het huidige uur gelijk is aan de eindtijd of aan de eindtijd + 1, toon dan het tot ziens scherm
  // if (n >= eindTijd || n >= eindTijd + 1) {
  //   wrapper.classList.add('gesloten');
  //   html.style.backgroundImage = "url('totziens_groenblauw.png')";
  // }
  // if (n >= eindTijd + 2) {
  //   html.style.backgroundImage = "url('theater_gesloten.jpg')";
  // }

  if (beginTijd === undefined) {
    closed.style.display = 'block';
    closed.setAttribute('src', 'theater_gesloten.jpg');
    plaats.style.display = 'none';
    aanvang.style.display = 'none';
    pauze.style.display = 'none';
    einde.style.display = 'none';
    logo.style.display = 'none';
    textAanvang.style.display = 'none';
    textPauze.style.display = 'none';
    textEinde.style.display = 'none';

    titel.innerHTML = '';
    titelLong.innerHTML = '';
    artiest.innerHTML = '';
    artiestLong.innerHTML = '';
  }

  // Als de achtergrond op 'theater gesloten' staat, Haal dan alle text weg
  if (closed.getAttribute('src', 'theater_gesloten.jpg')) {
    closed.style.display = 'block';
    closed.setAttribute('src', 'theater_gesloten.jpg');
    plaats.style.display = 'none';
    aanvang.style.display = 'none';
    pauze.style.display = 'none';
    einde.style.display = 'none';
    logo.style.display = 'none';
    textAanvang.style.display = 'none';
    textPauze.style.display = 'none';
    textEinde.style.display = 'none';

    titel.style.display = 'none';
    titelLong.style.display = 'none';
    artiest.style.display = 'none';
    artiestLong.style.display = 'none';
    titelLong.innerHTML = '';
    artiest.innerHTML = '';
    artiestLong.innerHTML = '';
  }
}
console.log(zaal);
