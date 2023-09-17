
// var inputs = document.querySelectorAll('input');

// for (var i = 0; i < inputs.length; i++) {
//   inputs[i].style.appearance = 'none';
// }
// ------------------------------------------------------------------------------

/////////////////////////////////////////////////////////////////////

  // document.getElementById("width_px_aside").innerText = event.clientX + "px" ;

  

 


// draggableDiv.addEventListener("mouseup", function() {
// });




let windowWidth = window.innerWidth; // Initialize with the initial window width
let windowHeight = window.innerHeight; // Initialize with the initial window height

// console.log("Initial window width:", windowWidth);
// console.log("Initial window width:", windowHeight);

function updateWindowSize() {
  windowWidth = window.innerWidth; // Update the value when the window is resized
  windowHeight = window.innerHeight; // Update the value when the window is resized

  // console.log("Updated window width:", windowWidth);
  // console.log("Updated window height:", windowHeight);

  // document.getElementById("width_px_aside").innerText = "Width: " + windowWidth + " Height: " + windowHeight;
}

// Add a resize event listener to call the function when the window is resized
window.addEventListener("resize", updateWindowSize);


// Call the function initially to get the initial width
updateWindowSize();


var screenWidth = 0;

var increase_width_aside_by = 0;
var aside_enlarged = 0;

function changeWidth_aside(width) {

  // document.getElementById("default_focus").style.display = "none";
  // if (aside_enlarged) {
  //   increase_width_aside_by = 0;
  //   aside_enlarged = 0;
  // } else {
  //   increase_width_aside_by = 200;
  //   aside_enlarged = 1;
  // }
  if (width == "main_mouseout" || width == "aside_mouseout" || width == "main_mouseover" ) {
    increase_width_aside_by = 0;
    aside_enlarged = 0;
  } else {
    
    
    // increase_width_aside_by = 200;
    increase_width_aside_by = 0;
    aside_enlarged = 1; 
    
    let mainSections = document.querySelectorAll('main section');
        for (let index = 0; index < mainSections.length; index++) {
            mainSections[index].classList.toggle("mainSectionsOnDynamicLayoutTest");
        }

  let mainSpans = document.querySelectorAll('main span');
        for (let index = 0; index < mainSpans.length; index++) {
            mainSpans[index].classList.toggle("mainSpansOnDynamicLayoutTest");
        }
        
        document.getElementById("default_focus").classList.toggle("bannerOnDynamicLayoutTest");


  }
  
  var windowWidth_half = windowWidth / 2;

  var main_pane_width = windowWidth_half - increase_width_aside_by;
  var aside_pane_width = (windowWidth_half - 150) + increase_width_aside_by;



 if(width == "main_mouseover") {
  main_pane_width = windowWidth_half + increase_width_aside_by;
  aside_pane_width = (windowWidth_half - 150) - increase_width_aside_by;
 }


  document.getElementsByTagName("main")[0].style.width = "calc(" + main_pane_width + "px)";
  document.getElementsByTagName("aside")[0].style.width = "calc(" + aside_pane_width + "px)";


     
  // document.getElementsByTagName("main")[0].style.width = "calc(" + 100 + "px)";
  // document.getElementsByTagName("aside")[0].style.width = "calc(" + 300 + "px)";
}

// document.getElementById("viewPort").addEventListener("mouseover", () => {

//   setTimeout(function () {
//     changeWidth_aside("aside_mouseover");
//   }, 0);
// });

// document.getElementById("viewPort").addEventListener("mouseout", () => {

//   setTimeout(function () {
//     changeWidth_aside("aside_mouseout");
//   }, 0);
// });

// document.getElementById("main").addEventListener("mouseover", () => {

//   setTimeout(function () {
//     changeWidth_aside("main_mouseover");
//   }, 0);
// });

// document.getElementById("main").addEventListener("mouseout", () => {

//   setTimeout(function () {
//     changeWidth_aside("main_mouseout");
//   }, 0);
// });





// function changeWidth_aside2() {
//   width_aside_increase = 0;


//   document.getElementsByTagName("main")[0].style.width = "calc(50% - " + width_aside_increase + "px)";
//   document.getElementsByTagName("aside")[0].style.width = "calc(50% - 150px + " + width_aside_increase + "px)";
// }

// setTimeout(changeWidth_aside, 2000);
// setTimeout(changeWidth_aside2, 4000);




// document.getElementsByTagName("main")[0].style.width = "calc(50% - " + width_aside_increase + "px)";
// document.getElementsByTagName("aside")[0].style.width = "calc(50% - 150px + " + width_aside_increase + "px)";


