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

var urlParams = new URLSearchParams(window.location.search)

/**
 * Takes an array of arrays and returns a single array of all the elements.
 * If one of the inner arrays is empty, it is ignored.
 * @param {Array<Array<*>|*>} item The array of arrays to flatten
 * @returns {Array<*>} The flattened array
 */
function array(item) {
     var array = [];
     item.forEach(e => {
          var amount = false;
          e.forEach(f => {
               amount = true;
               array.push(`${f}`);
          })
          if (!amount) array.push(`${e}`);
     })
     return array;
}

/**
 * Takes an array of arrays and returns a single array of all the second elements.
 * If one of the inner arrays is empty, it is ignored.
 * @param {Array<Array<*>|*>} item The array of arrays to process
 * @returns {Array<*>} The array of second elements
 */
function arraySecond(item) {
     var array = [];
     item.forEach(e => {
          if (typeof e[1] !== "undefined") array.push(`${e[1]}`);
     })
     return array;
}

/**
 * Takes an array and returns a single array of all the elements.
 * @param {Array<Array<*>|*>} item The array to flatten
 * @returns {Array<*>} The flattened array
 */
function arrayThird(item) {
     var array = [];
     item.forEach(e => {
          array.push(`${e}`);
     })
     return array;
}

/**
 * Sets the images for the chapter viewer.
 * @param {Array<Array<*>|*>} item The array of pages for the chapter
 * @param {URLSearchParams} urlParams The URL parameters
 */
function setImages(item, urlParams) {
     var right = document.getElementById("right");
     var left = document.getElementById("left");
     right.style.display = "none";
     left.style.display = "none";
     right.src = "";
     left.src = "";

     right.src = `https://raw.githubusercontent.com/keishispl/tlstuff-resources/refs/heads/main/title/${urlParams.get('manga')}/${urlParams.get('ch')}/${urlParams.get('pg')}.png`;
     right.style.display = "inline-block";

     if (arraySecond(item).includes(`${parseInt(urlParams.get('pg')) + 1}`)) {
          left.src = `https://raw.githubusercontent.com/keishispl/tlstuff-resources/refs/heads/main/title/${urlParams.get('manga')}/${urlParams.get('ch')}/${parseInt(urlParams.get('pg')) + 1}.png`;
          left.style.display = "inline-block";
     }
}

/**
 * Sets the titles for the chapter viewer.
 * @param {Object} manga The manga JSON object
 * @param {Object} chapter The chapter JSON object
 * @param {URLSearchParams} urlParams The URL parameters
 */
function setTitles(manga, chapter, urlParams) {
     var alt = "";
     if (chapter.alt) {
          if (chapter.alt.length > 0) {
               alt = " - " + chapter.alt;
          }
     }
     document.title = urlParams.get('pg') + " | Chapter " + urlParams.get('ch') + " - " + manga.title + " - Keishi TL Stuff";

     document.getElementById("chapter").textContent = "Chapter " + urlParams.get('ch') + alt;

     document.getElementById("title").innerHTML = `<a href="` + "../title/?manga=" + urlParams.get('manga') + `">` + manga.title + `</a>`;
}

/**
 * Updates the URL parameters and sets the necessary page elements.
 * If any of the parameters (value, value2, value3) are null, it retrieves
 * the corresponding value from the URL parameters. Updates the browser
 * history with the new URL. Optionally updates images and titles if the 
 * item, manga, and chapter are provided.
 *
 * @param {string|null} value - The manga identifier or null to use the URL parameter.
 * @param {string|null} value2 - The chapter identifier or null to use the URL parameter.
 * @param {string|null} value3 - The page number or null to use the URL parameter.
 * @param {Array<Array<*>|*>} [item] - Optional. The array of pages for the chapter.
 * @param {Object} [manga] - Optional. The manga JSON object.
 * @param {Object} [chapter] - Optional. The chapter JSON object.
 */
function setParam(value, value2, value3, item, manga, chapter) {
     value === null ? value = urlParams.get('manga') : value;
     value2 === null ? value2 = urlParams.get('ch') : value;
     value3 === null ? value3 = urlParams.get('pg') : value;
     history.pushState(null, null, "../read/?manga=" + value + "&ch=" + value2 + "&pg=" + value3);
     urlParams = new URLSearchParams(window.location.search);

     if (typeof item !== "undefined") setImages(item, urlParams);
     if (typeof manga !== "undefined" && typeof chapter !== "undefined") setTitles(manga, chapter, urlParams);
}

