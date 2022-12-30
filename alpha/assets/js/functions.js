

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

// const tab_bar = document.getElementsByTagName("tab_bar90");
// document.getElementById("vertical_tabs_switch").addEventListener("click", () => {
//    tab_bar.style.height = "500px";
//    tab_bar.style.position = "absolute";
//    tab_bar.style.top = "0px";
//    tab_bar.style.zIndex = 100;
// });



document.getElementById("default_focus").click();
document.getElementById("focus_search_bar").addEventListener("click", () => {
    document.getElementById("search_bar").focus();
    document.getElementById("header_message").style.display = "block";
    document.getElementById("header_message2").style.display = "block";
    setTimeout(function () {
        document.getElementById("header_message").style.display = "none";
        document.getElementById("header_message2").style.display = "none";

    }, 1000);
    window.scrollTo(0, 0);



});

const articles = document.getElementsByTagName("article");



const briefblock = document.getElementsByClassName("briefblock");









const elemtabs = document.getElementsByClassName("elemtab");






const tab_close = document.getElementsByClassName("tab_close");

for (let i = 0; i < elemtabs.length; i++) {
    document.getElementsByClassName("elemtab")[i].setAttribute("draggable", true);

    elemtabs[i].style.display = "none";

    elemtabs[i].innerHTML = "Tab" + i + "<span class=\"tab_close\"></span>";

}

elemtabs[elemtabs.length - 1].style.display = "inline-block";

elemtabs[0].style.display = "inline-block";

var tab_close_clicked = 0;
var closed_tab_is = 0;

for (let j = 0; j < tab_close.length; j++) {



    tab_close[j].addEventListener("click", () => {
        elemtabs[j].style.display = "none";
        tab_close_clicked = 1;
        closed_tab_is = j;


    });


    // setTimeout(function () { tab_close_clicked = 0; }, 0);


}


function ActivateElemTab(which_tab) {
    elemtabs[which_tab].style.background = "var(--ai)";
}
function DEActivateElemTab(which_tab) {
    elemtabs[which_tab].style.background = "var(--windowBackground)";
}


for (let i = 0; i < briefblock.length; i++) {

    document.getElementsByClassName("elemtab")[i].addEventListener("click", () => {
        setTimeout(function () {
            if (tab_close_clicked == 0) {

                for (let i = 0; i < briefblock.length; i++) {
                    briefblock[i].style.display = "none";
                    DEActivateElemTab(i);
                }
                briefblock[i].style.display = "block";
                ActivateElemTab(i);

            }
            tab_close_clicked = 0;
        }, 0);

    });



}

var clickedArticle = false;
var clickedArticleIs = 0;