function updateSearchBarWidth() {
  var searchBar = document.getElementById("search_bar");
  var charCount = searchBar.value.length;
  var maxSearchBarWidth = 0.5; // vw
  var initialWidth = 150;
  var additionalWidth = (charCount - 10) * 6.001;

  if (additionalWidth >= 0) {
    var updatedWidth = initialWidth + additionalWidth;
    if (updatedWidth > window.innerWidth * maxSearchBarWidth) {
      updatedWidth = window.innerWidth * maxSearchBarWidth;
      // searchBar.style.height = "auto";
    }
  } else {
    updatedWidth = initialWidth;
    // searchBar.style.height = "auto";
  }

  searchBar.style.width = updatedWidth + "px";
  searchBar.style.marginLeft = "calc((100% - 700px - " + updatedWidth + "px)/2)";
  // searchBar.style.marginLeft = 0 + "px";


  // var searchBar = document.getElementById("search_bar");
  // var charCount = searchBar.value.length;

  // var initialWidth = 150; 

  // var additionalWidth = (charCount - 10) * 6.001; 
  // if (additionalWidth >= 0) {
  // var updatedWidth = initialWidth + additionalWidth; 
  // } else {updatedWidth = initialWidth;}


  // searchBar.style.width = updatedWidth + "px";

  // if (charCount >= 10 && charCount < 15) {
  //   searchBar.style.width = "200px";
  // } else if (charCount >= 15 && charCount < 20) {
  //   searchBar.style.width = "250px";
  // } else if (charCount >= 20 && charCount < 25) {
  //   searchBar.style.width = "300px";
  // } else if (charCount >= 25) {
  //   searchBar.style.width = "350px";
  // } else {
  //   searchBar.style.width = "150px";
  // }
}


// document.getElementById("time").innerHTML = "&nbsp;2024 Alpha Preview&nbsp; ";


// $( document ).ready(function() {
//   adaptColor('.elemtab_active');
// });

// function adaptColor(selector) {
// var rgb = $(selector).css("background-color");

// if (rgb.match(/^rgb/)) {
//   var a = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/),
//     r = a[1],
//     g = a[2],
//     b = a[3];
// }
// var hsp = Math.sqrt(
//   0.299 * (r * r) +
//   0.587 * (g * g) +
//   0.114 * (b * b)
// );
// if (hsp > 127.5) {
//   $(selector).addClass('dark-color-for-text');
// } else {
//   $(selector).addClass('light-color-for-text');
// }
// };

// setTimeout(function () {
//     var hour = new Date().getHours();

//     if (hour > 16) {
//         document.getElementById("status").innerHTML = "Good evening. Press d to toggle the dark theme.";
//         document.body.classList.toggle("dark-mode");
//         document.getElementById("dark-toggle").checked = true;
//     } else {
//         if (hour > 11) {
//             document.getElementById("status").innerHTML = "Good afternoon. Press d to toggle the dark theme.";
//         }
//         else {
//             if (hour < 6) {
//                 document.getElementById("status").innerHTML = "Late night! Press d to toggle the dark theme.";
//                 document.body.classList.toggle("dark-mode");
//                 document.getElementById("dark-toggle").checked = true;
//             }
//             else {
//                 document.getElementById("status").innerHTML = "Good morning. Press d to toggle the dark theme.";
//             }
//         }
//     }


// }, 0);

// setTimeout(function () {
//     document.getElementById("assistant").style.display = "block";

// }, 0);


// setTimeout(function () { document.getElementById("assistant").style.display = "none"; }, 0);




// function manual_dark() {
//     document.body.classList.toggle("dark-mode");
//     if (document.getElementById("dark-toggle").checked == false) {
//         document.getElementById("status").innerHTML = "You have turned off dark theme.";
//         if (document.getElementById("showSettings").checked == true) {
//             document.getElementById("settings_on").style.border = "3px solid #000";
//         }
//     } else {
//         document.getElementById("status").innerHTML = "Oh wow. You have turned on dark theme.";
//         if (document.getElementById("showSettings").checked == true) {
//             document.getElementById("settings_on").style.border = "3px solid #fff";
//         }
//     }
// }





//  function yourFunction(){
//     // do whatever you like here
//     if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
//         // dark mode
//         document.body.classList.add('dark');
//         console.log("User prefers a dark interface");
//     } else {
//         document.body.classList.add('light');
//         console.log("User prefers a light interface");
//     }

//     // setTimeout(yourFunction, 5000);
// }

