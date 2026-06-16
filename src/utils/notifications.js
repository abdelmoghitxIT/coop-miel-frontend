const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function playNotificationSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    oscillator.connect(gain);
    gain.connect(audioCtx.destination);
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
    oscillator.frequency.setValueAtTime(600, audioCtx.currentTime + 0.15);
    oscillator.type = 'sine';
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.4);
  } catch (_) {}
}

export function initCommandesSSE(utilisateur, onNouvelleCommande) {
  if (!utilisateur || utilisateur.role !== 'admin') return () => {};

  if (!('Notification' in window) && !onNouvelleCommande) return () => {};

  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }

  const token = localStorage.getItem('token');
  if (!token) return () => {};

  let eventSource = null;
  let reconnectTimeout = null;

  function connect() {
    if (eventSource) eventSource.close();

    eventSource = new EventSource(`${API_URL}/api/commandes/events?token=${token}`);

    eventSource.addEventListener('nouvelle_commande', (e) => {
      try {
        const data = JSON.parse(e.data);

        if ('Notification' in window && Notification.permission === 'granted') {
          const notification = new Notification('Nouvelle commande !', {
            body: `De ${data.nom_client} - ${data.total} DA`,
            icon: 'https://res.cloudinary.com/dvqb5othw/image/upload/455519797_519692147275310_6436353706485380204_n_tzyopo',
          });
          notification.onclick = () => {
            window.focus();
            window.location.href = '/dashboard';
            notification.close();
          };
        }

        playNotificationSound();

        if (onNouvelleCommande) onNouvelleCommande(data);
      } catch (_) {}
    });

    eventSource.onerror = () => {
      if (eventSource) eventSource.close();
      reconnectTimeout = setTimeout(connect, 5000);
    };
  }

  connect();

  return () => {
    if (eventSource) eventSource.close();
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
  };
}
