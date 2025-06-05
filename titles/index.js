/**
 * Retrieves the contents of a JSON file as an object
 * @param {string} file The path to the JSON file
 * @returns {Object} The contents of the JSON file
 */
function jsonFromFile(file) {
     var request = new XMLHttpRequest();
     request.open("GET", `https://raw.githubusercontent.com/keishispl/tlstuff-resources/refs/heads/main/${file}.json`, false);
     request.send(null);
     return JSON.parse(request.responseText);
}

/**
 * Retrieves the list of available manga from the JSON file at ../all.json
 * @returns {Array<string>} The list of available manga
 */
function getMangaList() {
     return jsonFromFile('all').sort();
}

/**
 * Retrieves the data for a particular manga from the JSON file at ../title/{manga}/data.json
 * @param {string} manga The manga to retrieve the data for
 * @returns {Object} The data for the manga
 */
function getMangaData(manga) {
     return jsonFromFile(`title/${manga}/data`);
}

window.addEventListener("load", () => {
     document.getElementById("titles").style.display = "flex";
     document.querySelectorAll(".loader").forEach(e => e.remove());

     // Get the list of available manga
     let data = getMangaList();

     // Create a div for each manga
     data.forEach(e => {
          // Get the data for the manga
          let data2 = getMangaData(e);

          // Create the div
          let div = document.createElement("div");
          div.className = "object";

          // Create the link to the manga page
          let a = document.createElement("a");
          a.href = `../title/?manga=${e}`;
          a.className = "link";
          a.textContent = data2.title;
          div.appendChild(a);

          // Create the image
          let img = document.createElement("img");
          img.src = `https://raw.githubusercontent.com/keishispl/tlstuff-resources/refs/heads/main/title/${e}/cover.jpg`;
          img.draggable = false;
          img.height = "273";
          img.width = "192";
          img.className = "cover";
          div.appendChild(img);

          // Create the text
          let p = document.createElement("p");
          p.className = "manga";
          var tags = "";
          if (data2.tags) {
               data2.tags.forEach(e => tags += `<span class="tag">${e}</span>`);
          }
          p.innerHTML = data2.title + tags;
          div.appendChild(p);

          // Append the div to the page
          document.getElementById("titles").appendChild(div);
     });
});

// Add a search function to the page
let titles = document.getElementById("titles");
document.getElementById("search").addEventListener("keyup", (e) => {
     // Get the value of the search box
     let val = e.target.value.toLowerCase();

     // Loop through all the divs and hide the ones that don't match the search
     titles.querySelectorAll("div").forEach(e => {
          e.style = (val && !e.querySelector("p").textContent.toLowerCase().includes(val)) ? "display:none" : undefined;
     });
});