// yourFunction();


// var prevScrollpos = window.pageYOffset;
// var prevScrollpos = window.document.getElementById("main_pageScroll").scrollTop;


// const scroller = document.querySelector("#main_pageScroll");
// const scroller = document.querySelector("#main_pageScroll-body");


// fetch('http://worldtimeapi.org/api/timezone/UTC')
//   .then(response => response.json())
//   .then(data => {
//     console.log(data);
//     // Extract the time from the API response
//     let time = data.datetime;
//     // Display the time on the HTML page
//     document.getElementById("time").innerHTML = time;
//   });


let select = document.getElementById("timezone-select");
select.addEventListener("change", function () {
  let selectedTimezone = select.value;
  console.log("Selected timezone: " + selectedTimezone);
  // you can use the selectedTimezone variable to set the timezone for your application
});




// // window.onload = function() {
// fetch('http://worldtimeapi.org/api/timezone/Asia/Kolkata')
//   .then(response => response.json())
//   .then(data => {
//     console.log(data);
//     // Extract the time from the API response
//     let time = data.datetime;
//     // Display the time on the HTML page
//     // document.getElementById("time").innerHTML = time;

//   });
// // }



// const outputhEight = document.querySelector("#outputhEight");
var prevScrollpos = 0;
// var prevScrollpos = scroller.scrollTop;

// document.getElementById("main_pageScroll").addEventListener("scroll", event => {
// document.getElementById("main_pageScroll-body").addEventListener("scroll", event => {
// outputhEight.textContent = "scrollTop: " + scroller.scrollTop;

// var currentScrollPos = scroller.scrollTop;
// var currentScrollPos = window.pageYOffset;
// var currentScrollPos = document.getElementById("main_pageScroll").scrollTop();



// var prevScrollpos = window.pageYOffset;
// document.getElementById("viewport").style.height = "calc(100vh - 100px - 40px - 60px - 100px - 40px)";
window.onscroll = function () {
  var currentScrollPos = window.pageYOffset;

  if (prevScrollpos > currentScrollPos) {
    // while scrolling towards the top of the webpage
    document.getElementsByTagName("header")[0].style.top = "0";

    // document.getElementById("nav").style.top = "60px";


   
    // document.getElementById("viewport").style.height = "calc(100vh - 100px - 40px - 60px - 100px - 40px)";

    document.getElementById("smallNotiText").innerText = "Scrolling up.";

    // setTimeout(function () {
    document.getElementById("smallNotiText").innerText = "Use the search box to search things.";
    // }, 001);

    // document.getElementById("viewPort").style.transitionDuration = "500ms";
    // document.getElementsByTagName("header")[0].style.transitionDuration = "500ms";

    // document.getElementById("smallNotification").style.bottom = "calc( 0px)";

    // turn this on later
    // document.getElementById("main_pageScroll").style.height = "calc(100vh - 60px)";
    // document.getElementById("main_pageScroll").style.marginTop = "60px";
    // document.getElementById("main_pageScroll").style.transitionDuration = "500ms";





    // document.getElementsByClassName("branding")[0].style.display = "none";

    // if (showSettings == true) {
    // document.getElementById("assistant").style.display = "block";
    // }

    // if (document.getElementById("dark-toggle").checked == false) {
    //   document.getElementById("status").innerHTML = "Dark theme was turned off.";
    // } else {
    //   document.getElementById("status").innerHTML = "Dark theme was turned on.";
    // }

    // document.getElementById("viewPort").style.height = "calc(80px)";
    // document.getElementById("viewPort").style.width = "calc(600px)";

    setTimeout(function () {
      // document.getElementById("viewPort").style.height = "calc(400px)";
      // document.getElementById("viewPort").style.width = "calc(600px)";
    }, 50);

  } else {

    if (currentScrollPos > 60) {
      // while scrolling towards the bottom of the webpage
      
       document.getElementsByTagName("header")[0].style.top = "-60px";
      // document.getElementById("main_pageScroll").style.height = "calc(100vh - 0px)";
      // document.getElementById("main_pageScroll").style.marginTop = "0px";
      // document.getElementById("main_pageScroll").style.transitionDuration = "500ms";

      // document.getElementById("nav").style.top = "0px";
     
      // document.getElementById("viewport").style.height = "calc(100vh - 80px - 60px - 100px - 40px)";

      // document.getElementById("viewPort").style.transitionDuration = "500ms";

      // document.getElementById("viewPort").style.height = "calc(80px)";
      // document.getElementById("viewPort").style.width = "calc(600px)";

      setTimeout(function () {
        // document.getElementById("viewPort").style.height = "calc(400px)";
        // document.getElementById("viewPort").style.width = "calc(600px)";
      }, 50);

      document.getElementById("smallNotiText").innerText = "Scrolling down.";

      if (clickedArticle == 0) {
        setTimeout(function () {
          document.getElementById("smallNotiText").innerText = "Place cursor over any tile and see!";

        }, 0);
      }
      else {
        setTimeout(function () {
          document.getElementById("smallNotiText").innerText = "Use tabs on the above box to switch between things.";

        }, 1);

      }




      // document.getElementById("smallNotification").style.bottom = "calc( -100px)";

      // document.getElementById("viewPort").style.transitionDuration = "500ms";
      // document.getElementsByTagName("header")[0].style.transitionDuration = "500ms";


      //   document.getElementById("assistant").style.top = "0";
      // document.getElementById("assistant").style.display = "none";
      //   document.getElementsByClassName("branding")[0].style.top = "0";
      //   document.getElementsByClassName("branding")[0].style.display = "block";

      //   if (document.getElementById("dark-toggle").checked == false) {
      //     document.getElementById("status").innerHTML = "Dark theme was turned on off.";
      //   } else {
      //     document.getElementById("status").innerHTML = "Dark theme was turned on.";
      //   }
    }
  }
  prevScrollpos = currentScrollPos;

};

