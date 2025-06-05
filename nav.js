/**
 * Adds a navigation item to the navigation bar.
 * @param {string} name - The display name of the navigation item.
 * @param {string} link - The relative link for the navigation item.
 */
function parseNavItem(name, link) {
    // Create a list item element
    var li = document.createElement("li");

    // Create a link element
    var a = document.createElement("a");

    // Append the link to the list item
    li.appendChild(a);

    // Append the list item to the navigation div
    navDiv.appendChild(li);

    // If the link is an absolute URL, set it as the href of the link, and add a funny icon
    if (link.includes('https://')) {
        a.innerHTML = name + ` <i class="fa-solid fa-up-right-from-square"></i>`
        a.href = link;
        a.target = "_blank";
        return;
    }

    // Set the display name of the link
    a.textContent = name;

    // Determine the base path
    var ppath = "/";
    if (window.location.pathname.includes('/tlstuff')) {
        ppath = "/tlstuff/";
    }

    // Construct the full URL and set it as the href of the link
    var split = window.location.href.split('/');
    a.href = split[0] + "//" + split[2] + ppath + link;
}

// Get the navigation div element
const navDiv = document.getElementById("nav");

// Add navigation items
// parseNavItem("Home", "");
parseNavItem("Titles", "titles");
parseNavItem("Updates", "feed");
// parseNavItem("About", "about");
parseNavItem("Source Code", "https://github.com/keishispl/tlstuff");