for (let i = 0; i < articles.length; i++) {

    articles[i].setAttribute("draggable", true);
    articles[i].classList.add("article");

    articles[i].addEventListener("click", () => {

        // if (clickedArticleIs == closed_tab_is) {
        elemtabs[i].style.display = "inline-block";
        // }

        clickedArticle = true;
        if (clickedArticleIs == i) {
            clickedArticle = false;
        }

        articles[i].classList.add("microinteraction");

        articles[i].classList.toggle("active");

        briefblock[clickedArticleIs].style.display = "none";

        // briefblock[i].style.display = "block";


        for (let ij = 0; ij < briefblock.length; ij++) {
            briefblock[ij].style.display = "none";
            DEActivateElemTab(ij);
        }

        ActivateElemTab(i);
        showBriefBlock(i);
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            document.getElementById("color_inversion_notice_box").style.display = "block";





        } else {
            document.getElementById("color_inversion_notice_box").style.display = "none";
        }

        document.getElementById("blurFocusScreen").style.display = "none";

        // articles[i].className = 'microinteraction';

        console.log(i + " is the key");
        removeActive(i);
        clickedArticleIs = i;

        document.getElementById("smallNotiText").innerText = "Use tabs on the above box to switch between things.";

    });

    function removeActive(j) {
        for (let i = 0; i < articles.length; i++) {

            if (i !== j) {
                articles[i].classList.remove("active");
                articles[i].classList.remove("microinteraction");
            }

            setTimeout(function () { articles[i].classList.remove("microinteraction"); }, 300);

            console.log(j + " is the second key");
        };


    }

    articles[i].addEventListener("mouseover", () => {

        setTimeout(function () {
            articles[i].classList.add("article_hovered");
        }, 0);

        if (clickedArticle == 0) {



            setTimeout(function () {

                briefblock[clickedArticleIs].style.display = "none";
                briefblock[0].style.display = "none";


                briefblock[i].style.display = "inline";
            }, 000);

            // briefblock[i].style.display = "inline";


            document.getElementById("viewPort").style.zIndex = 5;

            document.getElementById("blurFocusScreen").style.display = "block";

            // document.getElementsByTagName("viewportContent")[i].style.display = "block";

            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                document.getElementById("color_inversion_notice_box").style.display = "block";
                document.getElementById("show_color-inversion-toggle_view").style.display = "block";
                document.getElementById("color_inversion_for_viewport_embedded_content_toggle").checked = 1;

                for (let embed = 0; embed < document.getElementsByClassName("embedded_in_lighttheme").length; embed++) {

                    if (
                        document.getElementById("color_inversion_for_viewport_embedded_content_toggle").checked == 0
                    ) {
                        document.getElementsByClassName("embedded_in_lighttheme")[embed].style.filter = "invert(0%)";
                    }
                    else {

                        document.getElementsByClassName("embedded_in_lighttheme")[embed].style.filter = "invert(92%)";
                    }
                }



                // for (embed = 0; embed < embedded_in_lighttheme.length; embed++) {
                //     document.getElementsByClassName("embedded_in_lighttheme")[embed].style.filter = "invert(92%)";
                // }


                // document.getElementById("color_inversion_alert").innerHTML = "<p>The dark theme is achieved on the above embedded content by a color inversion technique. If you find any image or content a bit off, turn off the color inversion using this switch.</p> ";

            } else {
                document.getElementById("color_inversion_notice_box").style.display = "none";
            }

            setTimeout(function () {
                document.getElementById("smallNotiText").innerText = "Great! Click it to read about it.";
            }, 000);

        }

        else {
            setTimeout(function () {
                document.getElementById("smallNotiText").innerText = "Use tabs on the above box to switch between things.";
            }, 0);
        }
        // document.getElementById("linkedin_post").src = "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:6830070522202718208";





    });

    articles[i].addEventListener("mouseout", () => {

        articles[i].classList.remove("article_hovered");

        if (clickedArticle == 0) {



            setTimeout(function () {

                briefblock[i].style.display = "none";
                briefblock[clickedArticleIs].style.display = "none";
                briefblock[0].style.display = "inline";

            }, 00);

            // briefblock[0].style.display = "inline";

            document.getElementById("color_inversion_notice_box").style.display = "none";
            document.getElementById("blurFocusScreen").style.display = "none";

            document.getElementById("smallNotiText").innerText = "Place cursor over any tile and see!";
        }

        else {
            document.getElementById("smallNotiText").innerText = "Use tabs on the above box to switch between things.";
        }
    });

    // element.classList.remove("offline");

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

// document.getElementById("testblock").addEventListener("mouseover", () => {


//     if (clickedArticle == 0) {

//         document.getElementById("viewPort").style.zIndex = 4;
//         document.getElementById("blurFocusScreen").style.display = "block";
//         if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
//             document.getElementById("color_inversion_notice_box").style.display = "block";

//             document.getElementsByClassName("embedded_in_lighttheme")[0].style.filter = "invert(92%)";

//             document.getElementById("color_inversion_for_viewport_embedded_content_toggle").checked = 1;
//             document.getElementById("color_inversion_alert").innerHTML = "<p>The dark theme is achieved on the above embedded content by a color inversion technique. If you find any image or content a bit off, turn off the color inversion using this switch.</p> ";
//         } else {
//             document.getElementById("color_inversion_notice_box").style.display = "none";
//         }

//     }

// document.getElementById("linkedin_post").src = "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:6830070522202718208";

// });

// document.getElementById("course_linkedin_6830070522202718208").addEventListener("mouseout", () => {


//     if (clickedArticle == 0) {
//         // document.getElementById("defaultView").style.display = "block";
//         // document.getElementById("linkedin_post").style.display = "none";
//         document.getElementById("color_inversion_notice_box").style.display = "none";
//         document.getElementById("blurFocusScreen").style.display = "none";

//     }
//     // if (true) {
//     //     document.getElementById("linkedin_6830070522202718208").style.filter = "invert(100%)";
//     // os-win artdeco windows theme--dark-lix
//     // }

