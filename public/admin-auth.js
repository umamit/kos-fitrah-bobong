// === Admin Authentication via Supabase Auth (Email & Password) ===
function isUserAuthenticated() {
  return !!getAuthToken();
}

function initAdminAuth() {
  const authOverlay = document.getElementById('auth-overlay');
  const authForm = document.getElementById('auth-form');
  const emailInput = document.getElementById('auth-email');
  const passwordInput = document.getElementById('auth-password');
  const authError = document.getElementById('auth-error');
  const loginSubmitBtn = document.getElementById('auth-submit-btn');
  const logoutBtn = document.getElementById('admin-logout-btn');

  if (isUserAuthenticated()) {
    if (authOverlay) authOverlay.style.display = 'none';
  } else {
    if (authOverlay) authOverlay.style.display = 'flex';
    if (emailInput) emailInput.focus();
  }

  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      const password = passwordInput.value;

      if (authError) authError.style.display = 'none';
      if (loginSubmitBtn) {
        loginSubmitBtn.disabled = true;
        loginSubmitBtn.textContent = 'Memverifikasi...';
      }

      try {
        await supabaseSignIn(email, password);
        if (authOverlay) authOverlay.style.display = 'none';
        if (typeof window.renderAdminDashboard === 'function') {
          window.renderAdminDashboard();
        }
      } catch (err) {
        if (authError) {
          authError.textContent = err.message || 'Email atau password salah.';
          authError.style.display = 'block';
        }
      } finally {
        if (loginSubmitBtn) {
          loginSubmitBtn.disabled = false;
          loginSubmitBtn.textContent = 'Masuk ke Dashboard';
        }
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await supabaseSignOut();
      window.location.reload();
    });
  }
}

document.addEventListener('DOMContentLoaded', initAdminAuth);
