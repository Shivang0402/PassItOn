const initFileInputs = () => {
  document.querySelectorAll('.file-upload-input').forEach((input) => {
    const wrapper = input.closest('.file-upload');
    const nameSpan = wrapper?.querySelector('.file-upload-name');
    const updateName = () => {
      if (!nameSpan) return;
      nameSpan.textContent = input.files.length ? input.files[0].name : 'No file chosen';
    };
    input.addEventListener('change', updateName);
    updateName();
  });
};

const initCommon = () => {
  document.querySelectorAll('.logout-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      handleLogout();
    });
  });
};

const safeCall = async (fn) => {
  if (typeof fn === 'function') return fn();
};

const initPage = async () => {
  initCommon();
  initFileInputs();
  await safeCall(initLoginPage);
  await safeCall(initRegisterPage);
  await safeCall(initForgotPasswordPage);
  await safeCall(initDashboardPage);
  await safeCall(initAccountPage);
  await safeCall(initListItemPage);
  await safeCall(initMyListingsPage);
};

document.addEventListener('DOMContentLoaded', initPage);