// });
// var mainSection = document.getElementsByTagName("section");
var mainSection = document.getElementsByClassName("mainSection");

document.getElementById("expandAll").addEventListener("click", () => {


    for (let selSection = 0; selSection < mainSection.length; selSection++) {

        if (
            document.getElementById("expandAll").checked == 1
        ) {
            // document.getElementsByClassName("embedded_in_lighttheme")[embed].style.height = "auto";
            mainSection[selSection].style.maxHeight = "none";
        }
        else {
            // document.getElementsByClassName("embedded_in_lighttheme")[embed].style.height = "500px";
            mainSection[selSection].style.maxHeight = "500px";
        }
    }
}
);

document.getElementById("showFilters").addEventListener("click", () => {




    if (
        document.getElementById("showFilters").checked == 1
    ) {
        // document.getElementsByClassName("embedded_in_lighttheme")[embed].style.height = "auto";
        document.getElementById("filtersSection").style.display = "grid";
        document.getElementById("showFiltersCap").innerText = "Filters";
    }
    else {
        // document.getElementsByClassName("embedded_in_lighttheme")[embed].style.height = "500px";
        document.getElementById("filtersSection").style.display = "none";
        document.getElementById("showFiltersCap").innerText = "Filters";
    }

}
);




document.getElementById("color_inversion_for_viewport_embedded_content_toggle").addEventListener("click", () => {


    for (let embed = 0; embed < document.getElementsByClassName("embedded_in_lighttheme").length; embed++) {

        if (
            document.getElementById("color_inversion_for_viewport_embedded_content_toggle").checked == 0
        ) {
            document.getElementsByClassName("embedded_in_lighttheme")[embed].style.filter = "invert(0%)";
        }
        else {

            document.getElementsByClassName("embedded_in_lighttheme")[embed].style.filter = "invert(92%)";
        }
    }
});


function activateDarkMode() {

    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
        for (let embed = 0; embed < document.getElementsByClassName("embedded_in_lighttheme").length; embed++) {
            document.getElementsByClassName("embedded_in_lighttheme")[embed].style.filter = "invert(0%)";

        }
        document.getElementById("color_inversion_notice_box").style.display = "none";

        // for (embed = 0; embed < embedded_in_lighttheme.length; embed++) {
        //     document.getElementsByClassName("embedded_in_lighttheme")[embed].style.filter = "invert(92%)";
        // }


        // document.getElementById("color_inversion_alert").innerHTML = "<p>The dark theme is achieved on the above embedded content by a color inversion technique. If you find any image or content a bit off, turn off the color inversion using this switch.</p> ";

    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        for (let embed = 0; embed < document.getElementsByClassName("embedded_in_lighttheme").length; embed++) {
            document.getElementsByClassName("embedded_in_lighttheme")[embed].style.filter = "invert(92%)";
        }
        document.getElementById("color_inversion_notice_box").style.display = "block";
    }


    else {
        document.getElementById("color_inversion_notice_box").style.display = "block";
    }

}

// MediaQueryList
const darkModePreference = window.matchMedia("(prefers-color-scheme: light)");
const darkModePreference2 = window.matchMedia("(prefers-color-scheme: dark)");

// recommended method for newer browsers: specify event-type as first argument
darkModePreference.addEventListener("change", e => e.matches && activateDarkMode());
darkModePreference2.addEventListener("change", e2 => e2.matches && activateDarkMode());

// deprecated method for backward compatibility
darkModePreference.addListener(e => e.matches && activateDarkMode());
darkModePreference2.addListener(e2 => e2.matches && activateDarkMode());











// // function removeAside() {
// //     document.getElementById("viewPort").style.display = "none";
// //     document.getElementById("main").style.width = "calc(100% - 85px)";
// //     document.getElementById("testtgb").classList.add("three-repeat-main-section");



// // }

const aside = document.getElementsByTagName("aside");
const main = document.getElementsByTagName("main");

document.getElementsByClassName("asideCloseClass")[0].addEventListener("click", () => {

    setTimeout(function () {
        let mainSections = document.querySelectorAll('main section');
        for (let index = 0; index < mainSections.length; index++) {
            mainSections[index].classList.toggle("mainSectionOnAsideClose");
        }

        let mainSpan = document.querySelectorAll('main span');
        for (let index = 0; index < mainSpan.length; index++) {
            mainSpan[index].classList.toggle("mainSpanOnAsideClose");
        }
        document.getElementById("asideOpenCheckbox").checked = !document.getElementById("asideOpenCheckbox").checked;

        main[0].classList.toggle("mainOnAsideClose");
    }, 0);
    setTimeout(function () {
        aside[0].classList.toggle("asideMoveOut");
    }, 0);

});

