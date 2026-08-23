// === Admin Security & PIN Authentication ===
const ADMIN_PIN = '123456'; // Default PIN pengelola, bisa diubah oleh pengelola
const AUTH_KEY = 'kosfitrah_admin_authenticated';

function isUserAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === 'true';
}

function setAuthenticated(status) {
  if (status) {
    sessionStorage.setItem(AUTH_KEY, 'true');
  } else {
    sessionStorage.removeItem(AUTH_KEY);
  }
}

function initAdminAuth() {
  const pinOverlay = document.getElementById('pin-overlay');
  const pinForm = document.getElementById('pin-form');
  const pinInput = document.getElementById('pin-input');
  const pinError = document.getElementById('pin-error');
  const logoutBtn = document.getElementById('admin-logout-btn');

  if (isUserAuthenticated()) {
    if (pinOverlay) pinOverlay.style.display = 'none';
  } else {
    if (pinOverlay) pinOverlay.style.display = 'flex';
    if (pinInput) pinInput.focus();
  }

  if (pinForm) {
    pinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredPin = pinInput.value.trim();
      if (enteredPin === ADMIN_PIN) {
        setAuthenticated(true);
        if (pinOverlay) pinOverlay.style.display = 'none';
        if (typeof window.renderAdminDashboard === 'function') {
          window.renderAdminDashboard();
        }
      } else {
        if (pinError) {
          pinError.textContent = 'PIN Salah. Silakan coba lagi.';
          pinError.style.display = 'block';
        }
        pinInput.value = '';
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      setAuthenticated(false);
      window.location.reload();
    });
  }
}

document.addEventListener('DOMContentLoaded', initAdminAuth);
