    function signOutUser() {
  if (!window.auth) {
    alert("L’authentification n’est pas disponible !");
    console.error("Firebase Auth n’est pas initialisé.");
    return;
  }

  window.auth.signOut()
    .then(() => {
      console.log('✅ Déconnexion réussie');
      window.location.href = 'index.html';
    })
    .catch((err) => {
      console.error('❌ Erreur de déconnexion:', err);
      alert('Erreur de déconnexion: ' + err.message);
    });
}