document.addEventListener('DOMContentLoaded', () => {
  window.auth.onAuthStateChanged((user) => {
    const userRef = window.database.ref('users');

    if (user) {
      console.log("✅ Utilisateur connecté :", user.email);
      //  alert(`Bienvenue ${user.email}!`);
      userRef.set({
        connecté: true,
        email: user.email || '',
        uid: user.uid || ''
      })
      .then(() => {
        console.log("🔐 Mise à jour 'connecté: true' réussie.");
        // Optionnel : redirection vers le dashboard si tu es sur index.html
        if (window.location.pathname.includes('index.html')) {
          window.location.href = 'dashboard.html';
        }
      })
      .catch((err) => {
        console.error("❌ Erreur de mise à jour du statut utilisateur :", err);
      });

    } else {
      console.log("🚫 Aucun utilisateur connecté.");

      userRef.set({
        connecté: false,
        email: '',
        uid: ''
      })
      .then(() => {
        console.log("🔐 Mise à jour 'connecté: false' réussie.");
        // Optionnel : redirection vers la page de login si on est sur dashboard.html
        if (window.location.pathname.includes('dashboard.html')) {
          window.location.href = 'index.html';
        }
      })
      .catch((err) => {
        console.error("❌ Erreur de mise à jour lors de la déconnexion :", err);
      });
    }
  });
});