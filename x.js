// Fetch the API key using POST
async function getApiKey() {
    try {
        const response = await fetch(
            "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys",
            {
                method: "POST",
            }
        );
        if (!response.ok) {
            throw new Error("Failed to fetch API key");
        }
        const data = await response.json();
        return data.key;
    } catch (error) {
        console.error("Error fetching API key:", error);
        alert("Could not retrieve API key. Please try again later.");
    }
}

// Fetch celestial bodies using the API key
async function fetchPlanets(apiKey) {
    try {
        const response = await fetch(
            "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies",
            {
                method: "GET",
                headers: { "x-zocom": apiKey },
            }
        );
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        return data.bodies; // Return the array of celestial bodies
    } catch (error) {
        console.error("Error fetching planets:", error);
    }
}

// Render celestial bodies to the page
function renderPlanets(planets) {
    const planetList = document.getElementById("planet-list");
    planetList.innerHTML = ""; // Clear previous content

    planets.forEach((body) => {
        const listItem = document.createElement("li");

        // Render moon information
        let moonInfo = "";
        if (body.moons && body.moons.length > 0) {
            moonInfo = `
                <h3>Moons:</h3>
                <ul>
                    ${body.moons
                        .map((moon) => `<li>${moon}</li>`)
                        .join("")}
                </ul>
            `;
        } else {
            moonInfo = `<p>No moons</p>`;
        }

        // Render planet details
        listItem.innerHTML = `
            <div class="planet-container">
                <div class="planet-details">
                    <h2><b>${body.name}</b></h2>
                    <p><b>Latin name:</b> ${body.latinName}</p>
                    <p><b>Type:</b> ${body.type}</p>
                    <p><b>Rotation:</b> ${body.rotation} Earth days</p>
                    <p><b>Circumference:</b> ${body.circumference} km</p>
                    <p><b>Temperature (Day/Night):</b> ${body.temp.day}°C / ${body.temp.night}°C</p>
                    <p><b>Distance from Sun:</b> ${body.distance} km</p>
                    <p><b>Orbital Period:</b> ${body.orbitalPeriod} Earth days</p>
                    <p>${body.desc}</p>
                    ${moonInfo}
                </div>
            </div>
        `;

        planetList.appendChild(listItem);
    });
}

// Handle the search functionality
function setupSearch(planets) {
    const searchBar = document.getElementById("search-bar");
    const searchButton = document.getElementById("search-button");
    const searchResult = document.getElementById("search-result");
    const planetsVisuals = document.querySelectorAll(".planets-drawings > div"); // Visual planet elements

    // Perform search
    function performSearch() {
        const query = searchBar.value.toLowerCase().trim();
        searchResult.innerHTML = ""; // Clear previous results

        if (query === "") {
            alert("Please enter a planet name to search.");
            return;
        }

        let matches = 0; // Count matches

        planets.forEach((planet, index) => {
            if (planet.name.toLowerCase().includes(query)) {
                matches++;
                const listItem = document.createElement("li");
                listItem.textContent = planet.name;

                // Highlight and scroll to the planet's visual
                listItem.addEventListener("click", () => {
                    const visualPlanet = planetsVisuals[index];
                    visualPlanet.scrollIntoView({ behavior: "smooth", block: "center" });
                    visualPlanet.classList.add("highlight");
                    setTimeout(() => visualPlanet.classList.remove("highlight"), 2000);
                });

                searchResult.appendChild(listItem);

                // Automatically scroll to the first match
                if (matches === 1) {
                    const firstMatch = planetsVisuals[index];
                    firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
                    firstMatch.classList.add("highlight");
                    setTimeout(() => firstMatch.classList.remove("highlight"), 2000);
                }
            }
        });

        // Handle no matches
        if (matches === 0) {
            const noResult = document.createElement("li");
            noResult.textContent = "No matching planets found.";
            searchResult.appendChild(noResult);
        }
    }

    // Add event listeners
    searchButton.addEventListener("click", performSearch);
    searchBar.addEventListener("keydown", (e) => {
        if (e.key === "Enter") performSearch();
    });
}

// Load and initialize solar system data
async function loadSolarSystemData() {
    const apiKey = await getApiKey();

    if (!apiKey) {
        console.error("Failed to retrieve API key. Cannot continue.");
        return;
    }

    const planets = await fetchPlanets(apiKey);
    if (!planets) {
        console.error("Planets data is missing or malformed.");
        return;
    }

    renderPlanets(planets); // Render planets on the page
    setupSearch(planets); // Set up search functionality
}

// Initialize the app
document.addEventListener("DOMContentLoaded", loadSolarSystemData);

