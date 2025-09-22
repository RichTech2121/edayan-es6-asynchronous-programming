document.addEventListener('DOMContentLoaded', () => {

    // PART 1: ES6 Classes (Adapted for Football)
    class Player {
        constructor(id, name, age, position, club) {
            this.id = id;
            this.name = name;
            this.age = age;
            this.position = position;
            this.club = club;
        }

        introduce() {
            return `My name is ${this.name}, I am ${this.age} years old, and I play as a ${this.position} for ${this.club}.`;
        }
    }

    class Manager {
        constructor(id, name, specialty) {
            this.id = id;
            this.name = name;
            this.specialty = specialty;
        }

        coach() {
            return `I am ${this.name} and my coaching philosophy is based on ${this.specialty}.`;
        }
    }

    // PART 2: Asynchronous JavaScript
    const fetchDataAsync = async () => {
        try {
            // Updated file path
            const response = await fetch('./data/roster.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Data fetched with Async/Await:', data);
            return data;
        } catch (error) {
            console.error('Error fetching data with Async/Await:', error);
            return null;
        }
    };
    
    // Main function to process and display data
    const displayData = async () => {
        const outputDiv = document.getElementById('output');
        outputDiv.innerHTML = '<p>Loading roster...</p>';

        const data = await fetchDataAsync();

        if (!data) {
            outputDiv.innerHTML = '<p class="highlight">Failed to load data. Please check the console.</p>';
            return;
        }

        // Destructure data with new names
        const { players, clubs, managers } = data;

        // Create class instances
        const playerObjects = players.map(p => new Player(p.id, p.name, p.age, p.position, p.club));
        const managerObjects = managers.map(m => new Manager(m.id, m.name, m.specialty));
        
        console.log("--- Class Method Examples ---");
        console.log(playerObjects[0].introduce()); // Messi's introduction
        console.log(managerObjects[0].coach());   // Pep's coaching line

        let htmlContent = '';

        // PART 3: Display Lists
        // Display Players (Highlighting veteran players > 33)
        htmlContent += '<h2>Players:</h2><ul>';
        playerObjects.forEach(player => {
            const highlight = player.age > 33 ? ' *' : ''; // Highlight veterans
            htmlContent += `<li>- ${player.name} (${player.age}) - ${player.position} for ${player.club}<span class="highlight">${highlight}</span></li>`;
        });
        htmlContent += '</ul>';

        // Display Clubs
        htmlContent += '<h2>Clubs:</h2><ul>';
        clubs.forEach(club => {
            htmlContent += `<li>- ${club.name} (${club.country}): ${club.description}</li>`;
        });
        htmlContent += '</ul>';
        
        // Display Managers
        htmlContent += '<h2>Managers:</h2><ul>';
        managerObjects.forEach(manager => {
            htmlContent += `<li>- ${manager.name} - Philosophy: ${manager.specialty}</li>`;
        });
        htmlContent += '</ul>';

        // PART 4: Data Relationships
        // Match player to their club description
        htmlContent += '<h2>Player-Club Relationships:</h2><ul>';
        playerObjects.forEach(player => {
            const clubDetails = clubs.find(c => c.name === player.club);
            if (clubDetails) {
                htmlContent += `<li>${player.name} → Plays for ${clubDetails.name} → ${clubDetails.description}</li>`;
            }
        });
        htmlContent += '</ul>';

        // Match club to its manager
        htmlContent += '<h2>Club-Manager Relationships:</h2><ul>';
        clubs.forEach(club => {
            const managerDetails = managerObjects.find(m => m.id === club.manager_id);
            if (managerDetails) {
                htmlContent += `<li>${club.name} → Managed by ${managerDetails.name}</li>`;
            }
        });
        htmlContent += '</ul>';

        // Render everything to the page
        outputDiv.innerHTML = htmlContent;
    };
    
    // Run the main function
    displayData();
});