/**
 * Initializes the page, sets up key event listeners, and handles navigation
 * based on URL parameters for the manga viewer.
 */
function initializePage() {
     // Set initial URL parameters
     setParam(null, null, null);

     if (jsonFromFile('all').includes(urlParams.get('manga'))) {
          const manga = jsonFromFile(`title/${urlParams.get('manga')}/data`);

          if (arrayThird(manga.chapters).includes(`${urlParams.get('ch')}`)) {
               const chapter = jsonFromFile(`title/${urlParams.get('manga')}/${urlParams.get('ch')}/data`);

               // Ensure valid page number
               if (urlParams.get('pg') === null) setParam(null, null, "1", chapter.pages, manga, chapter);
               if (!array(chapter.pages).includes(`${urlParams.get('pg')}`)) setParam(null, null, "1", chapter.pages, manga, chapter);

               // Check if the current page is the first page of a set
               var isFirst = false;
               chapter.pages.forEach(e => {
                    if (e[0].toString() === urlParams.get('pg')) {
                         isFirst = true;
                         return;
                    }
               });

               // Adjust to previous page if not the first
               if (!isFirst) {
                    setParam(null, null, parseInt(urlParams.get('pg')) - 1, chapter.pages, manga, chapter);
               }

               var progressArray = [];
               var progressBar = document.getElementById("progressbar");
               for (var i = chapter.pages.length - 1; i >= 0; i--) {
                    const progress = document.createElement("div");
                    progress.classList.add("progress");
                    progress.id = "progress_" + chapter.pages[i].join("-");
                    progress.style.zIndex = `${chapter.pages.length + 2 - i}`;
                    progressBar.appendChild(progress);

                    progressArray.push(progress);

                    const progresstext = document.createElement("p");
                    progresstext.classList.add("progresstext");
                    progresstext.textContent = chapter.pages[i].join("ー");
                    progresstext.id = "progresstext_" + chapter.pages[i].join("-");
                    progress.appendChild(progresstext);

                    progresstext.style.display = 'none';

                    progress.addEventListener('mouseenter', () => {
                         progresstext.style.display = 'block';
                    });

                    progress.addEventListener('mouseleave', () => {
                         progresstext.style.display = 'none';
                    });

                    progress.addEventListener('click', () => {
                         setParam(null, null, parseInt(progress.id.split("_")[1].split("-")[0]), chapter.pages, manga, chapter);
                         progressBarUpdate()
                    });
               }

               // Add hover effects
               document.addEventListener('mousemove', function (e) {
                    if (document.getElementById("access").style.visibility === "hidden") {
                         if (e.pageY < document.body.scrollHeight - 75) {
                              progressBar.classList.remove("hover2");
                              progressArray.forEach(f => f.classList.remove("hover"));
                         } else {
                              progressBar.classList.add("hover2");
                              progressArray.forEach(f => f.classList.add("hover"));
                         }
                    }
               });
               document.addEventListener('mouseenter', function (e) {
                    if (document.getElementById("access").style.visibility === "hidden") {
                         if (e.pageY < document.body.scrollHeight - 75) {
                              progressBar.classList.remove("hover2");
                              progressArray.forEach(f => f.classList.remove("hover"));
                         } else {
                              progressBar.classList.add("hover2");
                              progressArray.forEach(f => f.classList.add("hover"));
                         }
                    }
               });

               /**
                * Updates the background color of progress bar elements based on the current page number.
                * Each element in the progress bar is associated with a specific page number.
                * Elements representing pages greater than the current page are colored lightcoral,
                * while elements representing the current page and earlier are colored purple.
                */
               function progressBarUpdate() {
                    progressBar.querySelectorAll("div").forEach(e => {
                         var id = parseInt(e.id.split("_")[1].split("-")[0]);
                         if (id > parseInt(urlParams.get('pg'))) {
                              e.style.backgroundColor = "lightcoral";
                         } else {
                              e.style.backgroundColor = "purple";
                         }
                    })
               }

               // Set page titles and images
               setTitles(manga, chapter, urlParams);
               setImages(chapter.pages, urlParams);
               progressBarUpdate();

               // Add event listener for keydown events
               window.addEventListener("keydown", e => {
                    if (document.getElementById("access").style.visibility === "hidden") {
                         handleKeydown(e, chapter, manga);
                         progressBarUpdate();
                    }
               });
               document.getElementById("access-left").addEventListener("click", () => {
                    handleLeftArrow(chapter, manga);
                    progressBarUpdate();
               });
               document.getElementById("access-right").addEventListener("click", () => {
                    handleRightArrow(chapter, manga);
                    progressBarUpdate();
               });

               /**
                * Formats the buttons on the page.
                * This includes adding a click event listener to the chapter and page buttons,
                * as well as adding the current chapter and page numbers to the buttons.
                * It also formats the chapter and page lists.
                */
               function formatButtons() {
                    /**
                     * Scrolls the parent element until the child element is visible.
                     * @param {HTMLElement} parent - The parent element to scroll.
                     * @param {HTMLElement} child - The child element to make visible.
                     */
                    function scrollParentToChild(parent, child) {

                         // Where is the parent on page
                         var parentRect = parent.getBoundingClientRect();
                         // What can you see?
                         var parentViewableArea = {
                              height: parent.clientHeight,
                              width: parent.clientWidth
                         };

                         // Where is the child
                         var childRect = child.getBoundingClientRect();
                         // Is the child viewable?
                         var isViewable = (childRect.top >= parentRect.top) && (childRect.bottom <= parentRect.top + parentViewableArea.height);

                         // if you can't see the child try to scroll parent
                         if (!isViewable) {
                              // Should we scroll using top or bottom? Find the smaller ABS adjustment
                              const scrollTop = childRect.top - parentRect.top;
                              const scrollBot = childRect.bottom - parentRect.bottom;
                              if (Math.abs(scrollTop) < Math.abs(scrollBot)) {
                                   // we're near the top of the list
                                   parent.scrollTop += scrollTop;
                              } else {
                                   // we're near the bottom of the list
                                   parent.scrollTop += scrollBot + 100;
                              }
                         }
                    }

                    // Get the chapter and page lists
                    var chaptersDiv = document.getElementById("chapters");
                    var pagesDiv = document.getElementById("pages");

                    // Add event listeners to the chapter button
                    document.getElementById("chapter-button").addEventListener("click", () => {
                         if (chaptersDiv.style.visibility === "visible") {
                              chaptersDiv.style.visibility = "hidden";
                              chaptersDiv.style.opacity = "0";
                              chaptersDiv.style.zIndex = "-1";
                              chaptersDiv.style.transform = "translateY(0px)";
                              chaptersDiv.scrollTo(0, 0);
                         } else {
                              chaptersDiv.style.visibility = "visible";
                              chaptersDiv.style.opacity = "1";
                              chaptersDiv.style.zIndex = "5000";
                              chaptersDiv.style.transform = "translateY(10px)";
                              scrollParentToChild(chaptersDiv, document.getElementById("spec-chapter_" + urlParams.get('ch')));

                              if (pagesDiv.style.visibility === "visible") {
                                   pagesDiv.style.visibility = "hidden";
                                   pagesDiv.style.opacity = "0";
                                   pagesDiv.style.zIndex = "-1";
                                   pagesDiv.style.transform = "translateY(0px)";
                                   pagesDiv.scrollTo(0, 0);
                              }
                         }
                    });

                    // Add the current chapter number to the chapter button
                    document.getElementById("chapter-button-value").textContent = "Chapter " + urlParams.get('ch');

                    // Add the chapter list
                    (manga.chapters).reverse().forEach(e => {
                         var p = document.createElement("div");
                         p.className = "spec-chapter";
                         if (`${e}` === urlParams.get('ch')) {
                              p.classList.add("spec-chapter-current");
                         }
                         p.id = "spec-chapter_" + e;
                         chaptersDiv.appendChild(p);

                         var a = document.createElement("a");
                         if (`${e}` !== urlParams.get('ch')) {
                              a.href = `?manga=${urlParams.get('manga')}&ch=${e}`;
                         }
                         a.textContent = "Chapter " + e;
                         a.className = "spec-chapter-link";
                         p.appendChild(a);
                    });

                    // Add event listeners to the page button
                    document.getElementById("page-button").addEventListener("click", () => {
                         if (pagesDiv.style.visibility === "visible") {
                              pagesDiv.style.visibility = "hidden";
                              pagesDiv.style.opacity = "0";
                              pagesDiv.style.zIndex = "-1";
                              pagesDiv.style.transform = "translateY(0px)";
                              pagesDiv.scrollTo(0, 0);
                         } else {
                              pagesDiv.style.visibility = "visible";
                              pagesDiv.style.opacity = "1";
                              pagesDiv.style.zIndex = "4900";
                              pagesDiv.style.transform = "translateY(10px)";
                              scrollParentToChild(pagesDiv, document.getElementById("spec-page_" + urlParams.get('pg')));

                              if (chaptersDiv.style.visibility === "visible") {
                                   chaptersDiv.style.visibility = "hidden";
                                   chaptersDiv.style.opacity = "0";
                                   chaptersDiv.style.zIndex = "-1";
                                   chaptersDiv.style.transform = "translateY(0px)";
                                   chaptersDiv.scrollTo(0, 0);
                              }
                         }
                    });

                    // Add the current page number to the page button
                    document.getElementById("page-button-value").textContent = "Page " + urlParams.get('pg');

                    // Add the page list
                    (chapter.pages).reverse().forEach(e => {
                         var p = document.createElement("div");
                         p.className = "spec-page";
                         if (`${e[0]}` === urlParams.get('pg')) {
                              p.classList.add("spec-page-current");
                         }
                         p.id = "spec-page_" + e[0];
                         pagesDiv.appendChild(p);

                         var a = document.createElement("a");
                         if (`${e[0]}` !== urlParams.get('pg')) {
                              a.href = `?manga=${urlParams.get('manga')}&ch=${urlParams.get('ch')}&pg=${e[0]}`;
                         }
                         a.textContent = "Page " + e.join("ー");
                         a.className = "spec-page-link";
                         p.appendChild(a);
                    });

                    // Add event listeners outside the list to close the list on click
                    ["long", "titles", "bignav", "main"].forEach(e => {
                         document.getElementById(e).addEventListener("click", () => {
                              if (chaptersDiv.style.visibility === "visible") {
                                   chaptersDiv.style.visibility = "hidden";
                                   chaptersDiv.style.opacity = "0";
                                   chaptersDiv.style.zIndex = "-1";
                                   chaptersDiv.style.transform = "translateY(0px)";
                                   chaptersDiv.scrollTo(0, 0);
                              }
                              if (pagesDiv.style.visibility === "visible") {
                                   pagesDiv.style.visibility = "hidden";
                                   pagesDiv.style.opacity = "0";
                                   pagesDiv.style.zIndex = "-1";
                                   pagesDiv.style.transform = "translateY(0px)";
                                   pagesDiv.scrollTo(0, 0);
                              }
                         })
                    })
               }

               formatButtons();
          } else {
               // Redirect if chapter is not found
               window.location.href = "../title/?manga=" + urlParams.get('manga');
          }
     } else {
          // Display error if manga is not found
          displayMangaNotFoundError();
     }

     // Scroll to the bottom of the page
     window.scrollTo(0, document.body.scrollHeight);
}