document.getElementsByClassName("asideCloseClass")[1].addEventListener("click", () => {

    setTimeout(function () {
        let mainSections = document.querySelectorAll('main section');
        for (let index = 0; index < mainSections.length; index++) {
            mainSections[index].classList.toggle("mainSectionOnAsideClose");
        }

        let mainSpan = document.querySelectorAll('main span');
        for (let index = 0; index < mainSpan.length; index++) {
            mainSpan[index].classList.toggle("mainSpanOnAsideClose");
        }

        main[0].classList.toggle("mainOnAsideClose");
    }, 0);

    setTimeout(function () {
        aside[0].classList.toggle("asideMoveOut");
    }, 0);
});








var makeitFullScreen = 0;
document.getElementById("fsenterclick").addEventListener("click", () => {
    openFullscreenViewPort();
});
document.getElementById("fsexitclick").addEventListener("click", () => {
    openFullscreenViewPort();
});
var elemviewPort = document.getElementById("viewPort");
function openFullscreenViewPort() {
    document.getElementById("fsexitclick").style.display = "inline";
    document.getElementById("fsenterclick").style.display = "none";
    if (elemviewPort.requestFullscreen) {
        elemviewPort.requestFullscreen();
    } else if (elemviewPort.webkitRequestFullscreen) { /* Safari */
        elemviewPort.webkitRequestFullscreen();
    } else if (elemviewPort.msRequestFullscreen) { /* IE11 */
        elemviewPort.msRequestFullscreen();
    }
    if (makeitFullScreen == 1) {
        makeitFullScreen = 0;
        document.onclick = function (event) {
            if (document.fullscreenElement) {
                document.exitFullscreen()
                    .then(() => console.log("Document Exited from Full screen mode"))
                    .catch((err) => console.error(err))
            } else {
                document.documentElement.requestFullscreen();
            }
            document.getElementById("fsexitclick").style.display = "none";
            document.getElementById("fsenterclick").style.display = "inline";
        }
    } else {
        makeitFullScreen = 1;
    }
}

// const briefblock = document.getElementsByClassName("briefblock");
// var briefBlockNumber = 0;

function showBriefBlock(briefBlockNumber) {
    for (let i = 0; i < briefblock.length; i++) {

        briefblock[i].style.display = "none";
    }
    briefblock[briefBlockNumber].style.display = "block";
}



function handleDragStart(e) {
    this.style.opacity = '0.4';
  
    dragSrcEl = this;
  
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
  }

function handleDragEnd(e) {
    this.style.opacity = '1';

    items.forEach(function (item) {
        item.classList.remove('over');
    });
}

function handleDragOver(e) {
    e.preventDefault();
    return false;
}

function handleDragEnter(e) {
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over');
}

function handleDrop(e) {
    e.stopPropagation();
  
    if (dragSrcEl !== this) {
      dragSrcEl.innerHTML = this.innerHTML;
      this.innerHTML = e.dataTransfer.getData('text/html');
    }
  
    return false;
  }

let items = document.querySelectorAll('.elemtab, .article');
items.forEach(function (item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('drop', handleDrop);

});




// document.addEventListener('DOMContentLoaded', (event) => {

// function handleDragStart(e) {
//     this.style.opacity = '0.4';
// }



// function handleDragOver(e) {
//     e.preventDefault();
//     return false;
// }

// function handleDragEnter(e) {
//     this.classList.add('over');
// }

// function handleDragLeave(e) {
//     this.classList.remove('over');
// }

// let items = document.querySelectorAll('.elemtab, .article');

// items.forEach(function (item) {
//     item.addEventListener('dragstart', handleDragStart);
//     item.addEventListener('dragover', handleDragOver);
//     item.addEventListener('dragenter', handleDragEnter);
//     item.addEventListener('dragleave', handleDragLeave);
//     item.addEventListener('dragend', handleDragEnd);
//     item.addEventListener('drop', handleDrop);
// });

// function handleDragEnd(e) {
//     this.style.opacity = '1';

//     items.forEach(function (item) {
//         item.classList.remove('over');
//     });
// }
//   });

