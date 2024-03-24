const queryString = window.location.search;
const limitedVersion = queryString.includes("version=limited");

if (limitedVersion) {
    const limitedElements = document.querySelectorAll(".limited-content");
    limitedElements.forEach(element => element.style.display = "none");

    document.getElementById("BITSH-Banner").style.display = "block";
}

