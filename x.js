// Function to fetch the API key from the server
async function getApiKey() {
    try {
        console.log("Fetching API key...");
        const response = await fetch("https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys", { method: "POST" });
        if (!response.ok) {
            throw new Error(`Failed to fetch API key: HTTP ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched API key:", data.key);
        return data.key;
    } catch (error) {
        console.error("Error fetching API key:", error);
        alert("Could not retrieve API key. Using local backup data.");
        return null;
    }
}

// Function to fetch planet data, with a fallback to local backup data
async function fetchPlanets(apiKey) {
    try {
        console.log("Fetching planets with API key:", apiKey);
        if (apiKey) {
            const response = await fetch("https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies", {
                method: "GET",
                headers: { "x-zocom": apiKey },
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch planets: HTTP ${response.status}`);
            }
            const data = await response.json();
            console.log("Fetched planets from API:", data.bodies);
            return data.bodies;
        }
    } catch (error) {
        console.error("Error fetching planets from API:", error);
        alert("Failed to fetch data from API. Using local backup data instead.");
        try {
            const backupResponse = await fetch("backup.json");
            if (!backupResponse.ok) {
                throw new Error(`Failed to load backup data: HTTP ${backupResponse.status}`);
            }
            const backupData = await backupResponse.json();
            console.log("Using local backup data:", backupData.bodies);
            return backupData.bodies;
        } catch (backupError) {
            console.error("Error loading backup data:", backupError);
            alert("Failed to load backup data. Please try again later.");
            return null;
        }
    }
}

// Function to render the list of planets dynamically into the DOM
function renderPlanets(planets) {
    const planetList = document.getElementById("planet-list");
    if (!planetList) {
        console.error("Element with ID 'planet-list' not found.");
        return;
    }
    planetList.innerHTML = "";
    planets.forEach((planet) => {
        const planetButton = document.createElement("button");
        planetButton.setAttribute("aria-label", `Lär dig mer om ${planet.name}`);
        planetButton.classList.add("planet-button");
        planetButton.textContent = planet.name;
        planetList.appendChild(planetButton);
        planetButton.addEventListener("click", () => showPlanetInfo(planet));
    });
    console.log("Rendering planets:", planets);
}

// Function to display planet details
function showPlanetInfo(planet) {
    document.getElementById("planet-list").classList.add("hidden");
    document.getElementById("planet-search").classList.add("hidden");
    const planetDetails = document.getElementById("planet-details");
    planetDetails.classList.add("visible");
    document.getElementById("planet-title").textContent = planet.name;
    document.getElementById("planet-subtitle").textContent = planet.latinName;
    document.getElementById("planet-description").textContent = planet.desc;
    document.getElementById("planet-circumference").textContent = `${planet.circumference.toLocaleString()} km`;
    document.getElementById("planet-distance").textContent = `${planet.distance.toLocaleString()} km`;
    document.getElementById("planet-max-temp").textContent = `${planet.temp.day}°C`;
    document.getElementById("planet-min-temp").textContent = `${planet.temp.night}°C`;
    console.log(`Displaying info for planet: ${planet.name}`);
}

// Function to set up the back button
function setupBackButton() {
    document.getElementById("return-to-list").addEventListener("click", () => {
        document.getElementById("planet-list").classList.remove("hidden");
        document.getElementById("planet-search").classList.remove("hidden");
        document.getElementById("planet-details").classList.remove("visible");
        console.log("Back to planet list.");
    });
}

// Function to set up search functionality
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

// Function to load solar system data
async function loadSolarSystemData() {
    const apiKey = await getApiKey();
    const planets = await fetchPlanets(apiKey);
    if (!planets) return;
    renderPlanets(planets);
    setupSearch(planets);
    setupBackButton();
}

document.addEventListener("DOMContentLoaded", loadSolarSystemData);


