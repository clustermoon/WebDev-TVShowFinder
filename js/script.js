// Document elements
const consoles_button = document.getElementById("load_consoles");
const section_display = document.getElementById("section_display");
const output = document.getElementById("error_message"); 
const summary = document.getElementById("summary");

let summary_list = [];

// Event listener on the button directly calls the following logic block on click
consoles_button.addEventListener("click", function () {
    output.textContent = "Loading...";
    summary_list = [];
    summary.textContent = "";
    section_display.innerHTML = "";

    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://ozarktechwebdev.com/api/consoles.json");

    xhr.onreadystatechange = function () {
        if(xhr.readyState !== 4) return;

        if(xhr.status !== 200){
            output.textContent = "Request failed. Status Code: " + xhr.status;
            return;
        }

        let data;
        try{
            data = JSON.parse(xhr.responseText);
        } catch (err) {
            output.textContent = "Could no parse the response.";
            return;
        }

        output.textContent = "";
        renderConsoles(data.consoles);
    };
    xhr.send();
});

function renderConsoles(consoles){
    section_display.innerHTML = "";

    consoles.forEach(function (item) {
        const console_card = document.createElement("div");
        console_card.className = "console_card";

        const img = document.createElement("img");
        img.className = "console_img";
        img.src = item.image;
        img.alt = item.name;

        const title = document.createElement("strong");
        title.className = "console_title";
        title.textContent = item.name;

        const details = document.createElement("span");
        const manufacturer = document.createElement("span");
        manufacturer.className = "console_maker";
        manufacturer.textContent = item.manufacturer;

        const separator = document.createElement("span");
        separator.textContent = " . ";

        const year = document.createElement("span");
        year.className = "console_year";
        year.textContent = item.year;

        details.append(manufacturer, separator, year);
        console_card.append(img, title, details);
        section_display.appendChild(console_card);
        summary_list.push(item);
    });
    update_summary();
}

function update_summary(){
    if (summary_list.length === 0) {
        summary.textContent = "";
        return;
    }

    let newest_entry = null;
    let newest_year  = 0;
    let oldest_year = 100000;
    let oldest_entry = null

    summary_list.forEach(function (item) {
        if (item.year > newest_year) {
            newest_entry = item;
            newest_year = item.year;
        }
        if (item.year < oldest_year) {
            oldest_entry = item;
            oldest_year = item.year;
        }
    });

    summary.textContent =
        summary_list.length + " consoles . Oldest: " + oldest_entry.name +
        " (" + oldest_entry.year + ") . Newest: " + newest_entry.name +
        " (" + newest_entry.year + ")";
}