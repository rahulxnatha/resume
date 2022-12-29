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
const outputhEight = document.querySelector("#outputhEight");
var prevScrollpos = 0;
// var prevScrollpos = scroller.scrollTop;

// document.getElementById("main_pageScroll").addEventListener("scroll", event => {
// document.getElementById("main_pageScroll-body").addEventListener("scroll", event => {
// outputhEight.textContent = "scrollTop: " + scroller.scrollTop;

// var currentScrollPos = scroller.scrollTop;
// var currentScrollPos = window.pageYOffset;
// var currentScrollPos = document.getElementById("main_pageScroll").scrollTop();



// var prevScrollpos = window.pageYOffset;
document.getElementById("viewport").style.height = "calc(100vh - 100px - 40px - 60px - 100px - 40px)";
window.onscroll = function () {
  var currentScrollPos = window.pageYOffset;

  if (prevScrollpos > currentScrollPos) {
    // while scrolling towards the top of the webpage
    document.getElementsByTagName("header")[0].style.top = "0";

    // document.getElementById("nav").style.top = "60px";
    document.getElementById("viewPort").style.top = "60px";
    document.getElementById("viewPort").style.height = "calc(100vh - 100px - 100px)";
    document.getElementById("viewport").style.height = "calc(100vh - 100px - 40px - 60px - 100px - 40px)";

    document.getElementById("smallNotiText").innerText = "Scrolling up.";

    setTimeout(function () {
      document.getElementById("smallNotiText").innerText = "Use the search box to search things.";
    }, 000);

    document.getElementById("viewport").style.transitionDuration = "500ms";
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

  } else {

    if (currentScrollPos > 60) {
      // while scrolling towards the bottom of the webpage
      document.getElementsByTagName("header")[0].style.top = "-60px";
      // document.getElementById("main_pageScroll").style.height = "calc(100vh - 0px)";
      // document.getElementById("main_pageScroll").style.marginTop = "0px";
      // document.getElementById("main_pageScroll").style.transitionDuration = "500ms";

      // document.getElementById("nav").style.top = "0px";
      document.getElementById("viewPort").style.top = "0px";
      document.getElementById("viewPort").style.height = "calc(100vh - 40px - 100px)";
      document.getElementById("viewport").style.height = "calc(100vh - 80px - 60px - 100px - 40px)";


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

function alertUI(show) {

  if (

    // internetConnection
    1
    && show) {

    document.getElementById("alertUI").style.display = "block";
    document.getElementById("alertUI").classList.toggle("slide_from_above");

    setTimeout(function () {
      document.getElementById("alertUI").classList.toggle("slide_from_above");
    }, 500);

    document.getElementById("alertUser").innerText = "Wanna change color theme?";
    document.getElementById("themeDescription").style.display = "block";
  } else {
    document.getElementById("alertUI").classList.toggle("close_slide_down");
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
document.getElementById("JSregulated74545").style.display = "inline";


// document.getElementById("main_pageScroll-off").style.display = "none";





// Simulate a mouse click:
// window.location.href = "/index.html";

// Simulate an HTTP redirect:
// window.location.replace("/index.html");




setTimeout(function () {
  document.getElementById("splashScreen").style.display = "none";
  // document.getElementById("header_message").style.display = "none";
}, 0);


setTimeout(function () {
  // document.getElementById("splashScreen").style.display = "none";
  document.getElementById("header_message").style.display = "none";
  document.getElementById("header_message2").style.display = "none";
}, 0);

var cursorBlurEffect = document.getElementById("cursorBlurEffect");

function findCoords(event) {
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





