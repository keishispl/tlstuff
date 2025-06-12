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
 * Retrieves the value of a specified cookie.
 * If the cookie is not found, returns "rtl".
 *
 * @param {string} cname - The name of the cookie to retrieve.
 * @returns {string} The value of the specified cookie or "rtl" if not found.
 */
function getCookie(cname) {
     let name = cname + "=";
     let decodedCookie = decodeURIComponent(document.cookie);
     let ca = decodedCookie.split(';');
     for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
               c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
               return c.substring(name.length, c.length);
          }
     }
     return "rtl";
}

var readmode = getCookie("reading-mode");

// Reading mode button
var readingButton = document.getElementById("reading-button");
readingButton.addEventListener("change", () => {
     if (readingButton.value === readmode) {
          readingButton.value = "0";
     } else {
          document.cookie = `reading-mode=${readingButton.value};`;
          location.reload();
     }
});

/**
 * Initializes the page, sets up key event listeners, and handles navigation
 * based on URL parameters for the manga viewer.
 */
function initializePage() {
     if (jsonFromFile('all').includes(urlParams.get('manga'))) {
          const manga = jsonFromFile(`title/${urlParams.get('manga')}/data`);

          if (arrayThird(manga.chapters).includes(`${urlParams.get('ch')}`)) {
               const chapter = jsonFromFile(`title/${urlParams.get('manga')}/${urlParams.get('ch')}/data`);

               if (chapter.long_strip || readmode === "ls") {
                    /**
                     * 
                     * 
                     * 
                     * 
                     * Long Strip Format
                     * 
                     * 
                     * 
                     * 
                     */
                    ['access', 'progressbar'].forEach(e => document.getElementById(e).className = "long-strip");
                    document.getElementById("normal").remove();

                    history.pushState(null, null, "../read/?manga=" + urlParams.get('manga') + "&ch=" + urlParams.get('ch'));

                    /**
                     * Sets the titles for the chapter viewer.
                     * @param {Object} manga The manga JSON object
                     * @param {Object} chapter The chapter JSON object
                     * @param {URLSearchParams} urlParams The URL parameters
                     */
                    function setTitles(manga, chapter, urlParams) {
                         document.title = "Chapter " + urlParams.get('ch') + " - " + manga.title + " - Keishi TL Stuff";

                         document.getElementById("chapter").textContent = chapter.alt.length > 0 ? chapter.alt : "Chapter " + urlParams.get('ch');

                         document.getElementById("title").innerHTML = `<a href="` + "../title/?manga=" + urlParams.get('manga') + `">` + manga.title + `</a>`;
                    }

                    setTitles(manga, chapter, urlParams);

                    // Scroll for access menu
                    if (window.scrollY > window.innerHeight / 10 * 4 - 225) {
                         document.getElementById("access").style.position = "fixed";
                         document.getElementById("access").style.marginTop = "0px";
                    } else {
                         document.getElementById("access").style.position = "absolute";
                         document.getElementById("access").style.marginTop = `calc(40vh - 225px)`;
                    }

                    // Scroll for reading mode button
                    if (window.scrollY > window.innerHeight / 10 * 4 - 225) {
                         document.getElementById("reading-button").style.position = "fixed";
                         document.getElementById("reading-button").style.marginTop = "10px";
                    } else {
                         document.getElementById("reading-button").style.position = "absolute";
                         document.getElementById("reading-button").style.marginTop = `235px`;
                    }
                    document.addEventListener("scroll", () => {
                         // Scroll for access menu
                         if (window.scrollY > window.innerHeight / 10 * 4 - 225) {
                              document.getElementById("access").style.position = "fixed";
                              document.getElementById("access").style.marginTop = "0px";
                         } else {
                              document.getElementById("access").style.position = "absolute";
                              document.getElementById("access").style.marginTop = `calc(40vh - 225px)`;
                         }

                         // Scroll for reading mode button
                         if (window.scrollY > window.innerHeight / 10 * 4 - 225) {
                              document.getElementById("reading-button").style.position = "fixed";
                              document.getElementById("reading-button").style.marginTop = "10px";
                         } else {
                              document.getElementById("reading-button").style.position = "absolute";
                              document.getElementById("reading-button").style.marginTop = `235px`;
                         }
                    })

                    // Long Strip only mangas
                    if (chapter.long_strip) {
                         for (var i = 0; i < readingButton.length; i++) {
                              if (readingButton.options[i].value == 'rtl')
                                   readingButton.remove(i);
                         }
                    }

                    var pages = array(chapter.pages);
                    var pageDiv = document.getElementById("long-strip");

                    for (var i = 0; i < pages.length; i++) {
                         var img = document.createElement("img");
                         img.id = "page_" + i;
                         img.className = "image";
                         img.src = `https://raw.githubusercontent.com/keishispl/tlstuff-resources/refs/heads/main/title/${urlParams.get('manga')}/${urlParams.get('ch')}/${pages[i]}.png`;
                         img.draggable = false;
                         pageDiv.appendChild(img);
                    }

                    document.querySelectorAll('.key').forEach(element => {
                         element.innerHTML = element.innerHTML.replaceAll(" Page", " Chapter");
                    })

                    // Add event listener for keydown events
                    window.addEventListener("keydown", e => {
                         if (document.getElementById("access").style.visibility === "hidden") {
                              handleKeydown(e, jsonFromFile(`title/${urlParams.get('manga')}/data`));
                         }
                    });
                    document.getElementById("access-left").addEventListener("click", () => {
                         handleLeftArrow(jsonFromFile(`title/${urlParams.get('manga')}/data`));
                    });
                    document.getElementById("access-right").addEventListener("click", () => {
                         handleRightArrow(jsonFromFile(`title/${urlParams.get('manga')}/data`));
                    });

                    /**
                     * Handles keydown events for navigating pages.
                     * @param {Event} e - The keyboard event.
                     * @param {Object} manga - The current manga data.
                     */
                    function handleKeydown(e, manga) {
                         if (e.key === "ArrowLeft") {
                              handleLeftArrow(manga);
                         }
                         if (e.key === "ArrowRight") {
                              handleRightArrow(manga);
                         }
                    }

                    /**
                     * Handles the left arrow key navigation.
                     * @param {Object} manga - The current manga data.
                     */
                    function handleLeftArrow(manga) {
                         try {
                              const nextChapterIndex = jsonFromFile(`title/${urlParams.get('manga')}/data`).chapters.indexOf(parseFloat(urlParams.get('ch'))) + 1;
                              window.location.href = "../read/?manga=" + urlParams.get('manga') + "&ch=" + manga.chapters[nextChapterIndex];
                         } catch (e) {
                              window.location.href = "../title/?manga=" + urlParams.get('manga');
                         }
                    }

                    /**
                     * Handles the right arrow key navigation.
                     * @param {Object} manga - The current manga data.
                     */
                    function handleRightArrow(manga) {
                         try {
                              const previousChapterIndex = manga.chapters.indexOf(parseFloat(urlParams.get('ch'))) - 1;
                              window.location.href = "../read/?manga=" + urlParams.get('manga') + "&ch=" + manga.chapters[previousChapterIndex];
                         } catch (e) {
                              window.location.href = "../title/?manga=" + urlParams.get('manga');
                         }
                    }

                    var progressArray = [];
                    var progressBar = document.getElementById("progressbar");
                    var progressPages = array(jsonFromFile(`title/${urlParams.get('manga')}/${urlParams.get('ch')}/data`).pages);
                    for (var i = progressPages.length - 1; i >= 0; i--) {
                         const progress = document.createElement("div");
                         progress.classList.add("progress");
                         progress.id = "progress_" + progressPages[i];
                         progress.style.zIndex = `${jsonFromFile(`title/${urlParams.get('manga')}/${urlParams.get('ch')}/data`).pages.length + 2 - i}`;
                         progressBar.appendChild(progress);

                         progressArray.push(progress);

                         const progresstext = document.createElement("p");
                         progresstext.classList.add("progresstext");
                         progresstext.textContent = progressPages[i];
                         progresstext.id = "progresstext_" + progressPages[i];
                         progress.appendChild(progresstext);

                         progresstext.style.display = 'none';

                         progress.addEventListener('mouseenter', () => {
                              progresstext.style.display = 'block';
                         });

                         progress.addEventListener('mouseleave', () => {
                              progresstext.style.display = 'none';
                         });

                         progress.addEventListener('click', () => {
                              document.getElementById("page_" + (parseInt(progress.id.split("_")[1]) - 1)).scrollIntoView({ behavior: 'smooth' });
                              progressBarUpdate();
                              formatButtons();
                         });
                    }

                    // Add hover effects
                    document.addEventListener('mousemove', function (e) {
                         if (document.getElementById("access").style.visibility === "hidden") {
                              if (e.clientY < window.innerHeight - 75) {
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
                              if (e.clientY < window.innerHeight - 75) {
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
                              if (document.getElementById("page_" + (parseInt(e.id.split("_")[1]) - 1)).getBoundingClientRect().top - 226 >= 0) {
                                   e.style.backgroundColor = "lightcoral";
                              } else {
                                   e.style.backgroundColor = "purple";
                              }
                         })
                    }

                    progressBar.querySelectorAll("div").forEach(e => {
                         e.style.backgroundColor = "lightcoral";
                    })
                    document.getElementById("progress_1").style.backgroundColor = "purple";

                    window.addEventListener("scroll", progressBarUpdate, formatButtons);

                    // Get the chapter and page lists
                    var chaptersDiv = document.getElementById("chapters");
                    var pagesDiv = document.getElementById("pages");

                    // Add event listeners to the chapter button
                    document.getElementById("chapter-button").addEventListener("click", () => {
                         pagesDiv.style.visibility = "hidden";
                         pagesDiv.style.opacity = "0";
                         pagesDiv.style.zIndex = "-1";
                         pagesDiv.style.transform = "translateY(0px)";
                         pagesDiv.scrollTo(0, 0);

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
                         }
                    });

                    // Add event listeners to the page button
                    document.getElementById("page-button").addEventListener("click", () => {
                         chaptersDiv.style.visibility = "hidden";
                         chaptersDiv.style.opacity = "0";
                         chaptersDiv.style.zIndex = "-1";
                         chaptersDiv.style.transform = "translateY(0px)";
                         chaptersDiv.scrollTo(0, 0);

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
                              scrollParentToChild(pagesDiv, document.getElementById("spec-page_1"));
                         }
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

                    /**
                     * Formats the buttons on the page.
                     * This includes adding a click event listener to the chapter and page buttons,
                     * as well as adding the current chapter and page numbers to the buttons.
                     * It also formats the chapter and page lists.
                     */
                    function formatButtons() {

                         chaptersDiv.querySelectorAll("div").forEach(e => {
                              e.remove();
                         })
                         pagesDiv.querySelectorAll("div").forEach(e => {
                              e.remove();
                         })

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

                         // Add the current chapter number to the chapter button
                         document.getElementById("chapter-button-value").textContent = "Chapter " + urlParams.get('ch');

                         // Add the chapter list
                         jsonFromFile(`title/${urlParams.get('manga')}/data`).chapters.reverse().forEach(e => {
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

                         // Add the current page number to the page button
                         document.getElementById("page-button-value").textContent = "Select Page";

                         // Add the page list
                         array(jsonFromFile(`title/${urlParams.get('manga')}/${urlParams.get('ch')}/data`).pages).reverse().forEach(e => {
                              var p = document.createElement("div");
                              p.className = "spec-page";
                              p.id = "spec-page_" + e;
                              pagesDiv.appendChild(p);

                              var a = document.createElement("a");
                              a.addEventListener("click", () => {
                                   document.getElementById("page_" + (e - 1)).scrollIntoView({ behavior: "smooth" });

                                   chaptersDiv.style.visibility = "hidden";
                                   chaptersDiv.style.opacity = "0";
                                   chaptersDiv.style.zIndex = "-1";
                                   chaptersDiv.style.transform = "translateY(0px)";
                                   chaptersDiv.scrollTo(0, 0);

                                   pagesDiv.style.visibility = "hidden";
                                   pagesDiv.style.opacity = "0";
                                   pagesDiv.style.zIndex = "-1";
                                   pagesDiv.style.transform = "translateY(0px)";
                                   pagesDiv.scrollTo(0, 0);
                              });
                              a.textContent = "Page " + e;
                              a.className = "spec-page-link";
                              p.appendChild(a);
                         });
                    }

                    formatButtons();

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
                    ["long", "titles", "bignav", 'access-close', 'access-cover'].forEach(e => {
                         document.getElementById(e).addEventListener("click", () => {
                              closeAccess();
                         })
                    })
                    document.getElementById("access-center").addEventListener("click", () => {
                         openAccess();
                    })

                    closeAccess();
               } else {
                    /**
                     * 
                     * 
                     * 
                     * 
                     * Right-to-Left Format
                     * 
                     * 
                     * 
                     * 
                     */
                    ['access', 'progressbar'].forEach(e => document.getElementById(e).className = "normal");
                    document.getElementById('long-strip').remove();

                    var imagesLoaded = 0;

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
                         imagesLoaded = 0;

                         if (document.querySelectorAll(".loader").length == 0) {
                              var loader = document.createElement("div");
                              loader.classList.add("loader");
                              document.getElementById("main").appendChild(loader);
                         }

                         if (arraySecond(item).includes(`${parseInt(urlParams.get('pg')) + 1}`)) {
                              left.src = `https://raw.githubusercontent.com/keishispl/tlstuff-resources/refs/heads/main/title/${urlParams.get('manga')}/${urlParams.get('ch')}/${parseInt(urlParams.get('pg')) + 1}.png`;
                              left.style.display = "inline-block";
                         } else {
                              imagesLoaded++;
                         }

                         right.src = `https://raw.githubusercontent.com/keishispl/tlstuff-resources/refs/heads/main/title/${urlParams.get('manga')}/${urlParams.get('ch')}/${urlParams.get('pg')}.png`;
                         right.style.display = "inline-block";
                    }

                    function checkLoader() {
                         if (imagesLoaded == 2) {
                              document.querySelectorAll(".loader").forEach(e => e.remove());
                         }
                    }

                    document.getElementById("right").addEventListener("load", () => {
                         imagesLoaded++;
                         if (document.getElementById("right").width > document.getElementById("right").height) {
                              document.getElementById("right").classList.add("wide");
                         } else {
                              document.getElementById("right").classList.remove("wide");
                         }
                         checkLoader();
                    });

                    document.getElementById("left").addEventListener("load", () => {
                         imagesLoaded++;
                         checkLoader();
                    });

                    /**
                     * Sets the titles for the chapter viewer.
                     * @param {Object} manga The manga JSON object
                     * @param {Object} chapter The chapter JSON object
                     * @param {URLSearchParams} urlParams The URL parameters
                     */
                    function setTitles(manga, chapter, urlParams) {
                         document.title = urlParams.get('pg') + " | Chapter " + urlParams.get('ch') + " - " + manga.title + " - Keishi TL Stuff";

                         document.getElementById("chapter").textContent = chapter.alt.length > 0 ? chapter.alt : "Chapter " + urlParams.get('ch');

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

                    // Get the chapter and page lists
                    var chaptersDiv = document.getElementById("chapters");
                    var pagesDiv = document.getElementById("pages");

                    // Add event listeners to the chapter button
                    document.getElementById("chapter-button").addEventListener("click", () => {
                         pagesDiv.style.visibility = "hidden";
                         pagesDiv.style.opacity = "0";
                         pagesDiv.style.zIndex = "-1";
                         pagesDiv.style.transform = "translateY(0px)";
                         pagesDiv.scrollTo(0, 0);

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
                         }
                    });

                    // Add event listeners to the page button
                    document.getElementById("page-button").addEventListener("click", () => {
                         chaptersDiv.style.visibility = "hidden";
                         chaptersDiv.style.opacity = "0";
                         chaptersDiv.style.zIndex = "-1";
                         chaptersDiv.style.transform = "translateY(0px)";
                         chaptersDiv.scrollTo(0, 0);

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
                         }
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

                    /**
                     * Formats the buttons on the page.
                     * This includes adding a click event listener to the chapter and page buttons,
                     * as well as adding the current chapter and page numbers to the buttons.
                     * It also formats the chapter and page lists.
                     */
                    function formatButtons() {

                         chaptersDiv.querySelectorAll("div").forEach(e => {
                              e.remove();
                         })
                         pagesDiv.querySelectorAll("div").forEach(e => {
                              e.remove();
                         })

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

                         // Add the current chapter number to the chapter button
                         document.getElementById("chapter-button-value").textContent = "Chapter " + urlParams.get('ch');

                         // Add the chapter list
                         jsonFromFile(`title/${urlParams.get('manga')}/data`).chapters.reverse().forEach(e => {
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

                         // Add the current page number to the page button
                         document.getElementById("page-button-value").textContent = "Page " + urlParams.get('pg');

                         // Add the page list
                         jsonFromFile(`title/${urlParams.get('manga')}/${urlParams.get('ch')}/data`).pages.reverse().forEach(e => {
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
                    }

                    formatButtons();

                    var progressArray = [];
                    var progressBar = document.getElementById("progressbar");
                    for (var i = jsonFromFile(`title/${urlParams.get('manga')}/${urlParams.get('ch')}/data`).pages.length - 1; i >= 0; i--) {
                         const progress = document.createElement("div");
                         progress.classList.add("progress");
                         progress.id = "progress_" + jsonFromFile(`title/${urlParams.get('manga')}/${urlParams.get('ch')}/data`).pages[i].join("-");
                         progress.style.zIndex = `${jsonFromFile(`title/${urlParams.get('manga')}/${urlParams.get('ch')}/data`).pages.length + 2 - i}`;
                         progressBar.appendChild(progress);

                         progressArray.push(progress);

                         const progresstext = document.createElement("p");
                         progresstext.classList.add("progresstext");
                         progresstext.textContent = jsonFromFile(`title/${urlParams.get('manga')}/${urlParams.get('ch')}/data`).pages[i].join("ー");
                         progresstext.id = "progresstext_" + jsonFromFile(`title/${urlParams.get('manga')}/${urlParams.get('ch')}/data`).pages[i].join("-");
                         progress.appendChild(progresstext);

                         progresstext.style.display = 'none';

                         progress.addEventListener('mouseenter', () => {
                              progresstext.style.display = 'block';
                         });

                         progress.addEventListener('mouseleave', () => {
                              progresstext.style.display = 'none';
                         });

                         progress.addEventListener('click', () => {
                              setParam(null, null, parseInt(progress.id.split("_")[1].split("-")[0]), jsonFromFile(`title/${urlParams.get('manga')}/${urlParams.get('ch')}/data`).pages, jsonFromFile(`title/${urlParams.get('manga')}/data`), jsonFromFile(`title/${urlParams.get('manga')}/${urlParams.get('ch')}/data`));
                              progressBarUpdate();
                              formatButtons();
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
                              handleKeydown(e, jsonFromFile(`title/${urlParams.get('manga')}/${urlParams.get('ch')}/data`), jsonFromFile(`title/${urlParams.get('manga')}/data`));
                              progressBarUpdate();
                         }
                    });
                    document.getElementById("access-left").addEventListener("click", () => {
                         handleLeftArrow(jsonFromFile(`title/${urlParams.get('manga')}/${urlParams.get('ch')}/data`), jsonFromFile(`title/${urlParams.get('manga')}/data`));
                         progressBarUpdate();
                    });
                    document.getElementById("access-right").addEventListener("click", () => {
                         handleRightArrow(jsonFromFile(`title/${urlParams.get('manga')}/${urlParams.get('ch')}/data`), jsonFromFile(`title/${urlParams.get('manga')}/data`));
                         progressBarUpdate();
                    });

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

                         formatButtons();

                         if (!array(chapter.pages).includes(`${parseInt(urlParams.get('pg'))}`) && parseInt(urlParams.get('pg')) > 0) {
                              try {
                                   const nextChapterIndex = jsonFromFile(`title/${urlParams.get('manga')}/data`).chapters.indexOf(parseFloat(urlParams.get('ch'))) + 1;
                                   const nextChapter = jsonFromFile(`title/${urlParams.get('manga')}/${manga.chapters[nextChapterIndex]}/data`);
                                   setParam(null, `${jsonFromFile(`title/${urlParams.get('manga')}/data`).chapters[nextChapterIndex]}`, `${nextChapter.pages[0][0]}`, nextChapter.pages, manga, nextChapter);
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

                         formatButtons();

                         if (parseInt(urlParams.get('pg')) === 0) {
                              try {
                                   const previousChapterIndex = manga.chapters.indexOf(parseFloat(urlParams.get('ch'))) - 1;
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
                    ["long", "titles", "bignav", 'access-close', 'access-cover'].forEach(e => {
                         document.getElementById(e).addEventListener("click", () => {
                              closeAccess();
                         })
                    })
                    document.getElementById("access-cover").addEventListener("click", () => {
                         closeAccess();
                    })
                    document.getElementById("access-center").addEventListener("click", () => {
                         openAccess();
                    })

                    closeAccess();
               }
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
     img.src = "../error.gif";
     img.id = "error-img";
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

// Initialize page on load
initializePage();
