const h1s = document.querySelectorAll("aside h1");


for (let i = 0; i < h1s.length; i++) {
  const h1 = h1s[i];
  const text = h1.textContent;
  if (text.length <= 15) {
    h1.style.fontSize = "5em";
  } else if (text.length >= 30) {
    h1.style.fontSize = "2em";
  } else {
    const fontSize = 5 - (text.length - 15) * (5 - 2) / (30 - 15);
    h1.style.fontSize = `${fontSize}em`;
  }
}

// This code will set the font size of all h1 tags inside an aside tag to 5em if the length of the text (characters) in the tag is less than or equal to 15, and linearly vary the font size from 5em to 2em when the length of the text increases from 15 to 30 characters.

function typewritingEffect(element, speed) {
  const text = element.textContent;
  let index = 0;

  const type = () => {
    if (index < text.length) {
      element.textContent = text.slice(0, ++index);
      setTimeout(type, speed);
    }
  };

  type();
}





// function typewritingEffect(element, interval) {
//     let index = 0;
//     let text = element.textContent;
//     let cursor = document.createElement("span");
//     cursor.innerHTML = "|";
//     cursor.style.animation = "blink 1s step-end infinite";
//     cursor.style.userSelect = "none";
//     cursor.style.marginLeft = "5px";
//     cursor.style.fontSize = element.style.fontSize;
//     element.textContent = "";
//     element.appendChild(cursor);

//     const type = () => {
//       if (index < text.length) {
//         element.innerHTML += text.charAt(index);
//         index++;
//         setTimeout(type, interval);
//       } else {
//         cursor.style.display = "none";
//       }
//     };
//     type();
//   }





const article_h1s = document.querySelectorAll(".typewrite, article h1");
// const body_p = document.querySelectorAll("body p");



document.addEventListener("DOMContentLoaded", function () {

  // setTimeout(function () {

  // }, 0000);

  setTimeout(function () {

    for (let i = 0; i < article_h1s.length; i++) {
      typewritingEffect(article_h1s[i], 100);
    }

    let intro_text = document.getElementById("intro-text");

    typewritingEffect(intro_text, 50);


  }, 0);
});


// rotation of the cube starts



// var isRotating = false;
// var startX, startY;
// var currentX = 0, currentY = 0;

// function startRotate(event) {
//   isRotating = true;
//   startX = event.clientX;
//   startY = event.clientY;
// }

// function stopRotate(event) {
//   isRotating = false;
// }

// function rotateCube(event) {
//   if (!isRotating) {
//     return;
//   }

//   var deltaX = event.clientX - startX;
//   var deltaY = event.clientY - startY;

//   currentX += deltaY;
//   currentY += deltaX;

//   var cube = document.querySelector('.cube');
//   cube.style.transform = 'rotateX(' + currentX + 'deg) rotateY(' + currentY + 'deg)';
// }

// function applyLighting() {
//     const lightX = 1;
//     const lightY = -1;
//     const lightZ = 1;
//     const ambientLight = 0.2;
//     const directionalLight = 0.8;
//     const lightDistance = Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2));
//     const faces = document.querySelectorAll('.face');


//     faces.forEach((face) => {
//       const faceBounds = face.getBoundingClientRect();
//       const faceCenterX = faceBounds.left + faceBounds.width / 2;
//       const faceCenterY = faceBounds.top + faceBounds.height / 2;
//       const vectorX = faceCenterX - window.innerWidth;
//       const vectorY = faceCenterY;
//       const vectorZ = lightDistance;
//       const distance = Math.sqrt(Math.pow(vectorX, 2) + Math.pow(vectorY, 2) + Math.pow(vectorZ, 2));
//       const dotProduct = (vectorX * lightX + vectorY * lightY + vectorZ * lightZ) / distance;
//       const lightIntensity = ambientLight + Math.max(0, dotProduct) * directionalLight;
//       face.style.background = `rgba(255, 255, 255, ${lightIntensity})`;
//     });
//   }


// one of the codes
// --------------------------------

// var isDragging = false;
// var lastX, lastY;

// document.getElementById("cube").addEventListener("mousedown", function(e) {
//   if (e.button === 1) {
//     isDragging = true;
//     lastX = e.clientX;
//     lastY = e.clientY;
//   }
// });

// document.addEventListener("mousemove", function(e) {
//   if (isDragging) {
//     var deltaX = e.clientX - lastX;
//     var deltaY = e.clientY - lastY;

//     var rotationX = "rotateX(" + deltaY + "deg)";
//     var rotationY = "rotateY(" + deltaX + "deg)";

//     document.getElementById("cube").style.transform = rotationX + " " + rotationY;
//   }

//   lastX = e.clientX;
//   lastY = e.clientY;
// });

// document.addEventListener("mouseup", function(e) {
//   isDragging = false;
// });

// document.addEventListener("wheel", function(e) {
//   e.preventDefault();

//   var scale = "scale(" + (e.deltaY > 0 ? 0.9 : 1.1) + ")";

//   document.getElementById("cube").style.transform += " " + scale;
// });

