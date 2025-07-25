/*
 * Crée un graphique linéaire avec Chart.js
 * @param {string} canvasId - ID de l'élément canvas HTML
 * @param {Array} dates - Tableau de dates (strings ou objets Date)
 * @param {Array} dataSets - Tableau d'objets de données pour chaque courbe
 * @param {string} [title] - Titre du graphique (optionnel)
 */
function createLineChart(canvasId, dates, dataSets, title) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates.map(date => new Date(date)),
            datasets: dataSets.map((dataset, i) => ({
                label: dataset.label,
                data: dataset.values,
                borderColor: dataset.color || getDefaultColor(i),
                backgroundColor: dataset.fillColor || `${dataset.color || getDefaultColor(i)}33`,
                borderWidth: 2,
                tension: 0.3,
                fill: dataset.fill || false
            }))
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: !!title,
                    text: title
                },
                legend: {
                    position: 'top'
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        displayFormats: {
                            hour: 'HH:mm'
                        }
                    }
                },
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// Couleurs par défaut (peut être personnalisé)
function getDefaultColor(index) {
    const colors = [
        '#FF6384', '#36A2EB', '#FFCE56',
        '#4BC0C0', '#9966FF', '#FF9F40'
    ];
    return colors[index % colors.length];
}
document.addEventListener('DOMContentLoaded', function () {
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
    let dataRef = window.database.ref("cultures/dernieres_mesures");
    let historiqueRef = window.database.ref("cultures/historiques");

    // Recuperation unique des infos de cultures
    if (culturesRef) {
        culturesRef.once('value').then((snapshot) => {
            const cultureInfos = snapshot.val();
            if (cultureInfos) {
                console.log("Infos de culture récupérées :", cultureInfos);
                cultureName.textContent = cultureInfos.nom || "---";
                humSensorName.textContent = cultureInfos.capteur_humidite_id || "---";
                electrovanneName.textContent = cultureInfos.electrovanne_id || "---";
            };
        }).catch((err) => {
            console.error("❌ Erreur lors de la récupération des infos de culture :", err);
        });
    }
    // Recuperation des valeurs en temps réel
    if (dataRef) {
        dataRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                console.log("Données reçues :", data);
                // Mise à jour des valeurs des capteurs et de l'état de la pompe
                humAir.textContent = data.humidite_air || "---";
                humSoil.textContent = data.humidite_sol || "---";
                tempAir.textContent = data.temperature || "---";
                valveState.textContent = data.etat_electrovanne ? "Ouverte" : "Fermée";
                // Commande de l'électrovanne
                valveBtn.addEventListener('click', () => {
                    const currentState = data.etat_electrovanne;
                    const newState = !currentState;
                    dataRef.update({ etat_electrovanne: newState });
                    valveState.textContent = newState ? "Ouverte" : "Fermée";
                    console.log("État de l'électrovanne mis à jour :", newState);
                });
            };
        });
    };

    // Récupération de l'historique
let temperatureChart = null;
let humiditeAirChart = null;
let humiditeSolChart = null;

historiqueRef.on('value', (snapshot) => {
    const data = snapshot.val();
    console.log("Historique :", data);

    if (!data || !data.timestamps) return;

    const timestamps = data.timestamps.map(t => new Date(t)); // déjà bien formattés
    const temperature = data.temperature || [];
    const humiditeAir = data.humidite_air || [];
    const humiditeSol = data.humidite_sol || [];

    // 🔁 Supprimer les anciens graphiques s’ils existent
    if (temperatureChart) temperatureChart.destroy();
    if (humiditeAirChart) humiditeAirChart.destroy();
    if (humiditeSolChart) humiditeSolChart.destroy();

    // 🌡️ Température
    temperatureChart = createLineChart(
        "graph-temperature",
        timestamps,
        [{
            label: "Température (°C)",
            values: temperature,
            color: "#FF6384"
        }],
        "Température de l'air"
    );

    // 💧 Humidité de l'air
    humiditeAirChart = createLineChart(
        "graph-humidite-air",
        timestamps,
        [{
            label: "Humidité de l'air (%)",
            values: humiditeAir,
            color: "#36A2EB"
        }],
        "Humidité de l'air"
    );

    // 🌱 Humidité du sol
    humiditeSolChart = createLineChart(
        "graph-humidite-sol",
        timestamps,
        [{
            label: "Humidité du sol (%)",
            values: humiditeSol,
            color: "#4BC0C0"
        }],
        "Humidité du sol"
    );
});


})