/**
 * Handles keydown events for navigating pages.
 * @param {Event} e - The keyboard event.
 * @param {Object} chapter - The current chapter data.
 * @param {Object} manga - The current manga data.
 */
function handleKeydown(e, chapter, manga) {
     if (e.key === "ArrowLeft") {
          handleLeftArrow(chapter, manga);
     }
     if (e.key === "ArrowRight") {
          handleRightArrow(chapter, manga);
     }
}

/**
 * Handles the left arrow key navigation.
 * @param {Object} chapter - The current chapter data.
 * @param {Object} manga - The current manga data.
 */
function handleLeftArrow(chapter, manga) {
     if (arraySecond(chapter.pages).includes(`${parseInt(urlParams.get('pg')) + 1}`)) {
          setParam(null, null, `${parseInt(urlParams.get('pg')) + 2}`, chapter.pages, manga, chapter);
     } else {
          setParam(null, null, `${parseInt(urlParams.get('pg')) + 1}`, chapter.pages, manga, chapter);
     }

     if (!array(chapter.pages).includes(`${parseInt(urlParams.get('pg'))}`) && parseInt(urlParams.get('pg')) > 0) {
          try {
               const nextChapterIndex = manga.chapters.indexOf(parseFloat(urlParams.get('ch'))) - 1;
               const nextChapter = jsonFromFile(`title/${urlParams.get('manga')}/${manga.chapters[nextChapterIndex]}/data`);
               setParam(null, `${manga.chapters[nextChapterIndex]}`, `${nextChapter.pages[0][0]}`, nextChapter.pages, manga, nextChapter);
               window.location.href = window.location.href;
          } catch (e) {
               window.location.href = "../title/?manga=" + urlParams.get('manga');
          }
     }
}

