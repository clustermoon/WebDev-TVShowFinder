const showSelect = document.getElementById("show-select");
const showDetails = document.getElementById("show-details");
const message = document.getElementById("message");

const requestOptions = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`
    }
};

function showMessage(text){
    message.textContent = text;
}

async function loadPopularShows() {
    const url = "https://api.themoviedb.org/3/tv/popular";

    showMessage("Loading popular shows...");

    try {
        const res = await fetch(url, requestOptions);

        if (!res.ok) {
            if (res.status === 401){
                throw new Error("The API token was rejected. Check the token in config.js");
            }
            throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();
        fillDropdown(data.results)
        showMessage("");
    } catch (error) {
        console.error(error);
        showMessage(error.message);
    }
}

function fillDropdown(shows){
    // Clear out the previous options
    showSelect.innerHTML = "";

    // Build out the placeholder
    let placeholder_option = document.createElement("option");
    placeholder_option.value = "";
    placeholder_option.textContent = "Select a show";

    // Append placeholder to the options list
    showSelect.appendChild(placeholder_option);

    for(let i = 0; i < shows.length; i++){
        // Access the data
        let show = shows[i];

        let option = document.createElement("option");
        option.value = show.id;
        option.textContent = show.name;

        showSelect.appendChild(option);
    }
}

loadPopularShows();

function displayDetails(show){
    // Clear the previous details
    showDetails.innerHTML = "";

    let title = document.createElement("header");
    title.textContent = show.name;

    let poster = document.createElement("img");
    poster.src = "https://image.tmdb.org/t/p/w500/" + show.poster_path;
    poster.alt = "Poster for the show " + show.name;

    let overview = document.createElement("p");
    overview.textContent = show.overview;

    let genres = document.createElement("p");
    let genre_string = "";
    for(let i = 0; i < show.genres.length; i++){
        let genre = show.genres[i];
        genre_string += genre.name + ", ";
    }
    genres.textContent = genre_string;
    genres.className = "genres";

    let num_of_seasons = document.createElement("li");
    let num_of_seasons_p = document.createElement("p");
    num_of_seasons_p.textContent = "Seasons: " + show.number_of_seasons;
    num_of_seasons.appendChild(num_of_seasons_p);

    let num_of_episodes = document.createElement("li");
    let num_of_episodes_p = document.createElement("p");
    num_of_episodes_p.textContent = "Episodes: " + show.number_of_episodes;
    num_of_episodes.appendChild(num_of_episodes_p);

    let status = document.createElement("li");
    let status_p = document.createElement("p");
    status_p.textContent = "Running Status: " + show.status;
    status.appendChild(status_p);

    showDetails.appendChild(title);
    showDetails.appendChild(poster);
    showDetails.appendChild(overview);
    showDetails.appendChild(genres);

    let additionalDetails = document.createElement("ul");
    additionalDetails.className = "stats";
    additionalDetails.appendChild(num_of_seasons);
    additionalDetails.appendChild(num_of_episodes);
    additionalDetails.appendChild(status);
    showDetails.appendChild(additionalDetails);
}

async function loadShowDetails(id) {
    const url = `https://api.themoviedb.org/3/tv/${id}`;
    showMessage("Loading Show Details...");

    try {
        const res = await fetch(url, requestOptions);

        if (!res.ok) {
            if(res.status = 401){
                throw new Error(`Request failed because the credentials have expired or are invalid. Failed with status ${res.status}`);
            }
            throw new Error(`Request failed with status ${res.status}`);
        }

        const show = await res.json();
        displayDetails(show);
        showMessage("");
    } catch (error) {
        console.error(error);
        showMessage(error);
    }
}

showSelect.addEventListener("change", function () {
    const id = showSelect.value;

    if (id === "") {
        return;
    }

    loadShowDetails(id);
});