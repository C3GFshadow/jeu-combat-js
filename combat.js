// Importation du module readline pour gérer les entrées de l'utilisateur
const readline = require('readline');

// Création de l'interface de lecture pour les entrées de la console
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("Bienvenue dans le combat !");
console.log("Vous êtes le Guerrier du Feu, et vous allez affronter le Sombre Lutin.");
console.log("Votre objectif est de réduire les PV de votre adversaire à zéro.");

// Définition des combattants avec leurs caractéristiques
const player = {
    name: "Guerrier du Feu",
    health: 100,
    attacks: [
        { name: "Frappe Rapide", power: 10, accuracy: 0.5 },
        { name: "Soin Léger", power: 15, accuracy: 0.33, healing: true },
        { name: "Coup Puissant", power: 20, accuracy: 0.33 },
        { name: "Frappe Dévastatrice", power: 30, accuracy: 0.25 }
    ]
};

const enemy = {
    name: "Sombre Lutin",
    health: 100,
    attacks: [
        { name: "Attaque Sournoise", power: 15, accuracy: 0.7 },
        { name: "Coup Bas", power: 10, accuracy: 0.6 }
    ]
};

// afficher l'état des combattants (PV restants)
const displayStatus = () => {
    console.log(`\n${player.name} PV: ${player.health}`);
    console.log(`${enemy.name} PV: ${enemy.health}`);
};

// effectuer une attaque
const performAttack = (attacker, attack, target) => {
    const hitChance = Math.random(); // Déterminer si l'attaque touche
    if (hitChance <= attack.accuracy) {
        if (attack.healing) {
            attacker.health += attack.power; // Appliquer le soin
            console.log(`${attacker.name} utilise ${attack.name} et récupère ${attack.power} PV.`);
        } else {
            target.health -= attack.power; // Infliger des dégâts 
            console.log(`${attacker.name} utilise ${attack.name} et inflige ${attack.power} PV de dégâts à ${target.name}.`); 
        }
    } else {
        console.log(`${attacker.name} rate son attaque ${attack.name}.`); // Message si l'attaque échoue
    }
};

//  gérer le tour du joueur
const playerTurn = () => {
    displayStatus(); // Afficher les PV restants avant le tour
    console.log("\nC'est à votre tour ! Choisissez votre attaque :");
    
    // Afficher les options d'attaque disponibles
    player.attacks.forEach((attack, index) => {
        console.log(`${index + 1}. ${attack.name} (Puissance: ${attack.power}, Précision: ${Math.round(attack.accuracy * 100)}%)`);
    });

    // Demander au joueur de choisir une attaque
    rl.question('Entrez le numéro de l\'attaque : ', (answer) => {
        const attackIndex = parseInt(answer) - 1; // Convertir la réponse en nombre

        // Vérifie si l'entrée est valide
        if (isNaN(attackIndex) || attackIndex < 0 || attackIndex >= player.attacks.length) {
            console.log("Choix invalide. Veuillez entrer un numéro correspondant à une attaque.");
            playerTurn(); // Répéter le tour du joueur
        } else {
            console.log(`Vous avez choisi ${player.attacks[attackIndex].name}.`);
            performAttack(player, player.attacks[attackIndex], enemy); // Effectuer l'attaque
            if (enemy.health > 0) {
                enemyTurn(); // Passer au tour de l'ennemi si l'ennemi est encore en vie
            } else {
                console.log(`\n${enemy.name} a été vaincu ! Vous avez gagné le combat !`);
                rl.close(); // Fermer l'interface de lecture
            }
        }
    });
};

//  gérer le tour de l'ennemi
const enemyTurn = () => {
    const attackIndex = Math.floor(Math.random() * enemy.attacks.length); // Choix aléatoire de l'attaque
    console.log(`\n${enemy.name} attaque !`);
    performAttack(enemy, enemy.attacks[attackIndex], player); // Effectuer l'attaque de l'ennemi
    
    // Vérifier si le joueur a été vaincu
    if (player.health <= 0) {
        console.log(`\n${player.name} a été vaincu ! Vous avez perdu le combat.`);
        rl.close(); // Fermer l'interface de lecture
    } else {
        displayStatus(); // Afficher l'état après le tour de l'ennemi
        playerTurn(); // Retourner au tour du joueur
    }
};
displayStatus(); 
playerTurn(); // Démarrer le tour du joueur
