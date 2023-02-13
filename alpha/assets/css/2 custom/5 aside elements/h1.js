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

    setTimeout(function () {
        
    }, 0000);

    setTimeout(function () {

        for (let i = 0; i < article_h1s.length; i++) {
            typewritingEffect(article_h1s[i], 100);
        }

        let intro_text = document.getElementById("intro-text");
        
            typewritingEffect(intro_text, 50);
        

    }, 2000);
});




