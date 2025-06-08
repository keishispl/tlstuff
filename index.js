function toggleUpdatesDiv() {
     if (window.innerWidth < 1001) {
          document.getElementById("updates-2").style.display = "none";
          document.getElementById("updates-3").style.display = "none";
     } else if (window.innerWidth < 1401) {
          document.getElementById("updates-2").style.display = "flex";
          document.getElementById("updates-3").style.display = "none";
     } else {
          document.getElementById("updates-2").style.display = "flex";
          document.getElementById("updates-3").style.display = "flex";
     }
}

window.addEventListener("resize", () => {
     toggleUpdatesDiv();
});

toggleUpdatesDiv();

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

var allMangas = [];

window.addEventListener("load", () => {
     document.querySelectorAll(".loader").forEach(e => e.remove());

     // Each manga only shows up once
     /**
     jsonFromFile('all').forEach(mangaID => {
          var allChapters = [];

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

          allChapters.sort(function (a, b) {
               return new Date(`${b.date[0]}-${b.date[1]}-${b.date[2]} ${b.date[3]}:${b.date[4]}:${b.date[5]}`) - new Date(`${a.date[0]}-${a.date[1]}-${a.date[2]} ${a.date[3]}:${a.date[4]}:${a.date[5]}`);
          })

          allMangas.push(allChapters[0]);
     })
     */

     // Each manga can show up multiple times
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

               allMangas.push(array);
          })
     })


     allMangas.sort(function (a, b) {
          return new Date(`${b.date[0]}-${b.date[1]}-${b.date[2]} ${b.date[3]}:${b.date[4]}:${b.date[5]}`) - new Date(`${a.date[0]}-${a.date[1]}-${a.date[2]} ${a.date[3]}:${a.date[4]}:${a.date[5]}`);
     })

     var status = false;
     for (let i = 0; i < 3; i++) {
          for (let o = 0; o < 5; o++) {
               var n = o + (i * 5);
               if (allMangas[n]) {
                    var updates = document.getElementById("updates-" + (i + 1));

                    var div = document.createElement("div");
                    updates.appendChild(div);

                    // Create the image
                    let img = document.createElement("img");
                    img.src = `https://raw.githubusercontent.com/keishispl/tlstuff-resources/refs/heads/main/title/${allMangas[n].mangaID}/cover.jpg`;
                    img.draggable = false;
                    img.height = "273";
                    img.width = "192";
                    img.className = "chapter-cover";
                    div.appendChild(img);

                    var right = document.createElement("div");
                    div.appendChild(right);

                    var p = document.createElement("p");
                    p.className = "chapter-manga";
                    right.appendChild(p);

                    var a = document.createElement("a");
                    a.href = `title/?manga=${allMangas[n].mangaID}`;
                    a.textContent = allMangas[n].manga;
                    p.appendChild(a);

                    var br = document.createElement("br");
                    right.appendChild(br);


                    var p = document.createElement("p");
                    p.className = "chapter-chapter";
                    right.appendChild(p);

                    var alt = "";
                    if (allMangas[n].chapter) {
                         if (allMangas[n].chapter.length > 0) {
                              alt = " - " + allMangas[n].chapter;
                         }
                    }
                    var a = document.createElement("a");
                    a.href = `read/?manga=${allMangas[n].mangaID}&ch=${allMangas[n].chapterNumber}`;
                    a.textContent = "Ch. " + allMangas[n].chapterNumber + alt;
                    p.appendChild(a);

                    var br = document.createElement("br");
                    right.appendChild(br);


                    var p = document.createElement("p");
                    p.className = "chapter-date";
                    right.appendChild(p);

                    var a = document.createElement("a");
                    a.textContent = timeSince(new Date(`${allMangas[n].date[0]}-${allMangas[n].date[1]}-${allMangas[n].date[2]} ${allMangas[n].date[3]}:${allMangas[n].date[4]}:${allMangas[n].date[5]}`)) + " ago";
                    [1, 2, 3, 4, 5].forEach(e => allMangas[n].date[e] = `${allMangas[n].date[e]}`.length < 2 ? "0" + allMangas[n].date[e] : allMangas[n].date[e]);
                    a.setAttribute("title", `${allMangas[n].date[0]}-${allMangas[n].date[1]}-${allMangas[n].date[2]} ${allMangas[n].date[3]}:${allMangas[n].date[4]}:${allMangas[n].date[5]}`);
                    p.appendChild(a);
               } else {
                    status = true;
                    break;
               }
          }

          if (status) {
               break;
          }
     }
});