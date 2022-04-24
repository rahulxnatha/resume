

// const menuOptions = ["Home", "Blog", "Projects", "Settings"];

// const menuOption = document.getElementsByClassName("menuOption");

// for (let i = 0, j = -1 + menuOptions.length; i < menuOption.length; i++, j--) {
//     menuOption[i].innerHTML = menuOptions[j];
// }

// for (let i = menuOptions.length; i < menuOption.length; i++) {
//     menuOption[i].style.display = "none";
// }

// for (let i = 0; i < menuOption.length; i++) {
//     if (menuOption[i].innerHTML == "Settings") {

//         menuOption[i].addEventListener("click", display_settings_now);
//         var showSettings = false;
//         function display_settings_now() {

//             if (showSettings == false) {
//                 showSettings = true;
//             } else {
//                 showSettings = false;
//             }

//             if (showSettings == true) {

//                 if (document.getElementById("dark-toggle").checked == true) {
//                     menuOption[i].style.border = "3px solid #fff";
//                 }
//                 else {
//                     menuOption[i].style.border = "3px solid #000";
//                 }

//                 document.getElementById("assistant").style.display = "block";

//             } else {

//                 if (document.getElementById("dark-toggle").checked == true) {
//                     menuOption[i].style.border = "3px solid #333";
//                 }
//                 else {
//                     menuOption[i].style.border = "3px solid #eee";
//                 }

//                 for (let i = assistant.length; i < assistant.length; i++) {
//                     assistant[i].style.display = "none";
//                 }

//                 document.getElementById("assistant").style.display = "none";
//             }


//         }



//     }
// }

// const menu = document.getElementsByTagName("nav")[0].childNodes;

// for (let i = 0; i < menu.length; i++) {
//     menu[i].innerHTML = menuOptions[i];
// }

// for (let i = 0, j = -1 + menuOptions.length; i < menu.length; i++, j--) {
//         menu[i].innerHTML = menuOptions[j];
//     }


// window.addEventListener("keydown", function (event) {
//     if (event.defaultPrevented) {
//         return; // Should do nothing if the default action has been cancelled
//     }

//     var handled = false;
//     if (
//         event.key.toLowerCase() === "d"
//         && event.altKey

//     ) {
//         // Handle the event with KeyboardEvent.key and set handled true.
//         document.getElementById("dark-toggle").click();
//         handled = true;

//     } else if (
//         event.keyCode.toLowerCase() === "d"
//         && event.altKey

//     ) {
//         // Handle the event with KeyboardEvent.keyCode and set handled true.
//         document.getElementById("dark-toggle").click();
//         handled = true;
//     }

//     if (handled) {
//         // Suppress "double action" if event handled
//         event.preventDefault();
//     }
// }, true);


const articles = document.getElementsByTagName("article");

var clickedArticle = false;

for (let i = 0; i < articles.length; i++) {

    articles[i].addEventListener("click", () => {
        articles[i].classList.toggle("active");
        articles[i].classList.toggle("microinteraction");

        document.getElementById("defaultView").style.display = "none";

        document.getElementById("linkedin_post").style.display = "block";

        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            document.getElementById("color_inversion_notice_box").style.display = "block";
        } else {
            document.getElementById("color_inversion_notice_box").style.display = "none";
        }

        document.getElementById("blurFocusScreen").style.display = "none";
        clickedArticle = true;

        // articles[i].className = 'microinteraction';

        console.log(i + " is the key");
        removeActive(i);
    });

    articles[i].addEventListener("mouseover", () => {

        if (clickedArticle == 0) {
            document.getElementById("defaultView").style.display = "none";
            document.getElementById("linkedin_post").style.display = "block";
            document.getElementById("viewPort").style.zIndex = 4;
            document.getElementById("blurFocusScreen").style.display = "block";

            // document.getElementsByTagName("viewportContent")[i].style.display = "block";

            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                document.getElementById("color_inversion_notice_box").style.display = "block";
                document.getElementById("linkedin_post").style.filter = "invert(92%)";
                document.getElementById("color_inversion_for_viewport_embedded_content_toggle").checked = 1;

                document.getElementById("color_inversion_alert").innerHTML = "<p>The dark theme is achieved on the above embedded content by a color inversion technique. If you find any image or content a bit off, turn off the color inversion using this switch.</p> ";

            } else {
                document.getElementById("color_inversion_notice_box").style.display = "none";
            }

        }

        document.getElementById("linkedin_post").src = "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:6830070522202718208";
    });

    articles[i].addEventListener("mouseout", () => {
        if (clickedArticle == 0) {
            document.getElementById("defaultView").style.display = "block";
            document.getElementById("linkedin_post").style.display = "none";
            document.getElementById("color_inversion_notice_box").style.display = "none";
            document.getElementById("blurFocusScreen").style.display = "none";

        }
    });

    // element.classList.remove("offline");

}

