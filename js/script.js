const filter = document.querySelector('.js-filter'),
  filmList = filter.querySelector('.filter__list'),
  cardsList = document.querySelector('.cards__list');

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

const getFilms = data => {
  const allFilms = data.reduce((allMovies, { movies }) => allMovies.concat(movies), []);

  return allFilms.filter((item, i) => item && allFilms.indexOf(item) === i);
};

const renderFilms = films => {
  filmList.insertAdjacentHTML('afterbegin',
    `<li class="filter__option">
                <label class="option">
                  <input class="option__input v1sually-hidden" type="checkbox" name="all" checked>
                  <span class="option__checkbox"></span>
                  All Heroes
                </label>
              </li>`);

  films.forEach(film => {
    filmList.insertAdjacentHTML('beforeend',
      `<li class="filter__option">
              <label class="option">
                <input class="option__input v1sually-hidden" type="checkbox" name="${film}">
                <span class="option__checkbox"></span>
                ${film}
              </label>
            </li>`);
  });

  filterPreload.remove();
};

const renderCardYears = ({ birthDay, deathDay }) => {
  let cardYears = '';
  if (birthDay && deathDay) {
    cardYears = `<p class="card__years">
                    <span class="card__birthday">${birthDay}</span> - <span class="card__deathday">${deathDay}</span>
                  </p>`;
  } else if (birthDay) {
    cardYears = `<p class="card__years">
                    born in ${birthDay}
                  </p>`;
  } else if (deathDay) {
    cardYears = `<p class="card__years">
                    died in ${deathDay}
                  </p>`;
  }
  return cardYears;
};

const renderCardFilms = ({ movies }) => {
  let cardFilms = '';
  if (movies) {
    movies.forEach(movie => {
      const li = document.createElement('li');
      li.classList.add('card__film');
      li.textContent = movie;
      cardFilms += `\n${li.outerHTML}`;
    });
  }
  return cardFilms;
};

const renderCards = data => {
  cardsList.textContent = '';

  data.forEach(item => {
    cardsList.insertAdjacentHTML('beforeend',
      `<li class="cards__item">
              <article class="card">
                <h3 class="card__title">${item.name}</h3>
                <img class="card__photo" src="${item.photo ? item.photo : ''}" alt="">
                <div class="card__columns">
                  <p class="card__text">${item.species ? item.species : ''}</p>
                  <p class="card__text">${item.gender ? item.gender : ''}</p>
                </div>
                ${renderCardYears(item)}
                <p class="card__status card__text">${item.status ? item.status : ''}</p>
                <p class="card__text">Actor: ${item.actors}</p>
                <p class="card__label">Films:</p>
                <ul class="card__films">${renderCardFilms(item)}</ul>
              </article>
            </li>`);

    cardsPreload.remove();
  });
};

fetch('dbHeroes.json')
  .then(response => {
    if (response.status !== 200) throw new Error('Error');
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
        if (movies) return movies.some(movie => selectedFilms.has(movie));
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
