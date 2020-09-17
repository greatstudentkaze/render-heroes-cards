const filter = document.querySelector('.js-filter'),
  filmList = filter.querySelector('.filter__list'),
  filterOptionTemplate = filmList.querySelector('.js-filter-option'),
  cardsList = document.querySelector('.cards__list'),
  cardTemplate = cardsList.querySelector('.js-card');

const appendPreloader = (target) => {
  const preloaderWrap = document.createElement('div'),
    preloader = `<div class="sk-circle-bounce">
                  <div class="sk-child sk-circle-1"></div>
                  <div class="sk-child sk-circle-2"></div>
                  <div class="sk-child sk-circle-3"></div>
                  <div class="sk-child sk-circle-4"></div>
                  <div class="sk-child sk-circle-5"></div>
                  <div class="sk-child sk-circle-6"></div>
                  <div class="sk-child sk-circle-7"></div>
                  <div class="sk-child sk-circle-8"></div>
                  <div class="sk-child sk-circle-9"></div>
                  <div class="sk-child sk-circle-10"></div>
                  <div class="sk-child sk-circle-11"></div>
                  <div class="sk-child sk-circle-12"></div>
                </div>`;

  preloaderWrap.classList.add('preloader');
  preloaderWrap.innerHTML = preloader;
  target.append(preloaderWrap);

  return preloaderWrap;
};

const filterPreload = appendPreloader(filmList),
  cardsPreload = appendPreloader(cardsList);

const addOption = ( { label, name, checked = false }, template, filterList) => {
  const option = template.content.cloneNode(true),
    optionInput = option.querySelector('.option__input'),
    optionText = option.querySelector('.option__text');

  optionInput.name = name;
  optionText.textContent = label;
  if (checked) optionInput.setAttribute('checked', 'true');

  filterList.append(option);
};

const getFilms = data => {
  const allFilms = data.reduce((allMovies, { movies }) => allMovies.concat(movies), []),
    trimmedFilms = allFilms.map(film => {
      if (film) return film.trim();
    });

  return trimmedFilms.filter((item, i) => item && allFilms.indexOf(item) === i);
};

const renderFilms = films => {
  addOption({
    label: 'All Heroes',
    name: 'all',
    checked: true
  }, filterOptionTemplate, filmList);

  films.forEach(film => {
    addOption({
      label: film,
      name: film
    }, filterOptionTemplate, filmList);
  });

  filterPreload.remove();
};

const addCard = (item, template, cardList) => {
  const card = template.content.cloneNode(true),
    cardTitle = card.querySelector('.js-title'),
    cardPhoto = card.querySelector('.js-photo'),
    cardSpecies = card.querySelector('.js-card-species'),
    cardGender = card.querySelector('.js-card-gender'),
    cardYears = card.querySelector('.js-years'),
    cardBirthday = cardYears.querySelector('.js-birthday'),
    cardDeathday = cardYears.querySelector('.js-deathday'),
    cardStatus = card.querySelector('.js-status'),
    cardActors = card.querySelector('.js-card-actors'),
    cardFilms = card.querySelector('.js-films');

  cardTitle.textContent = item.name;
  cardPhoto.src = item.photo ? item.photo : '';
  cardSpecies.textContent = item.species ? item.species : '';
  cardGender.textContent = item.gender ? item.gender : '';

  if (item.birthDay && item.deathDay) {
    cardBirthday.textContent = item.birthDay;
    cardDeathday.textContent = item.deathDay;
  } else if (item.birthDay) {
    cardYears.textContent = `born in ${item.birthDay}`;
  } else if (item.deathDay) {
    cardYears.textContent = `died in ${item.deathDay}`;
  } else {
    cardYears.remove();
  }

  cardStatus.textContent = item.status ? item.status : '';
  cardActors.textContent = item.actors;

  if (item.movies) {
    item.movies.forEach(movie => {
      const li = document.createElement('li');
      li.classList.add('card__film');
      li.textContent = movie;

      cardFilms.append(li);
    });
  } else {
    cardFilms.remove();
  }

  cardList.append(card);
};

const renderCards = data => {
  cardsList.textContent = '';

  data.forEach(item => {
    addCard(item, cardTemplate, cardsList);
    cardsPreload.remove();
  });
};

fetch('dbHeroes.json')
  .then(response => {
    if (response.status !== 200) throw new Error('Error' + response.status);
    return response.json();
  })
  .then(data => {
    const films = getFilms(data);
    renderFilms(films);

    const selectedFilms = new Set();
    filter.addEventListener('reset', () => {
      selectedFilms.clear();
      renderCards(data);
    });
    filter.addEventListener('change', evt => {
      const target = evt.target;

      if (target.name === 'all' && target.checked) {
        filter.reset();
        return;
      } else {
        filter.querySelector('input[name="all"]').checked = false;
      }

      if (target.checked) selectedFilms.add(target.name);
      else selectedFilms.delete(target.name);

      const selectedFilmsData = data.filter(({ movies }) => {
        if (movies) return movies.some(movie => selectedFilms.has(movie.trim()));
      });
      renderCards(selectedFilmsData);
    });

    return data;
  })
  .then(data => {
    renderCards(data);
  })
  .catch(err => {
    console.error(err);
    filterPreload.remove();
    cardsPreload.remove();
  });