function removeActive(j) {
    for (let i = 0; i < articles.length; i++) {

        if (i !== j) {
            articles[i].classList.remove("active");
        }
        setTimeout(function () { articles[i].classList.remove("microinteraction"); }, 300);


        console.log(j + " is the second key");
    };


}

document.getElementById("contact_focus_trigger").addEventListener("click", () => {
    document.getElementById("contact_section").classList.toggle("focus_element");
    setTimeout(function () { document.getElementById("contact_section").classList.remove("focus_element"); }, 4000);
});



// viewport functions

// document.getElementsByClassName("backgroundHover")[0].addEventListener("mouseover", () => {

//     document.getElementById("defaultView").style.display = "block";
//     document.getElementById("linkedin_6830070522202718208").style.display = "none";


// });

document.getElementById("course_linkedin_6830070522202718208").addEventListener("mouseover", () => {


    if (clickedArticle == 0) {
        document.getElementById("defaultView").style.display = "none";

        document.getElementById("linkedin_post").style.display = "block";


        document.getElementById("viewPort").style.zIndex = 4;



        document.getElementById("blurFocusScreen").style.display = "block";

        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            document.getElementById("color_inversion_notice_box").style.display = "block";
            document.getElementById("linkedin_post").style.filter = "invert(92%)";
            document.getElementById("color_inversion_for_viewport_embedded_content_toggle").checked = 1;

            document.getElementById("color_inversion_alert").innerHTML = "<p>The dark theme is achieved on the above embedded content by a color inversion technique. If you find any image or content a bit off, turn off the color inversion using this switch.</p> ";

        } else {
            document.getElementById("color_inversion_notice_box").style.display = "none";
        }

    }

    document.getElementById("linkedin_post").src = "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:6830070522202718208";

});

document.getElementById("course_linkedin_6830070522202718208").addEventListener("mouseout", () => {


    if (clickedArticle == 0) {
        document.getElementById("defaultView").style.display = "block";
        document.getElementById("linkedin_post").style.display = "none";
        document.getElementById("color_inversion_notice_box").style.display = "none";
        document.getElementById("blurFocusScreen").style.display = "none";

    }
    // if (true) {
    //     document.getElementById("linkedin_6830070522202718208").style.filter = "invert(100%)";
    // os-win artdeco windows theme--dark-lix
    // }

});

document.getElementById("color_inversion_for_viewport_embedded_content_toggle").addEventListener("click", () => {
    if (
        document.getElementById("color_inversion_for_viewport_embedded_content_toggle").checked == 0
    ) {
        document.getElementById("linkedin_post").style.filter = "invert(0%)";
    } else {
        document.getElementById("linkedin_post").style.filter = "invert(92%)";
    }
});

// function removeAside() {
//     document.getElementById("viewPort").style.display = "none";
//     document.getElementById("main").style.width = "calc(100% - 85px)";
//     document.getElementById("testtgb").classList.add("three-repeat-main-section");



// }
