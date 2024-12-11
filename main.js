import './style.css';
import { registerUser, loginUser } from './js/database.js';
import { toggleForms, showMessage } from './js/auth.js';
import { initializeConverter } from './js/converter.js';

// Form elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const authForms = document.getElementById('auth-forms');

// Initialize form toggling
const { showRegister, showLogin } = toggleForms(loginForm, registerForm);
showRegisterLink.addEventListener('click', showRegister);
showLoginLink.addEventListener('click', showLogin);

// Handle registration
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;
  const messageElement = document.getElementById('register-message');

  const result = await registerUser(username, password);
  
  showMessage(messageElement, 
    result.success ? 'Registration successful!' : result.error,
    result.success
  );

  if (result.success) {
    registerForm.reset();
    setTimeout(showLogin, 1500);
  }
});

// Handle login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  const messageElement = document.getElementById('login-message');

  const result = await loginUser(username, password);
  
  showMessage(messageElement,
    result.success ? 'Login successful!' : result.error,
    result.success
  );

  if (result.success) {
    loginForm.reset();
    authForms.style.display = 'none';
    initializeConverter(); // This will now show the converter in the correct container
  }
});