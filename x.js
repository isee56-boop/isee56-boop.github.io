// Function to fetch planet data, with a fallback to local backup data
async function fetchPlanets() {
    try {
        console.log("Fetching planet data from API...");
        
        // Try fetching from API
        const response = await fetch("https://i4kif2xfk7.execute-api.eu-north-1.amazonaws.com/bodies", {
            method: "GET",
            headers: { "x-zocom": "solaris-7BTxHCyHhzIME5TI" },
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch planets: HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fetched planets from API:", data.bodies);
        return data.bodies;
    } catch (error) {
        console.error("Error fetching planets from API:", error);
        alert("Failed to fetch data from API. Using local backup data instead.");
        
        // Use local backup data
        try {
            const backupResponse = await fetch("backup.json");
            if (!backupResponse.ok) {
                throw new Error(`Failed to load backup data: HTTP ${backupResponse.status}`);
            }
            const backupData = await backupResponse.json();
            console.log("Using local backup data:", backupData);
            return backupData.bodies?.bodies || [];
        } catch (backupError) {
            console.error("Error loading backup data:", backupError);
            alert("Failed to load backup data. Please try again later.");
            return [];
        }
    }
}

// Function to render the list of planets dynamically into the DOM
function renderPlanets(planets) {
    if (!Array.isArray(planets)) {
        console.error("Invalid planet data format:", planets);
        return;
    }
    
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

// Function to set up the search functionality
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

// Function to set up the back button functionality
function setupBackButton() {
    const backButton = document.getElementById("return-to-list");
    if (!backButton) {
        console.error("Back button not found.");
        return;
    }
    backButton.addEventListener("click", () => {
        document.getElementById("planet-list").classList.remove("hidden");
        document.getElementById("planet-search").classList.remove("hidden");
        document.getElementById("planet-details").classList.remove("visible");
        console.log("Back to planet list.");
    });
}

// Function to load solar system data
async function loadSolarSystemData() {
    const planets = await fetchPlanets();
    if (!planets || planets.length === 0) return;
    renderPlanets(planets);
    setupSearch(planets);
    setupBackButton();
}

document.addEventListener("DOMContentLoaded", loadSolarSystemData);



