/* ============================================
   REGISTER PAGE — SCRIPT
   ============================================ */
(function () {
  'use strict';

  // ─── DOM References ────────────────────────
  const form          = document.getElementById('registerForm');
  const nameInput     = document.getElementById('name');
  const identityInput = document.getElementById('identity');
  const passwordInput = document.getElementById('password');
  
  const identityLabel = document.getElementById('identityLabel');
  const identityIcon  = document.getElementById('identityIcon');
  const identityBadge = document.getElementById('identityBadge');
  const identityWrap  = document.getElementById('identityWrapper');
  
  const nameError     = document.getElementById('nameError');
  const identityError = document.getElementById('identityError');
  const passwordError = document.getElementById('passwordError');
  
  const togglePwdBtn  = document.getElementById('togglePassword');
  const eyeOpen       = document.getElementById('eyeOpen');
  const eyeClosed     = document.getElementById('eyeClosed');
  
  const btnRegister   = document.getElementById('btnRegister');
  const toast         = document.getElementById('toast');
  const toastIcon     = document.getElementById('toastIcon');
  const toastMsg      = document.getElementById('toastMessage');

  // ─── SVG Icons ─────────────────────────────
  const ICONS = {
    user:  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    email: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>',
    phone: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'
  };

  // ─── State ─────────────────────────────────
  let fieldMode = 'none'; // 'none' | 'email' | 'phone'

  // ─── Phone Mask (BR format) ────────────────
  function formatPhone(digits) {
    const d = digits.replace(/\D/g, '').slice(0, 11);
    if (d.length === 0) return '';
    if (d.length <= 2)  return '(' + d;
    if (d.length <= 6)  return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  function rawDigits(value) {
    return value.replace(/\D/g, '');
  }

  // ─── Field Detection & Formatting ─────────
  function detectAndFormat() {
    const raw = identityInput.value;

    if (raw.length === 0) {
      setMode('none');
      return;
    }

    const firstChar = raw.charAt(0);

    if (/\d/.test(firstChar)) {
      if (fieldMode !== 'phone') setMode('phone');
      const digits = rawDigits(raw);
      identityInput.value = formatPhone(digits);
      identityInput.setAttribute('maxlength', '15');
    } else {
      if (fieldMode !== 'email') setMode('email');
      identityInput.removeAttribute('maxlength');
    }
  }

  function setMode(mode) {
    fieldMode = mode;

    if (mode === 'email') {
      identityIcon.innerHTML = ICONS.email;
      identityLabel.textContent = 'E-mail';
      identityInput.placeholder = 'seu@email.com';
      identityBadge.textContent = 'e-mail';
      identityBadge.className = 'input-badge show email';
    } else if (mode === 'phone') {
      identityIcon.innerHTML = ICONS.phone;
      identityLabel.textContent = 'Telefone';
      identityInput.placeholder = '(00) 00000-0000';
      identityBadge.textContent = 'telefone';
      identityBadge.className = 'input-badge show phone';
    } else {
      identityIcon.innerHTML = ICONS.user;
      identityLabel.textContent = 'E-mail ou Telefone';
      identityInput.placeholder = 'Digite seu e-mail ou telefone';
      identityBadge.className = 'input-badge';
      identityInput.removeAttribute('maxlength');
    }
  }

  // ─── Validation ────────────────────────────
  function validateName() {
    const val = nameInput.value.trim();
    if (!val) {
      showError(nameInput.closest('.input-wrapper'), nameError, 'O nome é obrigatório.');
      return false;
    }
    clearError(nameInput.closest('.input-wrapper'), nameError);
    return true;
  }

  function validateIdentity() {
    const val = identityInput.value.trim();
    if (!val) {
      showError(identityWrap, identityError, 'Este campo é obrigatório.');
      return false;
    }
    if (fieldMode === 'email') {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(val)) {
        showError(identityWrap, identityError, 'Digite um e-mail válido.');
        return false;
      }
    }
    if (fieldMode === 'phone') {
      const digits = rawDigits(val);
      if (digits.length < 10 || digits.length > 11) {
        showError(identityWrap, identityError, 'Digite um telefone válido com DDD.');
        return false;
      }
    }
    clearError(identityWrap, identityError);
    return true;
  }

  function validatePassword() {
    const val = passwordInput.value;
    if (!val) {
      showError(passwordInput.closest('.input-wrapper'), passwordError, 'A senha é obrigatória.');
      return false;
    }
    if (val.length < 4) {
      showError(passwordInput.closest('.input-wrapper'), passwordError, 'Mínimo de 4 caracteres.');
      return false;
    }
    clearError(passwordInput.closest('.input-wrapper'), passwordError);
    return true;
  }

  function showError(wrapper, errorEl, msg) {
    wrapper.classList.add('error');
    wrapper.classList.remove('success');
    errorEl.textContent = msg;
    errorEl.classList.add('show');
  }

  function clearError(wrapper, errorEl) {
    wrapper.classList.remove('error');
    errorEl.classList.remove('show');
  }

  // ─── Toast ─────────────────────────────────
  function showToast(message, type) {
    toastIcon.textContent = type === 'success' ? '✓' : '✕';
    toastMsg.textContent = message;
    toast.className = 'toast show ' + type;
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () {
      toast.className = 'toast';
    }, 3500);
  }

  // ─── Toggle Password Visibility ────────────
  togglePwdBtn.addEventListener('click', function () {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    eyeOpen.style.display  = isHidden ? 'none'  : 'block';
    eyeClosed.style.display = isHidden ? 'block' : 'none';
  });

  // ─── Input Events ─────────────────────────
  nameInput.addEventListener('input', function() {
    if (nameInput.closest('.input-wrapper').classList.contains('error')) validateName();
  });

  identityInput.addEventListener('input', function () {
    detectAndFormat();
    if (identityWrap.classList.contains('error')) validateIdentity();
  });

  passwordInput.addEventListener('input', function () {
    if (passwordInput.closest('.input-wrapper').classList.contains('error')) validatePassword();
  });

  // ─── Form Submit ───────────────────────────
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const isNameOk      = validateName();
    const isIdentityOk  = validateIdentity();
    const isPasswordOk  = validatePassword();

    if (!isNameOk || !isIdentityOk || !isPasswordOk) {
      // Shake animation
      const card = document.getElementById('registerCard');
      card.style.animation = 'none';
      void card.offsetWidth; // force reflow
      card.style.animation = 'shake 0.4s ease';
      return;
    }

    // Loading state
    btnRegister.classList.add('loading');
    btnRegister.disabled = true;

    // Simulated registration
    setTimeout(function () {
      btnRegister.classList.remove('loading');
      showToast('Cadastro realizado com sucesso!', 'success');

      // Success glow on card
      nameInput.closest('.input-wrapper').classList.add('success');
      identityWrap.classList.add('success');
      passwordInput.closest('.input-wrapper').classList.add('success');
      
      // Redirect to login after a short delay
      setTimeout(function() {
        window.location.href = 'index.html';
      }, 1500);
    }, 1800);
  });

  // ─── Shake Keyframes (injected) ────────────
  var style = document.createElement('style');
  style.textContent = '@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }';
  document.head.appendChild(style);

})();
