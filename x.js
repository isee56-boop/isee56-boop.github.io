// Fetch the API key
async function getApiKey() {
    try {
        console.log("Fetching API key...");
        const response = await fetch(
            "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys",
            { method: "POST" }
        );

        console.log("API key response:", response);

        if (!response.ok) {
            throw new Error(`Failed to fetch API key: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched API key:", data.key);
        return data.key;
    } catch (error) {
        console.error("Error fetching API key:", error);
        alert("Could not retrieve API key. Please try again later.");
        return null;
    }
}

// Fetch planet data
async function fetchPlanets(apiKey) {
    try {
        console.log("Fetching planets with API key:", apiKey);

        const response = await fetch(
            "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies",
            {
                method: "GET",
                headers: { "x-zocom": apiKey },
            }
        );

        console.log("Planets response:", response);

        if (!response.ok) {
            throw new Error(`Failed to fetch planets: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched planets:", data.bodies);
        return data.bodies;
    } catch (error) {
        console.error("Error fetching planets:", error);
        alert("Could not fetch planets. Please try again later.");
        return null;
    }
}

// Render planets into the #solar-system section
function renderPlanets(planets) {
    const solarSystem = document.getElementById("solar-system");

    if (!solarSystem) {
        console.error("Element with ID 'solar-system' not found.");
        return;
    }

    planets.forEach((planet) => {
        const planetElement = document.getElementById(planet.name.toLowerCase());

        if (planetElement) {
            planetElement.innerHTML = `
                <h2>${planet.name}</h2>
                <p><b>Latin Name:</b> ${planet.latinName}</p>
                <p><b>Type:</b> ${planet.type}</p>
                <p><b>Rotation Period:</b> ${planet.rotation} Earth days</p>
                <p><b>Circumference:</b> ${planet.circumference.toLocaleString()} km</p>
                <p><b>Distance from Sun:</b> ${planet.distance.toLocaleString()} km</p>
                <p><b>Orbital Period:</b> ${planet.orbitalPeriod} Earth days</p>
                <p><b>Temperature (Day/Night):</b> ${planet.temp.day}°C / ${planet.temp.night}°C</p>
                <p>${planet.desc}</p>
            `;
        } else {
            console.warn(`No HTML element found for planet: ${planet.name}`);
        }
    });
}

// Highlight planets based on search input
function setupSearch(planets) {
    const searchInput = document.getElementById("search-input");

    if (!searchInput) {
        console.error("Search input not found.");
        return;
    }

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();
        planets.forEach((planet) => {
            const planetElement = document.getElementById(planet.name.toLowerCase());
            if (planetElement) {
                planetElement.style.display = planet.name.toLowerCase().includes(query)
                    ? "block"
                    : "none";
            }
        });
    });
}

// Fallback data for development/testing
const dummyPlanets = [
    {
        name: "Solen",
        latinName: "Sol",
        type: "star",
        rotation: 25,
        circumference: 4370000,
        distance: 0,
        orbitalPeriod: 0,
        temp: { day: 5500, night: 5500 },
        desc: "Solen är stjärnan i centrum av solsystemet.",
    },
    {
        name: "Merkurius",
        latinName: "Mercury",
        type: "planet",
        rotation: 58.6,
        circumference: 15329,
        distance: 57910000,
        orbitalPeriod: 88,
        temp: { day: 430, night: -180 },
        desc: "Merkurius är den innersta planeten i solsystemet.",
    },
    // Add more planets as needed
];

// Load and initialize the solar system
async function loadSolarSystemData() {
    const apiKey = await getApiKey();

    if (!apiKey) {
        console.warn("Using fallback data due to missing API key.");
        renderPlanets(dummyPlanets);
        setupSearch(dummyPlanets);
        return;
    }

    const planets = await fetchPlanets(apiKey);
    if (!planets) {
        console.warn("Using fallback data due to failed planet fetch.");
        renderPlanets(dummyPlanets);
        setupSearch(dummyPlanets);
        return;
    }

    renderPlanets(planets); // Populate the planets in the DOM
    setupSearch(planets); // Enable search functionality
}

// Ensure the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", loadSolarSystemData);
