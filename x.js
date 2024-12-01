// Fetch the API key using POST
async function getApiKey() {
    try {
        console.log("Fetching API key...");
        const response = await fetch(
            "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys",
            {
                method: "POST",
            }
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

// Fetch planet data using the API key
async function fetchPlanets(apiKey) {
    try {
        console.log("Fetching planets...");
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

// Render planet data dynamically into the DOM
function renderPlanets(planets) {
    const planetList = document.getElementById("planet-list");

    if (!planetList) {
        console.error("Element with ID 'planet-list' not found.");
        return;
    }

    planetList.innerHTML = ""; // Clear any previous content

    planets.forEach((planet) => {
        const listItem = document.createElement("li");
        listItem.className = "planet-item";

        listItem.innerHTML = `
            <div class="planet-details">
                <h2>${planet.name}</h2>
                <p><b>Latin Name:</b> ${planet.latinName}</p>
                <p><b>Type:</b> ${planet.type}</p>
                <p><b>Rotation Period:</b> ${planet.rotation} Earth days</p>
                <p><b>Circumference:</b> ${planet.circumference.toLocaleString()} km</p>
                <p><b>Distance from Sun:</b> ${planet.distance.toLocaleString()} km</p>
                <p><b>Orbital Period:</b> ${planet.orbitalPeriod} Earth days</p>
                <p><b>Temperature (Day/Night):</b> ${planet.temp.day}°C / ${planet.temp.night}°C</p>
                <p>${planet.desc}</p>
            </div>
        `;

        planetList.appendChild(listItem);
    });
}

// Set up search functionality
function setupSearch(planets) {
    const searchBar = document.getElementById("search-bar");
    const searchButton = document.getElementById("search-button");
    const searchResult = document.getElementById("search-result");

    if (!searchBar || !searchButton || !searchResult) {
        console.error("Search elements are missing.");
        return;
    }

    function performSearch() {
        const query = searchBar.value.toLowerCase().trim();
        searchResult.innerHTML = ""; // Clear previous results

        if (query === "") {
            alert("Please enter a planet name to search.");
            return;
        }

        const matchingPlanets = planets.filter((planet) =>
            planet.name.toLowerCase().includes(query)
        );

        if (matchingPlanets.length === 0) {
            searchResult.innerHTML = `<p>No matching planets found.</p>`;
            return;
        }

        matchingPlanets.forEach((planet) => {
            const resultItem = document.createElement("li");
            resultItem.textContent = planet.name;
            searchResult.appendChild(resultItem);
        });
    }

    searchButton.addEventListener("click", performSearch);
    searchBar.addEventListener("keydown", (e) => {
        if (e.key === "Enter") performSearch();
    });
}

// Load and initialize the solar system data
async function loadSolarSystemData() {
    const apiKey = await getApiKey();

    if (!apiKey) {
        console.error("Failed to retrieve API key. Cannot continue.");
        return;
    }

    const planets = await fetchPlanets(apiKey);
    if (!planets) {
        console.error("Failed to fetch planets. Cannot continue.");
        return;
    }

    renderPlanets(planets); // Render the planets
    setupSearch(planets); // Set up the search functionality
}

// Ensure the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", loadSolarSystemData);
