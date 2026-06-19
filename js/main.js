import { searchMeals, filterByCategory, fetchData, getSaved, setSaved, saveToFavorites } from './api.js';

// თუ მომხმარებელი არ არის ავტორიზებული — გადამისამართება login.html-ზე
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

// --- სტეიტი ---
let savedItems = getSaved();

const resultsGrid = document.getElementById('results-grid');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-select');

function showLoading() {
  resultsGrid.innerHTML = '<div class="loading-state">იტვირთება რეცეპტები...</div>';
}

function showError(message) {
  resultsGrid.innerHTML = `<div class="error-state">შეცდომა: ${message}</div>`;
}

function renderResults(items) {
  resultsGrid.innerHTML = '';
  
  if (!items || items.length === 0) {
    resultsGrid.innerHTML = '<div class="no-results-state">კერძები ვერ მოიძებნა.</div>';
    return;
  }

  // წავიკითხოთ მიმდინარე ფავორიტები
  let currentSaved = getSaved();

  items.forEach(item => {
    // შევქმნათ ბარათის ძირითადი კონტეინერი
    const card = document.createElement('article');
    card.className = 'recipe-card';

    // სურათი
    const img = document.createElement('img');
    img.className = 'recipe-card-img';
    img.src = item.strMealThumb;
    img.alt = item.strMeal;
    img.loading = 'lazy'; // ოპტიმიზაციისთვის

    // ბარათის შიგთავსის კონტეინერი
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

    // ღილაკების კონტეინერი (actions)
    const actions = document.createElement('div');
    actions.className = 'recipe-card-actions';

    // დეტალების ღილაკი (a თეგი, რომელიც გადადის detail.html-ზე)
    const detailBtn = document.createElement('a');
    detailBtn.className = 'recipe-card-btn';
    detailBtn.textContent = 'დეტალურად';
    detailBtn.href = `detail.html?id=${item.idMeal}`;

    // ფავორიტებში დამატების ღილაკი
    const favBtn = document.createElement('button');
    favBtn.className = 'recipe-card-btn';
    
    // შევამოწმოთ, ხომ არ არის უკვე დამატებული
    const isAlreadySaved = currentSaved.some(saved => saved.id === item.idMeal);
    if (isAlreadySaved) {
      favBtn.textContent = 'შენახულია';
      favBtn.disabled = true;
    } else {
      favBtn.textContent = 'შენახვა';
    }

    // კლიკზე რეცეპტის შენახვა
    favBtn.addEventListener('click', () => {
      const added = saveToFavorites(item);
      if (added) {
        favBtn.textContent = 'შენახულია';
        favBtn.disabled = true;
        // განვაახლოთ ლოკალური სია
        currentSaved = getSaved();
      }
    });

    // აწყობა appendChild-ის გამოყენებით
    actions.appendChild(detailBtn);
    actions.appendChild(favBtn);

    cardBody.appendChild(title);
    cardBody.appendChild(category);
    cardBody.appendChild(actions);

    card.appendChild(img);
    card.appendChild(cardBody);

    resultsGrid.appendChild(card);
  });
}

if (searchForm) {
  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const query = searchInput.value.trim();
    const selectedCategory = categorySelect ? categorySelect.value : '';

    // ვალიდაცია: მინიმუმ ერთ-ერთი მაინც უნდა იყოს მითითებული
    if (!query && !selectedCategory) {
      showError('გთხოვთ შეიყვანოთ საძიებო სიტყვა ან აირჩიოთ კატეგორია!');
      return;
    }

    showLoading();

    try {
      let meals = [];

      if (query) {
        // თუ ჩაწერილია საძიებო სიტყვა
        const data = await searchMeals(query);
        meals = data.meals || [];

        // თუ კატეგორიაც არჩეულია, გავფილტროთ კლიენტის მხარეს
        if (selectedCategory) {
          meals = meals.filter(meal => 
            meal.strCategory && 
            meal.strCategory.toLowerCase() === selectedCategory.toLowerCase()
          );
        }
      } else {
        // თუ საძიებო სიტყვა ცარიელია, მაგრამ არჩეულია კატეგორია
        const data = await filterByCategory(selectedCategory);
        meals = data.meals || [];
        
        // რადგან filter.php არ აბრუნებს strCategory ველს, ხელით მივანიჭოთ საჩვენებლად
        meals.forEach(meal => {
          meal.strCategory = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
        });
      }

      renderResults(meals);
    } catch (error) {
      console.error('ძიების შეცდომა:', error);
      showError('ვერ მოხერხდა რეცეპტების წამოღება. სცადეთ მოგვიანებით.');
    }
  });
}
