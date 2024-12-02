document.addEventListener("DOMContentLoaded", async () => {
    // Select necessary elements
    const solarSystem = document.getElementById("solar-system");
    const planetInfo = document.getElementById("planet-info");
    const backButton = document.getElementById("back-to-main");

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

    // Render a single planet (for now: Solen)
    function renderPlanet(planet) {
        console.log("Rendering planet:", planet);

        // Create a planet element dynamically
        const planetElement = document.createElement("article");
        planetElement.classList.add("planet");
        planetElement.id = planet.name.toLowerCase();
        planetElement.innerHTML = `<h2>${planet.name}</h2>`;
        solarSystem.appendChild(planetElement);

        // Add click event to show planet details
        planetElement.addEventListener("click", () => showPlanetInfo(planet));
    }

    // Show planetspecific information and switch views
    function showPlanetInfo(planet) {
        console.log("Showing info for planet:", planet);

        // Hide solar system and show planet info
        solarSystem.style.display = "none";
        planetInfo.style.display = "block";

        // Fill in planet information dynamically
        document.getElementById("planet-name").textContent = planet.name;
        document.getElementById("planet-latin-name").textContent = planet.latinName;
        document.getElementById("planet-desc").textContent = planet.desc;
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
    backButton.addEventListener("click", () => {
        console.log("Returning to Solar System");

        // Switch views: show solar system, hide planet info
        planetInfo.style.display = "none";
        solarSystem.style.display = "flex";
    });

    // Main flow: Fetch data and render
    const apiKey = await getApiKey();
    if (!apiKey) {
        console.warn("Failed to fetch API key. Using fallback data.");
        const fallbackPlanet = {
            name: "Solen",
            latinName: "Sol",
            desc: "Solen är en stjärna som är centrum för vårt solsystem.",
            circumference: 4370000, // in km
            distance: 0, // in km
            temp: { day: 5500, night: 5500 }, // in °C
        };
        renderPlanet(fallbackPlanet);
    } else {
        const planets = await fetchPlanets(apiKey);
        if (planets && planets.length > 0) {
            renderPlanet(planets[0]); // Render only the first planet (e.g., Solen)
        }
    }
});
 