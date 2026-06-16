const TOAST_STYLES = document.createElement('style');
TOAST_STYLES.textContent = `
  .toast-container {
    position: fixed; top: 20px; right: 20px; z-index: 99999;
    display: flex; flex-direction: column; gap: 8px;
    font-family: 'DM Sans', sans-serif;
  }
  .toast {
    padding: 14px 20px; border-radius: 12px; color: white;
    font-weight: 600; font-size: 14px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    animation: slideInRight 0.3s ease, fadeIn 0.3s ease;
    display: flex; align-items: center; gap: 10px;
    max-width: 380px; line-height: 1.4;
  }
  .toast-success { background: #16a34a; }
  .toast-error { background: #dc2626; }
  .toast-info { background: #b45309; }
  .toast-close { margin-left: auto; cursor: pointer; opacity: 0.8; font-size: 18px; background: none; border: none; color: white; }
  .toast-close:hover { opacity: 1; }
`;
document.head.appendChild(TOAST_STYLES);

let container = null;
function getContainer() {
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

export function toast(message, type = 'info', duration = 4000) {
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  el.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span style="flex:1">${message}</span><button class="toast-close">✕</button>`;
  el.querySelector('.toast-close').onclick = () => el.remove();
  getContainer().appendChild(el);
  setTimeout(() => { if (el.parentNode) { el.style.animation = 'fadeIn 0.3s ease reverse'; setTimeout(() => el.remove(), 300); } }, duration);
}
