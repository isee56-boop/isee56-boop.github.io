

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

// Render planets into the planet list section
function renderPlanets(planets) {
    const planetList = document.getElementById("planet-list");

    if (!planetList) {
        console.error("Element with ID 'planet-list' not found.");
        return;
    }

    // Clear previous content to avoid duplicates
    planetList.innerHTML = "";

    // Create planet buttons dynamically
    planets.forEach((planet) => {
        const planetButton = document.createElement("button");
        planetButton.setAttribute("aria-label", `Lär dig mer om ${planet.name}`);
        planetButton.classList.add("planet-button");
        planetButton.textContent = planet.name;
        planetList.appendChild(planetButton);

        // Add click event to show planet details
        planetButton.addEventListener("click", () => showPlanetInfo(planet));
    });
    console.log("Rendering planets:", planets);
}

// Show planet-specific information and switch views
function showPlanetInfo(planet) {
    const planetList = document.getElementById("planet-list");
    const planetDetails = document.getElementById("planet-details");

    // Hide the planet list and show planet details
    planetList.style.display = "none";
    planetDetails.classList.add("visible");

    // Populate planet details dynamically
    document.getElementById("planet-title").textContent = planet.name;
    document.getElementById("planet-subtitle").textContent = planet.latinName;
    document.getElementById("planet-description").textContent = planet.desc;
    document.getElementById("planet-circumference").textContent = `${planet.circumference.toLocaleString()} km`;
    document.getElementById("planet-distance").textContent = `${planet.distance.toLocaleString()} km`;
    document.getElementById("planet-max-temp").textContent = `${planet.temp.day}°C`;
    document.getElementById("planet-min-temp").textContent = `${planet.temp.night}°C`;

    console.log(`Displaying info for planet: ${planet.name}`);
}

// Setup back button functionality
function setupBackButton() {
    const backButton = document.getElementById("return-to-list");
    backButton.addEventListener("click", () => {
        const planetList = document.getElementById("planet-list");
        const planetDetails = document.getElementById("planet-details");

        // Hide planet details and show planet list
        planetDetails.classList.remove("visible");
        planetList.style.display = "flex";

        console.log("Back to planet list.");
    });
}

// Highlight planets based on search input
function setupSearch(planets) {
    const searchInput = document.getElementById("planet-search");

    if (!searchInput) {
        console.error("Search input not found.");
        return;
    }

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();
        planets.forEach((planet) => {
            const planetButton = document.querySelector(
                `button[aria-label='Lär dig mer om ${planet.name}']`
            );
            if (planetButton) {
                planetButton.style.display = planet.name.toLowerCase().includes(query)
                    ? "block"
                    : "none";
            }
        });
    });
}

// Load and initialize the solar system
async function loadSolarSystemData() {
    const apiKey = await getApiKey();
    if (!apiKey) {
        console.error("No API key available. Exiting.");
        return;
    }

    const planets = await fetchPlanets(apiKey);

    if (!planets) {
        console.error("No planets available. Exiting.");
        return;
    }

    renderPlanets(planets);   // Render planets in the DOM
    setupSearch(planets);     // Setup search functionality
    setupBackButton();        // Setup back button
}

// Ensure the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", loadSolarSystemData);

