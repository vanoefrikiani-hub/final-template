const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  localStorage.setItem('user', email);

  window.location.href = 'index.html';
});