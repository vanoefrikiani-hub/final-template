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

const suggestForm = document.getElementById('suggest-form');
const feedback = document.getElementById('suggest-feedback');

if (suggestForm) {
  suggestForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('recipe-title').value.trim();
    const email = document.getElementById('author-email').value.trim();
    const category = document.getElementById('recipe-category').value;
    const instructions = document.getElementById('recipe-instructions').value.trim();

    // 1. საბაზისო ვალიდაცია
    if (!title || !email || !category || !instructions) {
      showFeedback('გთხოვთ შეავსოთ ყველა საჭირო ველი!', 'error');
      return;
    }

    if (title.length < 3) {
      showFeedback('კერძის დასახელება უნდა შედგებოდეს მინიმუმ 3 სიმბოლოსგან!', 'error');
      return;
    }

    // მარტივი რეგულარული გამოსახულება ელ-ფოსტის შესამოწმებლად
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFeedback('გთხოვთ შეიყვანოთ ელ-ფოსტის სწორი ფორმატი!', 'error');
      return;
    }

    if (instructions.length < 10) {
      showFeedback('მომზადების ინსტრუქცია უნდა შედგებოდეს მინიმუმ 10 სიმბოლოსგან!', 'error');
      return;
    }

    // 2. წარმატებული გაგზავნა
    showFeedback('შეთავაზება წარმატებით გაიგზავნა! გმადლობთ.', 'success');
    
    // ფორმის გასუფთავება
    suggestForm.reset();
  });
}

function showFeedback(message, type) {
  if (!feedback) return;
  
  feedback.textContent = message;
  feedback.hidden = false;

  if (type === 'error') {
    feedback.className = 'form-feedback form-feedback--error';
  } else {
    feedback.className = 'form-feedback form-feedback--success';
  }
}