var internetConnection = true;
function hasNetwork(online) {
  internetConnection = online;
  const element = document.querySelector(".status");
  const element2 = document.querySelector(".status2");
  const element3 = document.querySelector(".status25");
  // Update the DOM to reflect the current status
  if (online) {
    element.classList.remove("offline");
    element.classList.add("online");
    // element.innerText = "Online";

    element2.innerText = "nline";

    document.getElementById("offlineAlert").style.display = "none";



  } else {
    element.classList.remove("online");
    element.classList.add("offline");
    // element.innerText = "Offline";

    document.getElementById("offlineAlert").style.display = "block";


    document.getElementById("offlineAlert").classList.toggle("slide_from_above");

    setTimeout(function () {
      document.getElementById("offlineAlert").classList.toggle("slide_from_above");
    }, 500);


    document.getElementById("alertUI").style.display = "none";


    element3.innerText = ""; // slow use sl
    element2.innerText = "ffline"; // wer internet
  }

}

window.addEventListener("load", () => {
  hasNetwork(navigator.onLine);

  window.addEventListener("online", () => {
    // Set hasNetwork to online when they change to online.
    hasNetwork(true);
  });

  window.addEventListener("offline", () => {
    // Set hasNetwork to offline when they change to offline.
    hasNetwork(false);
  });
});

// document.getElementById("main").classList.toggle("main_animate");
// document.getElementById("viewPort").classList.toggle("aside_animate");
// const modal = document.querySelector("[data-modal]");
function alertUI(show) {

  if (

    // internetConnection
    1
    && show) {

    document.getElementById("alertUI").style.display = "block";

    // modal.showModal();

    document.getElementById("alertUI").classList.toggle("slide_from_above");
    document.getElementById("blurFocusScreen").style.display = "block";
    document.getElementById("blurFocusScreen").style.zIndex = "5";

    setTimeout(function () {
      document.getElementById("alertUI").classList.toggle("slide_from_above");
    }, 500);

    document.getElementById("alertUser").innerText = "Wanna change color theme?";
    document.getElementById("themeDescription").style.display = "block";
  } else {
    document.getElementById("alertUI").classList.toggle("close_slide_down");
    document.getElementById("blurFocusScreen").style.display = "none";
    document.getElementById("blurFocusScreen").style.zIndex = "5";
    setTimeout(function () {
      document.getElementById("alertUI").classList.toggle("close_slide_down");
      document.getElementById("alertUI").style.display = "none";
    }, 500);
  }
}

function offlineAlertUI(show) {

  if (internetConnection && show) {

    document.getElementById("offlineAlert").style.display = "block";
    document.getElementById("offlineAlert").classList.toggle("slide_from_above");

    setTimeout(function () {
      document.getElementById("offlineAlert").classList.toggle("slide_from_above");
    }, 500);

    document.getElementById("themeDescription").style.display = "block";
  } else {

    document.getElementById("offlineAlert").classList.toggle("close_slide_down");
    setTimeout(function () {
      document.getElementById("offlineAlert").classList.toggle("close_slide_down");
      document.getElementById("offlineAlert").style.display = "none";
    }, 500);
  }
}