/**
 * Handles the right arrow key navigation.
 * @param {Object} chapter - The current chapter data.
 * @param {Object} manga - The current manga data.
 */
function handleRightArrow(chapter, manga) {
     if (arraySecond(chapter.pages).includes(`${parseInt(urlParams.get('pg')) - 1}`)) {
          setParam(null, null, `${parseInt(urlParams.get('pg')) - 2}`, chapter.pages, manga, chapter);
     } else {
          setParam(null, null, `${parseInt(urlParams.get('pg')) - 1}`, chapter.pages, manga, chapter);
     }

     if (parseInt(urlParams.get('pg')) === 0) {
          try {
               const previousChapterIndex = manga.chapters.indexOf(parseFloat(urlParams.get('ch'))) + 1;
               const previousChapter = jsonFromFile(`title/${urlParams.get('manga')}/${manga.chapters[previousChapterIndex]}/data`);
               var lastArray = previousChapter.pages[previousChapter.pages.length - 1];
               if (arraySecond(previousChapter.pages).includes(`${lastArray[lastArray.length - 1]}`)) {
                    setParam(null, `${manga.chapters[previousChapterIndex]}`, `${lastArray[lastArray.length - 2]}`, previousChapter.pages, manga, previousChapter);
               } else {
                    setParam(null, `${manga.chapters[previousChapterIndex]}`, `${lastArray[lastArray.length - 1]}`, previousChapter.pages, manga, previousChapter);
               }
               window.location.href = window.location.href;
          } catch (e) {
               window.location.href = "../title/?manga=" + urlParams.get('manga');
          }
     }
}

