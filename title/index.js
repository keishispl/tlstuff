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
 * Calculates the time elapsed since a given date and returns it as a human-readable string.
 *
 * @param {Date} date - The date to calculate the time since.
 * @returns {string} A string representing the time elapsed in the largest time unit available
 *                   (years, months, days, hours, minutes, or seconds).
 */
function timeSince(date) {
     var seconds = Math.floor((new Date() - date) / 1000);

     var interval = seconds / 31536000;

     if (interval > 1) {
          return Math.floor(interval) + "y";
     }
     interval = seconds / 2592000;
     if (interval > 1) {
          return Math.floor(interval) + "mo";
     }
     interval = seconds / 86400;
     if (interval > 1) {
          return Math.floor(interval) + "d";
     }
     interval = seconds / 3600;
     if (interval > 1) {
          return Math.floor(interval) + "h";
     }
     interval = seconds / 60;
     if (interval > 1) {
          return Math.floor(interval) + "m";
     }
     return Math.floor(seconds) + "s";
}
/**
 * Retrieves and displays manga information based on URL parameters.
 * The function fetches manga data, sets document properties, and updates the DOM with manga details.
 */
const urlParams = new URLSearchParams(window.location.search);

// Check if the manga exists in the list of all manga
if (jsonFromFile('all').includes(urlParams.get('manga'))) {
     // Load manga data
     const manga = jsonFromFile(`title/${urlParams.get('manga')}/data`);

     // Set the document title to the manga title
     document.title = manga.title + " - Keishi TL Stuff";

     // Update the logo image source to the manga cover image
     document.getElementById("logo").src = 'https://raw.githubusercontent.com/keishispl/tlstuff-resources/refs/heads/main/title/' + urlParams.get('manga') + '/cover.jpg';

     // Set the manga title
     document.getElementById("title").textContent = manga.title;

     // Display aliases, each on a new line
     document.getElementById("aliases").innerHTML = manga.aliases.join("<br>");

     // Set the author and artist names
     document.getElementById("author").textContent = manga.author;
     document.getElementById("artist").textContent = manga.artist;

     // Create and display links for the manga
     document.getElementById("links").innerHTML = Object.entries(manga.links)
          .map(e => `<a href="${e[1]}" target="_blank">${e[0]}</a>`)
          .join("<br>");

     /**
      * Generates and appends a table row for each chapter of the manga in the reverse order of release.
      * The table row contains the chapter title, release date, and a link to MangaDex.
      */
     for (let i = manga.chapters.length - 1; i >= 0; i--) {
          const chapter = jsonFromFile(`title/${urlParams.get('manga')}/${manga.chapters[i]}/data`);

          var tr = document.createElement("tr");
          var td = document.createElement("td");
          td.scope = "row";
          td.className = "chapter-title";
          var a = document.createElement("a");
          /**
           * The alternative chapter title, if it exists.
           * @type {string}
           */
          var alt = "";
          if (chapter.alt) {
               if (chapter.alt.length > 0) {
                    alt = " - " + chapter.alt;
               }
          }
          a.setAttribute("title", "Chapter " + manga.chapters[i] + alt);
          a.textContent = manga.chapters[i] + alt;
          a.href = "../read/?manga=" + urlParams.get('manga') + "&ch=" + manga.chapters[i];
          td.appendChild(a);
          tr.appendChild(td);
          var td = document.createElement("td");
          td.scope = "row";
          td.className = "chapter-date";
          var a = document.createElement("a");
          /**
           * The time elapsed since the chapter was released.
           * @type {string}
           */
          a.textContent = timeSince(new Date(`${chapter.date[0]}-${chapter.date[1]}-${chapter.date[2]} ${chapter.date[3]}:${chapter.date[4]}:${chapter.date[5]}`)) + " ago";
          /**
           * The release date of the chapter in the format "YYYY-MM-DD HH:MM:SS".
           * @type {string}
           */
          [1, 2, 3, 4, 5].forEach(e => chapter.date[e] = `${chapter.date[e]}`.length < 2 ? "0" + chapter.date[e] : chapter.date[e]);
          a.setAttribute("title", `${chapter.date[0]}-${chapter.date[1]}-${chapter.date[2]} ${chapter.date[3]}:${chapter.date[4]}:${chapter.date[5]}`);
          td.appendChild(a);
          tr.appendChild(td);
          var td = document.createElement("td");
          td.scope = "row";
          td.className = "chapter-mangadex";
          var a = document.createElement("a");
          a.setAttribute("title", "Link to MangaDex");
          if (chapter.chapter !== "") {
               a.innerHTML = `<span class="badge">MD</span>`;
               a.href = chapter.chapter;
               a.target = "_blank";
          } else {
               a.innerHTML = `<span class="badge"><s>MD</s></span>`;
          }
          td.appendChild(a);
          tr.appendChild(td);
          document.getElementById("chapterTable").appendChild(tr);
     }
     /**
      * Selects the table that contains the list of chapters.
      * @type {HTMLTableElement}
      */
     let chapterTable = document.getElementById("chapterTable");

     /**
      * Adds an event listener to the search input box for the chapters.
      * The event listener will filter the table rows based on the search query.
      */
     document.getElementById("chapterTitleSearch").addEventListener("keyup", (e) => {
          /**
           * Gets the value of the search box and converts it to lowercase.
           * @type {string}
           */
          let val = e.target.value.toLowerCase();

          /**
           * Loops through all the table rows and hides the ones that don't match the search.
           * @param {HTMLTableRowElement} e - The current table row.
           */
          chapterTable.querySelectorAll("tr").forEach(e => {
               /**
                * Sets the display style of the table row to "none" if the search query is not empty and
                * the first cell of the row does not contain the search query.
                * Otherwise, sets the display style to undefined.
                */
               e.style = (val && !e.querySelector("td").textContent.toLowerCase().includes(val)) ? "display:none" : undefined;
          });
     });
} else {
     /**
      * Displays an error message when the manga is not found.
      */
     displayMangaNotFoundError();
}

/**
 * Displays an error message when the manga is not found.
 */
function displayMangaNotFoundError() {
     // Remove the header and main elements
     document.querySelector("header").remove();
     document.querySelector("main").remove();

     // Create a div for the error message
     var div = document.createElement("div");
     div.classList.add("error");
     document.body.appendChild(div);

     // Create a div for the center of the error message
     var center = document.createElement("div");
     div.classList.add("error-center");
     div.appendChild(center);

     // Create the title of the error message
     var text = document.createElement("h1");
     text.textContent = "Manga not found";
     center.appendChild(text);

     // Create the image of the error message
     var img = document.createElement("img");
     img.width = "250";
     img.height = "250";
     img.src = "./error.gif";
     img.draggable = false;
     img.style.borderRadius = "50px";
     img.style.margin = "25px";
     img.style.pointerEvents = "none";
     img.style.webkitTouchCallout = "none";
     center.appendChild(img);

     // Create the paragraph of the error message
     var para = document.createElement("p");
     center.appendChild(para);

     // Create the button of the error message
     var button = document.createElement("a");
     button.className = "button";
     button.textContent = "Back to Titles";

     // Set the path of the button
     var ppath = "/";
     if (window.location.pathname.includes('/tlstuff')) {
          ppath = "/tlstuff/";
     }

     var split = window.location.href.split('/');
     button.href = split[0] + "//" + split[2] + ppath + "titles";

     // Add the button to the paragraph
     para.appendChild(button);

     // Set the title of the page
     document.title = "Manga Not Found - Keishi TL Stuff"
}
