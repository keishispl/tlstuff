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
    a.textContent = name; // Set the display name of the link

    // Append the link to the list item
    li.appendChild(a);

    // Append the list item to the navigation div
    navDiv.appendChild(li);

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
// parseNavItem("About", "about");
