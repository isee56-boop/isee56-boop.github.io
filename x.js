// Fetch the API key
async function getApiKey() {
    try {
        console.log("Fetching API key...");
        const response = await fetch(
            "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys",
            { method: "POST" }
        );

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

    // Clear previous content to avoid duplicates
    solarSystem.innerHTML = "";

    // Create planet elements dynamically
    planets.forEach((planet) => {
        const planetElement = document.createElement("div");
        planetElement.classList.add("planet");
        planetElement.id = planet.name.toLowerCase();
        planetElement.innerHTML = `<h2>${planet.name}</h2>`;
        solarSystem.appendChild(planetElement);

        // Add click event to show planet details
        planetElement.addEventListener("click", () => showPlanetInfo(planet));
    });
}

// Show planetspecific information and switch views
function showPlanetInfo(planet) {
    console.log("Showing info for planet:", planet);

    const solarSystem = document.getElementById("solar-system");
    const planetInfo = document.getElementById("planet-info");

    // Hide solar system and show planet info
    solarSystem.style.display = "none";
    planetInfo.style.display = "block";

    // Fill in planet information dynamically
    document.getElementById("planet-name").textContent = planet.name;
    document.getElementById("planet-latin-name").textContent = planet.latinName;
    document.getElementById("planet-desc").textContent = planet.desc;

    // Ensure proper rendering of data
    document.getElementById("planet-circumference").textContent = planet.circumference
        ? `${planet.circumference.toLocaleString()} km`
        : "Data saknas";
    document.getElementById("planet-distance").textContent = planet.distance
        ? `${planet.distance.toLocaleString()} km`
        : "Data saknas";
    document.getElementById("planet-temp-max").textContent = planet.temp?.day
        ? `${planet.temp.day}°C`
        : "Data saknas";
    document.getElementById("planet-temp-min").textContent = planet.temp?.night
        ? `${planet.temp.night}°C`
        : "Data saknas";
}

// Setup back button functionality
function setupBackButton() {
    const backButton = document.getElementById("back-to-main");
    const solarSystem = document.getElementById("solar-system");
    const planetInfo = document.getElementById("planet-info");

    backButton.addEventListener("click", () => {
        // Hide planet info and show solar system
        planetInfo.style.display = "none";
        solarSystem.style.display = "flex";
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
        name: "Jorden",
        latinName: "Tellus",
        desc: "Jorden är den största och mest kompakta av de inre planeterna.",
        circumference: 40075,
        distance: 149600000,
        temp: { day: 60, night: -50 },
    },
    {
        name: "Mars",
        latinName: "Mars",
        desc: "Mars är en torr ökenvärld med en tunn atmosfär.",
        circumference: 21344,
        distance: 227940000,
        temp: { day: 20, night: -73 },
    },
    // Add more planets as needed
];

// Load and initialize the solar system
async function loadSolarSystemData() {
    const apiKey = await getApiKey();
    const planets = apiKey ? await fetchPlanets(apiKey) : dummyPlanets;

    if (!planets) {
        console.warn("Using fallback data due to failed planet fetch.");
        return;
    }

    renderPlanets(planets);   // Render planets in the DOM
    setupSearch(planets);     // Setup search functionality
    setupBackButton();        // Setup back button
}

// Ensure the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", loadSolarSystemData);