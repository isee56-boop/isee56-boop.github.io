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
// Function to display the details of the selected planet
function showPlanetInfo(planet) {
    // Step 1: Get references to the necessary DOM elements
    const planetList = document.getElementById("planet-list"); // The list of planet buttons
    const planetDetails = document.getElementById("planet-details"); // The container for planet details
    const searchInput = document.getElementById("planet-search"); // The search input field

    // Step 2: Hide the planet list and search input to focus on the details view
    planetList.classList.add("hidden"); // Add the 'hidden' class to hide the planet list
    searchInput.classList.add("hidden"); // Add the 'hidden' class to hide the search input field

    // Step 3: Make the planet details section visible
    planetDetails.classList.add("visible"); // Add the 'visible' class to show the details section

    // Step 4: Populate the planet details section with data from the selected planet
    document.getElementById("planet-title").textContent = planet.name; // Set the planet name
    document.getElementById("planet-subtitle").textContent = planet.latinName; // Set the Latin name of the planet
    document.getElementById("planet-description").textContent = planet.desc; // Set the planet description
    document.getElementById("planet-circumference").textContent = `${planet.circumference.toLocaleString()} km`; // Format and display the circumference
    document.getElementById("planet-distance").textContent = `${planet.distance.toLocaleString()} km`; // Format and display the distance from the sun
    document.getElementById("planet-max-temp").textContent = `${planet.temp.day}°C`; // Display the maximum temperature during the day
    document.getElementById("planet-min-temp").textContent = `${planet.temp.night}°C`; // Display the minimum temperature during the night

    // Step 5: Log a message to the console for debugging purposes
    console.log(`Displaying info for planet: ${planet.name}`); // Log the name of the displayed planet
}

// Function to set up the back button functionality, allowing the user to return to the planet list
function setupBackButton() {
    // Get the back button element by its ID
    const backButton = document.getElementById("return-to-list");

    // Attach a click event listener to the back button
    backButton.addEventListener("click", () => {
        // Get references to the DOM elements that need to be toggled
        const planetList = document.getElementById("planet-list"); // Planet list container
        const planetDetails = document.getElementById("planet-details"); // Planet details container
        const searchInput = document.getElementById("planet-search"); // Search input field

        // Step 1: Show the planet list and search input
        planetList.classList.remove("hidden"); // Remove 'hidden' class to make the planet list visible
        searchInput.classList.remove("hidden"); // Remove 'hidden' class to make the search input visible

        // Step 2: Hide the planet details section
        planetDetails.classList.remove("visible"); // Remove 'visible' class to hide the details view

        // Step 3: Log a message for debugging and confirmation
        console.log("Back to planet list."); // Log the action for verification
    });
}

// Function to set up the search functionality, filtering the planet list based on user input
function setupSearch(planets) {
    // Get the search input element by its ID
    const searchInput = document.getElementById("planet-search");

    // Ensure the search input exists before proceeding
    if (!searchInput) {
        console.error("Search input not found."); // Log an error if the input element is missing
        return; // Exit the function early
    }

    // Add an event listener to the search input for real-time filtering as the user types
    searchInput.addEventListener("input", () => {
        // Step 1: Get the search query, converting it to lowercase and trimming whitespace
        const query = searchInput.value.toLowerCase().trim();

        // Step 2: Loop through the planets array to check each planet's name against the query
        planets.forEach((planet) => {
            // Find the corresponding button for the planet using its name
            const planetButton = document.querySelector(
                `button[aria-label='Lär dig mer om ${planet.name}']`
            );

            if (planetButton) {
                // Step 3: Show or hide the button based on whether the planet name matches the query
                planetButton.style.display = planet.name.toLowerCase().includes(query)
                    ? "block" // Show the button if the name matches the query
                    : "none"; // Hide the button if it doesn't match
            }
        });
    });
}


// Function to load and initialize the solar system data
async function loadSolarSystemData() {
    // Step 1: Fetch the API key from the server
    const apiKey = await getApiKey();

    // Check if the API key is available
    if (!apiKey) {
        console.error("No API key available. Exiting."); // Log an error if the API key is missing
        return; // Exit the function to prevent further execution
    }

    // Step 2: Fetch planet data using the retrieved API key
    const planets = await fetchPlanets(apiKey);

    // Check if planet data is available
    if (!planets) {
        console.error("No planets available. Exiting."); // Log an error if no planet data is returned
        return; // Exit the function to prevent further execution
    }

    // Step 3: Initialize the UI
    renderPlanets(planets); // Render the planet list dynamically in the DOM
    setupSearch(planets);   // Set up the search functionality to filter planets
    setupBackButton();      // Set up the back button to navigate back to the planet list
}

// Event listener to ensure the DOM is fully loaded before executing the script
document.addEventListener("DOMContentLoaded", loadSolarSystemData);
// This ensures that the `loadSolarSystemData` function runs only after the HTML content has been fully loaded and is ready to be manipulated.

