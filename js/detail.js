import { getMealDetails } from './api.js';

// ავტორიზაციის შემოწმება
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

const detailContainer = document.getElementById('detail-container');

function showLoading() {
  detailContainer.innerHTML = '<div class="loading-state">იტვირთება რეცეპტის დეტალები...</div>';
}

function showError(message) {
  detailContainer.innerHTML = `<div class="error-state">შეცდომა: ${message}</div>`;
}

function renderMealDetails(meal) {
  detailContainer.innerHTML = '';

  const article = document.createElement('article');
  article.className = 'recipe-detail-card';

  // სათაურის სექცია
  const header = document.createElement('header');
  header.className = 'recipe-detail-header';

  const title = document.createElement('h1');
  title.className = 'recipe-detail-title';
  title.textContent = meal.strMeal;

  const category = document.createElement('p');
  category.className = 'recipe-detail-category';
  category.innerHTML = `კატეგორია: <span>${meal.strCategory || 'უცნობია'}</span>`;

  header.appendChild(title);
  header.appendChild(category);

  // სურათის სექცია
  const imageSection = document.createElement('section');
  imageSection.className = 'recipe-detail-image-section';

  const img = document.createElement('img');
  img.src = meal.strMealThumb;
  img.alt = meal.strMeal;
  img.className = 'recipe-detail-img';

  imageSection.appendChild(img);

  // ინგრედიენტების სექცია
  const ingredientsSection = document.createElement('section');
  ingredientsSection.className = 'recipe-detail-ingredients-section';

  const ingredientsTitle = document.createElement('h2');
  ingredientsTitle.textContent = 'ინგრედიენტები';

  const ingredientsList = document.createElement('ul');
  ingredientsList.className = 'recipe-detail-ingredients-list';

  // ინგრედიენტების და ზომების წამოღება (მაქსიმუმ 20)
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== '') {
      const li = document.createElement('li');
      li.textContent = `${ingredient} - ${measure ? measure.trim() : ''}`;
      ingredientsList.appendChild(li);
    }
  }

  ingredientsSection.appendChild(ingredientsTitle);
  ingredientsSection.appendChild(ingredientsList);

  // ინსტრუქციის სექცია
  const instructionsSection = document.createElement('section');
  instructionsSection.className = 'recipe-detail-instructions-section';

  const instructionsTitle = document.createElement('h2');
  instructionsTitle.textContent = 'მომზადების ინსტრუქცია';

  const instructionsList = document.createElement('ol');
  instructionsList.className = 'recipe-detail-instructions-list';

  // ინსტრუქციის დაყოფა ნაბიჯებად ახალი ხაზების მიხედვით
  const steps = meal.strInstructions ? meal.strInstructions.split(/\r?\n/) : [];
  steps.forEach(step => {
    if (step.trim() !== '') {
      const li = document.createElement('li');
      li.textContent = step.trim();
      instructionsList.appendChild(li);
    }
  });

  instructionsSection.appendChild(instructionsTitle);
  instructionsSection.appendChild(instructionsList);

  // აწყობა
  article.appendChild(header);
  article.appendChild(imageSection);
  article.appendChild(ingredientsSection);
  article.appendChild(instructionsSection);

  detailContainer.appendChild(article);
}

// URL-დან ID-ის წაკითხვა და რეცეპტის წამოღება
async function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const mealId = urlParams.get('id');

  if (!mealId) {
    showError('რეცეპტის ID ვერ მოიძებნა URL-ში.');
    return;
  }

  showLoading();

  try {
    const data = await getMealDetails(mealId);
    if (data.meals && data.meals.length > 0) {
      renderMealDetails(data.meals[0]);
    } else {
      showError('კერძი მოცემული ID-ით ვერ მოიძებნა.');
    }
  } catch (error) {
    console.error('დეტალების წამოღების შეცდომა:', error);
    showError('ვერ მოხერხდა რეცეპტის დეტალების ჩატვირთვა. სცადეთ მოგვიანებით.');
  }
}

init();
