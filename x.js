// Function to fetch the API key from the server
async function getApiKey() {
    try {
        console.log("Fetching API key...");

        // Step 1: Send a POST request to the server to retrieve the API key
        // The server is hosted at the specified endpoint
        const response = await fetch(
            "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys",
            { method: "POST" } // Using the POST method as required by the API
        );

        // Step 2: Check if the response status is OK (status code 200-299)
        // If not, throw an error with a detailed status message
        if (!response.ok) {
            throw new Error(`Failed to fetch API key: HTTP ${response.status}`);
        }

        // Step 3: Parse the JSON response to extract the API key
        // Assuming the server returns an object with a "key" property
        const data = await response.json();
        console.log("Fetched API key:", data.key); // Log the key for debugging
        return data.key; // Return the API key to be used elsewhere in the code

    } catch (error) {
        // Step 4: Handle any errors that occur during the fetch operation
        // Log the error details to the console for debugging
        console.error("Error fetching API key:", error);

        // Notify the user of the error through an alert box
        alert("Could not retrieve API key. Please try again later.");

        // Return null to indicate failure in fetching the API key
        return null;
    }
}

// Function to fetch planet data from the API using the provided API key
async function fetchPlanets(apiKey) {
    try {
        console.log("Fetching planets with API key:", apiKey);

        // Step 1: Send a GET request to the server to retrieve planet data
        // The server expects the API key in the "x-zocom" header
        const response = await fetch(
            "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies",
            {
                method: "GET", // The GET method is used to retrieve data
                headers: { "x-zocom": apiKey }, // Add the API key as a custom header
            }
        );

        // Step 2: Check if the response is successful
        // If the status code is not in the 200-299 range, throw an error
        if (!response.ok) {
            throw new Error(`Failed to fetch planets: HTTP ${response.status}`);
        }

        // Step 3: Parse the response JSON to extract the planet data
        // The server is expected to return an object with a "bodies" property
        const data = await response.json();
        console.log("Fetched planets:", data.bodies); // Log the retrieved data for debugging
        return data.bodies; // Return the array of planet objects

    } catch (error) {
        // Step 4: Handle any errors that occur during the fetch operation
        // Log the error to the console to help with debugging
        console.error("Error fetching planets:", error);

        // Notify the user of the failure through an alert message
        alert("Could not fetch planets. Please try again later.");

        // Return null to indicate that no data could be fetched
        return null;
    }
}



// Function to render the list of planets dynamically into the DOM
function renderPlanets(planets) {
    // Step 1: Get the DOM element where the planet list will be rendered
    const planetList = document.getElementById("planet-list");

    // Step 2: Ensure the planet list element exists in the DOM
    // If the element is missing, log an error and stop execution
    if (!planetList) {
        console.error("Element with ID 'planet-list' not found.");
        return;
    }

    // Step 3: Clear any previous content in the planet list container
    // This prevents duplicate content from being appended
    planetList.innerHTML = "";

    // Step 4: Iterate over the array of planets
    planets.forEach((planet) => {
        // Create a button element for each planet
        const planetButton = document.createElement("button");

        // Set an accessible label describing the button's purpose
        planetButton.setAttribute("aria-label", `Lär dig mer om ${planet.name}`);

        // Add a CSS class for consistent styling of the buttons
        planetButton.classList.add("planet-button");

        // Set the button text to the name of the planet
        planetButton.textContent = planet.name;

        // Append the button to the planet list container
        planetList.appendChild(planetButton);

        // Step 5: Attach a click event listener to the button
        // When clicked, this will display the details of the selected planet
        planetButton.addEventListener("click", () => showPlanetInfo(planet));
    });

    // Log a confirmation message once the planets are rendered
    console.log("Rendering planets:", planets);
}

// Display the selected planet's details
function showPlanetInfo(planet) {
    const planetList = document.getElementById("planet-list");
    const planetDetails = document.getElementById("planet-details");
    const searchInput = document.getElementById("planet-search");

    // Hide the planet list and search input
    planetList.classList.add("hidden");
    searchInput.classList.add("hidden");

    // Show the planet details section
    planetDetails.classList.add("visible");

    // Populate the details section with planet data
    document.getElementById("planet-title").textContent = planet.name;
    document.getElementById("planet-subtitle").textContent = planet.latinName;
    document.getElementById("planet-description").textContent = planet.desc;
    document.getElementById("planet-circumference").textContent = `${planet.circumference.toLocaleString()} km`;
    document.getElementById("planet-distance").textContent = `${planet.distance.toLocaleString()} km`;
    document.getElementById("planet-max-temp").textContent = `${planet.temp.day}°C`;
    document.getElementById("planet-min-temp").textContent = `${planet.temp.night}°C`;

    console.log(`Displaying info for planet: ${planet.name}`);
}

// Set up the back button to return to the planet list
function setupBackButton() {
    const backButton = document.getElementById("return-to-list");
    backButton.addEventListener("click", () => {
        const planetList = document.getElementById("planet-list");
        const planetDetails = document.getElementById("planet-details");
        const searchInput = document.getElementById("planet-search");

        // Show the planet list and search input
        planetList.classList.remove("hidden");
        searchInput.classList.remove("hidden");

        // Hide the planet details section
        planetDetails.classList.remove("visible");

        console.log("Back to planet list.");
    });
}

// Filter the planet list based on the user's search input
function setupSearch(planets) {
    const searchInput = document.getElementById("planet-search");

    // Ensure the search input element exists
    if (!searchInput) {
        console.error("Search input not found.");
        return;
    }

    // Add an input event listener to filter planets as the user types
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();
        planets.forEach((planet) => {
            const planetButton = document.querySelector(
                `button[aria-label='Lär dig mer om ${planet.name}']`
            );
            if (planetButton) {
                // Show or hide the planet button based on the search query
                planetButton.style.display = planet.name.toLowerCase().includes(query)
                    ? "block"
                    : "none";
            }
        });
    });
}

// Load and initialize the solar system data
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

    // Initialize the UI with planets and setup functionality
    renderPlanets(planets);
    setupSearch(planets);
    setupBackButton();
}

// Ensure the DOM is fully loaded before executing the script
document.addEventListener("DOMContentLoaded", loadSolarSystemData);

