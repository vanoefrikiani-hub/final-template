import { getSaved, setSaved } from './api.js';

// თუ მომხმარებელი არ არის ავტორიზებული — login.html-ზე გადამისამართება
if (!localStorage.getItem('user')) {
  window.location.href = 'login.html';
}

const navUser = document.getElementById('nav-user');
if (navUser) {
  navUser.textContent = localStorage.getItem('user') || '';
}

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user');
    document.cookie = 'authorized=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    window.location.href = 'login.html';
  });
}

function renderSaved() {
  const items = getSaved();
  const grid = document.getElementById('saved-results-grid');
  const empty = document.getElementById('saved-empty');

  if (!grid) return;

  grid.innerHTML = '';

  if (!items || !items.length) {
    if (empty) empty.hidden = false;
    return;
  }

  if (empty) empty.hidden = true;

  items.forEach(item => {
    // შევქმნათ ბარათის კონტეინერი
    const card = document.createElement('article');
    card.className = 'recipe-card';

    // სურათი
    const img = document.createElement('img');
    img.className = 'recipe-card-img';
    img.src = item.strMealThumb;
    img.alt = item.strMeal;
    img.loading = 'lazy';

    // შიგთავსის კონტეინერი
    const cardBody = document.createElement('div');
    cardBody.className = 'recipe-card-body';

    // სათაური
    const title = document.createElement('h3');
    title.className = 'recipe-card-title';
    title.textContent = item.strMeal;

    // კატეგორია
    const category = document.createElement('p');
    category.className = 'recipe-card-category';
    category.textContent = item.strCategory || '';

    // ღილაკების კონტეინერი
    const actions = document.createElement('div');
    actions.className = 'recipe-card-actions';

    // დეტალების ღილაკი (ბმული)
    const detailBtn = document.createElement('a');
    detailBtn.className = 'recipe-card-btn';
    detailBtn.textContent = 'დეტალურად';
    detailBtn.href = `detail.html?id=${item.id}`;

    // წაშლის ღილაკი
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'recipe-card-btn';
    removeBtn.textContent = 'წაშლა';
    removeBtn.addEventListener('click', () => {
      const updated = getSaved().filter(saved => saved.id !== item.id);
      setSaved(updated);
      renderSaved();
    });

    // აწყობა
    actions.appendChild(detailBtn);
    actions.appendChild(removeBtn);

    cardBody.appendChild(title);
    cardBody.appendChild(category);
    cardBody.appendChild(actions);

    card.appendChild(img);
    card.appendChild(cardBody);

    grid.appendChild(card);
  });
}

renderSaved();
