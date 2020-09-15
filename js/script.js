const filter = document.querySelector('.js-filter'),
  filmList = filter.querySelector('.filter__list');

const preloader = `<div class="sk-circle-bounce">
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

const filterPreload = document.createElement('div');
filterPreload.classList.add('filter__preload');
filterPreload.innerHTML = preloader;
filmList.append(filterPreload);

const getFilms = data => {
  const allFilms = data.reduce((allMovies, { movies }) => allMovies.concat(movies), []);

  return allFilms.filter((item, i) => item && allFilms.indexOf(item) === i);
};

const renderFilms = films => {
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
}

fetch('dbHeroes.json')
  .then(response => {
    if (response.status !== 200) throw new Error('Error');
    return response.json();
  })
  .then(data => {
    const films = getFilms(data);

    renderFilms(films);
  })
  .catch(err => console.error(err));

filter.addEventListener('change', evt => {
  const target = evt.target;

  console.log(target.name, target.checked)
});