var counter = 0;
var i = setInterval(function () {

  if (counter % 2 == 0) {
    document.getElementById("online_what").innerText = "portfolio";
    document.getElementById("online_what_was").innerText = "résumé";
    document.getElementById("online_what_was").style.display = "block";

    document.getElementById("online_what").classList.toggle("come_from_bottom");
    document.getElementById("online_what_was").classList.toggle("go_up");

    setTimeout(function () {
      document.getElementById("online_what").classList.toggle("come_from_bottom");
      document.getElementById("online_what_was").classList.toggle("go_up");
      document.getElementById("online_what_was").style.display = "none";
    }, 1000);

  }

  else {
    document.getElementById("online_what").innerText = "résumé";
    document.getElementById("online_what_was").innerText = "portfolio";
    document.getElementById("online_what_was").style.display = "block";


    document.getElementById("online_what").classList.toggle("come_from_bottom");
    document.getElementById("online_what_was").classList.toggle("go_up");


    setTimeout(function () {
      document.getElementById("online_what").classList.toggle("come_from_bottom");
      document.getElementById("online_what_was").classList.toggle("go_up");
      document.getElementById("online_what_was").style.display = "none";
    }, 1000);
  }


  counter++;
  if (counter === Math.pow(2, 50)) {
    clearInterval(i);
  }
}, 5000);


// document.getElementById("splashScreen").innerText = "Loading";
// document.getElementById("my_age_in_year").innerText = year - 1999;
// document.getElementById("JSregulated74545").style.display = "inline";
document.getElementById("JSregulated74545").style.display = "none";


// document.getElementById("main_pageScroll-off").style.display = "none";





// Simulate a mouse click:
// window.location.href = "/index.html";

// Simulate an HTTP redirect:
// window.location.replace("/index.html");


document.addEventListener("DOMContentLoaded", function () {


  const splashScreen = document.getElementById("splash-screen");

  // setTimeout(function () {
  //   document.getElementsByClassName("spinner")[0].classList.add("loaded");
  // }, 0000);

  // setTimeout(function () {
  splashScreen.style.display = "none";
  

  setTimeout(function () {
    document.getElementById("web-page").style.display = "block";
  }, 100);

  // }, 1);
});


setTimeout(function () {
  // document.getElementById("splashScreen").style.display = "none";
  document.getElementById("header_message").style.display = "none";
  document.getElementById("header_message2").style.display = "none";
}, 0);

var cursorBlurEffect = document.getElementById("cursor-effect");

function findCoords(event) {

  // document.getElementById("background-music").play();
  // document.getElementById("background-music").volume = 0.005;

  var x = event.clientX;
  var y = event.clientY;
  // var coor = "X coords: " + x + ", Y coords: " + y;
  // document.getElementById("demo").innerHTML = coor;

  var xPXnum = x - 300;
  var yPXnum = y - 300;

  var xPX = xPXnum + "px";
  var yPX = yPXnum + "px";

  cursorBlurEffect.style.top = yPX;
  cursorBlurEffect.style.left = xPX;

}


// text color decider 

const closeTabText = document.getElementsByClassName("tab_close");

for (let i = 0; i < closeTabText.length; i++) {

  closeTabText[i].innerHTML = "close";

}



// Get the div element with id "tab_bar"
var tab_bar = document.getElementById("tab_bar90");

// Define a function to scroll horizontally by a given amount
function scrollHorizontally(amount) {
  // Get the current scroll position
  var scrollLeft = tab_bar.scrollLeft;

  // Add the amount to the scroll position
  scrollLeft += amount;

  // Set the new scroll position
  tab_bar.scrollLeft = scrollLeft;
}

// Define a function to handle the mouse wheel event
function handleMouseWheel(e) {
  // Get the wheel delta (positive for up, negative for down)
  var delta = e.wheelDelta || -e.detail;

  // Multiply the delta by a factor to adjust the scrolling speed
  var scrollAmount = delta * -0.1;

  // Call the scroll function with the scroll amount
  scrollHorizontally(scrollAmount);

  // Prevent the default behavior of scrolling vertically
  e.preventDefault();
}

// Add an event listener for the mouse wheel event
if (tab_bar.addEventListener) {
  // For modern browsers
  tab_bar.addEventListener("mousewheel", handleMouseWheel, false);
  tab_bar.addEventListener("DOMMouseScroll", handleMouseWheel, false);
} else {
  // For IE 6/7/8
  tab_bar.attachEvent("onmousewheel", handleMouseWheel);
}
