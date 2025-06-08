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

var mangaList = jsonFromFile("all");
location.replace("../title/?manga=" + mangaList[Math.floor(Math.random() * mangaList.length)]);