// document.getElementById("cube").addEventListener("mousedown", function(e) {
//   if (e.button === 0 || e.button === 2) {
//     e.preventDefault();
//   }
// });




// new one 
//----------------------------------------

// var isDragging = false;
// var lastX, lastY;

// var myDiv = document.getElementById("cube");

// myDiv.addEventListener("mousedown", function(e) {
//   if (e.button === 1 && myDiv.matches(":hover")) {
//     isDragging = true;
//     lastX = e.clientX;
//     lastY = e.clientY;
//   }
// });

// document.addEventListener("mousemove", function(e) {
//   if (isDragging && myDiv.matches(":hover")) {
//     var deltaX = e.clientX - lastX;
//     var deltaY = e.clientY - lastY;

//     var rotationX = "rotateX(" + deltaY + "deg)";
//     var rotationY = "rotateY(" + deltaX + "deg)";

//     myDiv.style.transform = rotationX + " " + rotationY;
//   }

//   lastX = e.clientX;
//   lastY = e.clientY;
// });

// document.addEventListener("mouseup", function(e) {
//   isDragging = false;
// });

// document.addEventListener("wheel", function(e) {
//   if (myDiv.matches(":hover")) {
//     e.preventDefault();

//     var scale = "scale(" + (e.deltaY > 0 ? 0.9 : 1.1) + ")";

//     myDiv.style.transform += " " + scale;
//   }
// });

// myDiv.addEventListener("mouseenter", function(e) {
//   myDiv.style.transition = "transform 0.5s ease-out";
// });

// myDiv.addEventListener("mouseleave", function(e) {
//   myDiv.style.transition = "";
// });



//another new one

// var isDragging = false;
// var lastX, lastY;

// var myDiv = document.getElementById("cube");

// myDiv.addEventListener("mousedown", function(e) {
//   if (e.button === 1) {
//     e.preventDefault();
//     isDragging = true;
//     lastX = e.clientX;
//     lastY = e.clientY;
//   }
// });

// document.addEventListener("mousemove", function(e) {
//   if (isDragging) {
//     var deltaX = e.clientX - lastX;
//     var deltaY = e.clientY - lastY;

//     var rotationX = "rotateX(" + deltaY + "deg)";
//     var rotationY = "rotateY(" + deltaX + "deg)";

//     myDiv.style.transform = rotationX + " " + rotationY;
//   }

//   lastX = e.clientX;
//   lastY = e.clientY;
// });

// document.addEventListener("mouseup", function(e) {
//   isDragging = false;
// });

// myDiv.addEventListener("wheel", function(e) {
//   e.preventDefault();

//   var scale = "scale(" + (e.deltaY > 0 ? 0.9 : 1.1) + ")";

//   myDiv.style.transform += " " + scale;
// });


//new --- 


// var isDragging = false;
// var lastX, lastY;
// var currentX = 0;
// var currentY = 0;
// var targetX = 0;
// var targetY = 0;
// var easing = 0.1;

// var myDiv = document.getElementById("cube");

// myDiv.addEventListener("mousedown", function(e) {
//   if (e.button === 1) {
//     e.preventDefault();
//     isDragging = true;
//     lastX = e.clientX;
//     lastY = e.clientY;
//   }
// });

// document.addEventListener("mousemove", function(e) {
//   if (isDragging) {
//     var deltaX = e.clientX - lastX;
//     var deltaY = e.clientY - lastY;

//     targetY += deltaY;
//     targetX += deltaX;
//   }

//   lastX = e.clientX;
//   lastY = e.clientY;
// });

// document.addEventListener("mouseup", function(e) {
//   isDragging = false;
// });

// myDiv.addEventListener("wheel", function(e) {
//   e.preventDefault();

//   var scale = "scale(" + (e.deltaY > 0 ? 0.9 : 1.1) + ")";

//   myDiv.style.transform += " " + scale;
// });

// function updateRotation() {
//   currentX += (targetX - currentX) * easing;
//   currentY += (targetY - currentY) * easing;

//   var rotationX = "rotateX(" + currentY + "deg)";
//   var rotationY = "rotateY(" + currentX + "deg)";

//   myDiv.style.transform = rotationX + " " + rotationY;

//   requestAnimationFrame(updateRotation);
// }

// requestAnimationFrame(updateRotation);



























// new ----------------
var isDragging = false;
var lastX, lastY;
var currentX = 0;
var currentY = 0;
var targetX = 0;
var targetY = 0;
var easing = 0.1;
var clicked_face_of_cube = 0;
var face = "none";

var myDiv = document.getElementById("rotate-scale-cube");
const cube = document.getElementById("rotate-scale-cube");

var myDivFront = document.getElementById("rotate-scale-cube-front");
var myDivBack = document.getElementById("rotate-scale-cube-back");
var myDivRight = document.getElementById("rotate-scale-cube-right");
var myDivLeft = document.getElementById("rotate-scale-cube-left");
var myDivBottom = document.getElementById("rotate-scale-cube-bottom");
var myDivTop = document.getElementById("rotate-scale-cube-top");



myDiv.addEventListener("mousedown", function (e) {
  if (e.button === 1) {
    e.preventDefault();
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;

  } clicked_face_of_cube = 0;

});

