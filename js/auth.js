// Form handling functions
export function toggleForms(loginForm, registerForm) {
  return {
    showRegister: () => {
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
    },
    showLogin: () => {
      registerForm.style.display = 'none';
      loginForm.style.display = 'block';
    }
  };
}

export function showMessage(element, message, isSuccess) {
  element.textContent = message;
  element.className = isSuccess ? 'success-message' : 'error-message';
}