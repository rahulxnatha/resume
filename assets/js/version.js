const queryString = window.location.search;
const limitedVersion = queryString.includes("version=limited");
const unlocked_content_on = queryString.includes("from=resume");
// locked_content

if (limitedVersion) {
    const limitedElements = document.querySelectorAll(".limited-content");
    limitedElements.forEach(element => element.style.display = "none");

    document.getElementById("BITSH-Banner").style.display = "block";
    
}

if(unlocked_content_on){
    let unlocked_content = document.querySelectorAll('unlocked_content');
    for (let index = 0; index < unlocked_content.length; index++) {
        unlocked_content[index].style.display = "block";
    }

    document.querySelectorAll('unlocked_content')[1].style.display = "block";
}


