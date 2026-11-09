const showSelect = document.getElementById("show-select");
const showDetails = document.getElementById("show-details");

const requestOptions = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`
    }
};

async function loadPopularShows() {
    const url = "https://api.themoviedb.org/3/tv/popular";

    try {
        const res = await fetch(url, requestOptions);

        if (!res.ok) {
            throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();
        fillDropdown(data.results)
    } catch (error) {
        console.error(error);
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


async function loadShowDetails(id) {
    const url = `https://api.themoviedb.org/3/tv/${id}`;

    try {
        const res = await fetch(url, requestOptions);

        if (!res.ok) {
            throw new Error(`Request failed with status ${res.status}`);
        }

        const show = await res.json();
        console.log(show);
    } catch (error) {
        console.error(error);
    }
}

showSelect.addEventListener("change", function () {
    const id = showSelect.value;

    if (id === "") {
        return;
    }

    loadShowDetails(id);
});