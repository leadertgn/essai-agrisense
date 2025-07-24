document.addEventListener('DOMContentLoaded', function() {
    // Recuperation du dom des infos
    const cultureName = document.getElementById('nom-culture');
    const humSensorName = document.getElementById('capteur-hum-name');
    const electrovanneName = document.getElementById('electrovanne-name');
    // Recuperation des valeurs des capteurs et de l'état de la pompe
    let humAir = document.getElementById('hum-air');
    let tempAir = document.getElementById('temp-air');
    let humSoil = document.getElementById('hum-sol');
    const valveBtn = document.getElementById('btn-electrovanne');
    let valveState = document.getElementById('electrovanne-state')

    // Réfeérence au données firebase
    let culturesRef = window.database.ref('cultures/culture');
    let data
    // Recuperation unique des infos de cultures
    if(culturesRef){
        culturesRef.once('value').then((snapshot) =>{
            const cultureInfos = snapshot.val();
            if(cultureInfos){
                console.log("Infos de culture récupérées :", cultureInfos);
                cultureName.textContent = cultureInfos.nom || "---";
                humSensorName.textContent = cultureInfos.capteur_humidite_id || "---";
                electrovanneName.textContent = cultureInfos.electrovanne_id || "---";
            }
        }).catch((err) =>{
            console.error("❌ Erreur lors de la récupération des infos de culture :", err);
        })
    }
})