/**
 * Displays an error message when the manga is not found.
 */
function displayMangaNotFoundError() {
     document.querySelector("header").remove();
     document.querySelector("main").remove();

     var div = document.createElement("div");
     div.classList.add("error");
     document.body.appendChild(div);

     var center = document.createElement("div");
     div.classList.add("error-center");
     div.appendChild(center);

     var text = document.createElement("h1");
     text.textContent = "Manga not found";
     center.appendChild(text);

     var img = document.createElement("img");
     img.width = "250";
     img.height = "250";
     img.src = "../title/error.gif";
     img.draggable = false;
     img.style.borderRadius = "50px";
     img.style.margin = "25px";
     img.style.pointerEvents = "none";
     img.style.webkitTouchCallout = "none";
     center.appendChild(img);

     var para = document.createElement("p");
     center.appendChild(para);

     var button = document.createElement("a");
     button.className = "button";
     button.textContent = "Back to Titles";

     var ppath = "/";
     if (window.location.pathname.includes('/tlstuff')) {
          ppath = "/tlstuff/";
     }

     var split = window.location.href.split('/');
     button.href = split[0] + "//" + split[2] + ppath + "titles";

     para.appendChild(button);

     document.title = "Manga Not Found - Keishi TL Stuff";
}

/**
 * Hides the accessibility menu.
 */
function closeAccess() {
     document.getElementById("access-right").style.backgroundColor = "transparent";
     document.getElementById("access-left").style.backgroundColor = "transparent";
     document.getElementById("access").style.visibility = "hidden";
     document.getElementById("access").style.opacity = "0";
     document.getElementById("access").style.zIndex = "-1";
     document.getElementById("access-cover").style.visibility = "hidden";
     document.getElementById("access-cover").style.opacity = "0";
     document.getElementById("access-cover").style.zIndex = "-1";
}

/**
 * Makes the accessibility menu visible.
 */
function openAccess() {
     document.getElementById("access-right").style.backgroundColor = "rgba(100, 0, 0, 0.3)";
     document.getElementById("access-left").style.backgroundColor = "rgba(0, 0, 100, 0.3)";
     document.getElementById("access").style.visibility = "visible";
     document.getElementById("access").style.opacity = "1";
     document.getElementById("access").style.zIndex = "1002";
     document.getElementById("access-cover").style.visibility = "visible";
     document.getElementById("access-cover").style.opacity = "1";
     document.getElementById("access-cover").style.zIndex = "1001";
}

// Event listeners for the accessibility menu
document.getElementById("access-close").addEventListener("click", () => {
     closeAccess();
})
document.getElementById("access-cover").addEventListener("click", () => {
     closeAccess();
})
document.getElementById("access-center").addEventListener("click", () => {
     openAccess();
})

closeAccess();

// Initialize page on load
initializePage();