document.addEventListener("mousemove", function (e) {
  if (isDragging) {
    var deltaX = e.clientX - lastX;
    var deltaY = e.clientY - lastY;

    targetY += deltaY;
    targetX += deltaX;

    clicked_face_of_cube = 0;
  }

  lastX = e.clientX;
  lastY = e.clientY;

  clicked_face_of_cube = 0;
});

document.addEventListener("mouseup", function (e) {
  isDragging = false;

  clicked_face_of_cube = 0;
});

// myDiv.addEventListener("wheel", function (e) {
//   e.preventDefault();

//   // if (e.target === myDiv) {
//     var scale = "scale(" + (e.deltaY > 0 ? 0.9 : 1.1) + ")";
//     myDiv.style.transform += " " + scale;
//     console.log("Hi");

//   // }
// });


var scale = "scale(" + 1 + ")";
scale_level = 1;
var widthNum = 200;
var width = 200;

function updateScale() {
  cube.addEventListener("wheel", function (e) {
    e.preventDefault();

    // if (e.target === cube) {

    // scale = "scale(" + (e.deltaY > 0 ? 0.6 : 1.4) + ")";
    // myDiv.style.transform += " " + scale;
    // console.log("Hi");


    // const scaleAmount = e.deltaY > 0 ? scale_level -= 0.0001 : scale_level+= 0.0001;
    const scaleAmount = 1;


    widthNum = e.deltaY > 0 ? widthNum -= 0.01 : widthNum += 0.01;


    const myElement = document.querySelector('.cube');
    myElement.style.width  = (e.deltaY > 0 ? width -= 0.01 : width += 0.01).toString() + "px";
    myElement.style.height = (e.deltaY > 0 ? width -= 0.01 : width += 0.01).toString() + "px";


    // const currentTransform = cube.style.transform;
    // const currentScale = currentTransform.match(/scale\(([^\)]+)\)/);
    // scale = currentScale ? `scale(${currentScale[1]})` : '';

    // scale = currentTransform ? `${currentTransform} scale(${scaleAmount})` : `scale(${scaleAmount})`;



    scale = `scale(${scaleAmount})`;


    // scale = currentScale ? `scale(${scaleAmount})` : `scale(${scaleAmount})`;
    // cube.style.transform = newTransform;



    // }
  });
}

function updateRotation() {

  if (clicked_face_of_cube == 1 && face == "front") {

  } else {

    currentX += (targetX - currentX) * easing;
    currentY += (targetY - currentY) * easing;

    var rotationX = "rotateX(" + currentY + "deg)";
    var rotationY = "rotateY(" + currentX + "deg)";

    myDiv.style.transform = rotationX + " " + rotationY;



    var cube_edge_upon_2 = (widthNum / 2).toString() + "px";
    var minus_cube_edge_upon_2 = (-widthNum / 2).toString() + "px";

    myDivFront.style.transform = "translateZ(" + cube_edge_upon_2 + ")";
    myDivBack.style.transform = "translateZ(" + minus_cube_edge_upon_2 + ") rotateY(180deg)";
    myDivRight.style.transform = "translateX(" + cube_edge_upon_2 + ") rotateY(90deg)";

    myDivLeft.style.transform = "translateX(" + minus_cube_edge_upon_2 + ") rotateY(-90deg)";


    myDivBottom.style.transform = "translateY(" + cube_edge_upon_2 + ") rotateX(-90deg)";
    myDivTop.style.transform = "translateY(" + minus_cube_edge_upon_2 + ") rotateX(90deg)";






    requestAnimationFrame(updateRotation);
    // requestAnimationFrame(updateScale);
  }
}




document.getElementById("rotate-scale-cube-front").addEventListener("click", function (e) {
  myDiv.style.transform = "rotateX(0deg) rotateY(0deg) rotateZ(0deg)";

  clicked_face_of_cube = 1;

  setTimeout(function () {
    clicked_face_of_cube = 0;
    call_rotation_again();
  }, 1000);

  face = "front";
});


document.getElementById("rotate-scale-cube-back").addEventListener("click", function (e) {
  myDiv.style.transform = "rotateX(0deg) rotateY(0deg) rotateZ(0deg)";

  clicked_face_of_cube = 1;

  setTimeout(function () {
    clicked_face_of_cube = 0;
    call_rotation_again();
  }, 1000);

  face = "back";
});


document.getElementById("rotate-scale-cube-right").addEventListener("click", function (e) {
  clicked_face_of_cube = 1;
  face = "right";
});
document.getElementById("rotate-scale-cube-left").addEventListener("click", function (e) {
  clicked_face_of_cube = 1;
  face = "left";
});
document.getElementById("rotate-scale-cube-top").addEventListener("click", function (e) {
  clicked_face_of_cube = 1;
  face = "top";
});
document.getElementById("rotate-scale-cube-bottom").addEventListener("click", function (e) {
  clicked_face_of_cube = 1;
  face = "bottom";
});


if (clicked_face_of_cube == 0) {

  requestAnimationFrame(updateRotation);
}

function call_rotation_again() {
  requestAnimationFrame(updateRotation);
}










