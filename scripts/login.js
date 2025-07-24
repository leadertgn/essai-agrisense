
// chargement du DOM 
document.addEventListener('DOMContentLoaded', () => {
    // Recupération du DOM 
    const form = document.getElementById('login-form');
    let emailInput = document.getElementById('email');
    let passwordInput = document.getElementById('password');
    const btnSubmit = document.getElementById('login-btn');

    btnSubmit.addEventListener('click', (e) => {
        e.preventDefault(); // Empêche le rechargement de la page
        
        const email = emailInput.value.trim(); // Récupération de l'email
        const password = passwordInput.value.trim(); // Récupération du mot de passe
        // Vérification des champs
        if (email === '' || password === '') {
            alert('Veuillez remplir tous les champs.');
            console.error('Champs vides:', { email: email, password: password })
            return;
        }else {
            // Authentification
           window.auth.signInWithEmailAndPassword(email,password)
            .then((userCredential) => {
                // Connexion réussie
                const user = userCredential.user;
                const userRef = window.database.ref('users'); // reference au noeuds users
                console.log('Connexion réussie:', user);
            userRef.set({
                connecté: true,
                email: user.email,
                uid: user.uid
            })
            .then(() => {
                // Redirection seulement après mise à jour réussie
                window.location.href = 'dashboard.html';
            }).catch((err) => {
                console.error("Erreur lors de la mise à jour de l'utilisateur :", err);
            });
            }).catch((err) => {
                // Gestion des erreurs
                console.error('Erreur de connexion:', err);
                alert('Erreur de connexion: ' + err.message);
            })
        }

    })
})