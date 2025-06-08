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
     var seconds = Math.floor((new Date(Date.now()) - date) / 1000);

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

var allChapters = [];

window.addEventListener("load", () => {
     document.getElementById("titles").style.display = "block";
     document.querySelectorAll(".loader").forEach(e => e.remove());

     jsonFromFile('all').forEach(mangaID => {
          const manga = jsonFromFile(`title/${mangaID}/data`);
          manga.chapters.forEach(chapterID => {
               const chapter = jsonFromFile(`title/${mangaID}/${chapterID}/data`);
               var array = {
                    mangaID: mangaID,
                    manga: manga.title,
                    chapterNumber: chapterID,
                    chapter: chapter.alt,
                    date: chapter.date,
                    altLink: chapter.chapter
               }

               allChapters.push(array);
          })
     })

     allChapters.sort(function (a, b) {
          return new Date(`${b.date[0]}-${b.date[1]}-${b.date[2]} ${b.date[3]}:${b.date[4]}:${b.date[5]}`) - new Date(`${a.date[0]}-${a.date[1]}-${a.date[2]} ${a.date[3]}:${a.date[4]}:${a.date[5]}`);
     })

     /**
      * Selects the table that contains the list of chapters.
      * @type {HTMLTableElement}
      */
     let chapterTable = document.getElementById("chapterTable");

     allChapters.forEach(chapter => {
          var tr = document.createElement("tr");
          tr.className = "chapterTR";
          var td = document.createElement("td");
          td.scope = "row";
          td.className = "chapter-title";
          var a = document.createElement("a");
          /**
           * The alternative chapter title, if it exists.
           * @type {string}
           */
          var alt = "";
          var pre = "";
          if (chapter.chapter) {
               if (chapter.chapter.length > 0) {
                    alt = " - " + chapter.chapter;
               } else {
                    pre = "Chapter ";
               }
          } else {
               pre = "Chapter ";
          }
          a.setAttribute("title", "Chapter " + chapter.chapterNumber + alt);
          a.textContent = pre + chapter.chapterNumber + alt;
          a.href = "../read/?manga=" + chapter.mangaID + "&ch=" + chapter.chapterNumber;
          td.appendChild(a);
          tr.appendChild(td);

          var td = document.createElement("td");
          td.scope = "row";
          td.className = "chapter-title";
          var a = document.createElement("a");
          var tags = "";
          if (chapter.manga.tags) {
               chapter.manga.tags.forEach(e => tags += `<span class="tag">${e}</span>`);
          }
          a.innerHTML = chapter.manga + tags;
          a.href = "../title/?manga=" + chapter.mangaID;
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
          if (chapter.altLink === "") {
               a.innerHTML = `<span class="badge">N/A</span>`;
               a.setAttribute("title", "External link not available");
          } else {
               if (chapter.altLink.includes("mangadex.org")) {
                    a.innerHTML = `<span class="badge">MD</span>`;
                    a.setAttribute("title", "Link to MangaDex");
                    a.href = chapter.altLink;
                    a.target = "_blank";
               } else {
                    a.innerHTML = `<span class="badge">LINK</span>`;
                    a.href = chapter.altLink;
                    a.target = "_blank";
               }
          }
          td.appendChild(a);
          tr.appendChild(td);
          chapterTable.appendChild(tr);
     });

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
               e.style = (val && !e.querySelectorAll("td")[1].textContent.toLowerCase().includes(val)) ? "display:none" : undefined;
          });
     });
});