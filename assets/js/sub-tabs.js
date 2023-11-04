

function openCity(evt, cityName) {
    var i,  tablinks;
    var tabcontent;
    tabcontent = document.getElementsByClassName("tabcontent");
    
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("showBTechBriefStory").click();


// function showBTechSeminar() {
//     document.getElementById("showBTechSeminar").click();
// }

function showSubTab(thatSubTab) {
    document.getElementById(thatSubTab).click();
}


document.addEventListener("DOMContentLoaded", function () {
    const tabContainer = document.querySelector(".tab");
    const tabs = Array.from(tabContainer.querySelectorAll(".tablinks"));

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
            // Remove the "active" class from all tabs
            // tabs.forEach((t) => t.classList.remove("active"));

            // Add the "active" class to the clicked tab
            // tab.classList.add("active");

            // Reorder the tabs so that the active tab is on the left
            tabContainer.prepend(tab);
        });
    });
});


// for (i = 0; i < tabcontent.length; i++) {
//     tabcontent[0].style.display = "block";
// }