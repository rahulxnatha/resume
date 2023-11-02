let paragraphs = document.querySelectorAll(".briefblock p");

for (let i = 0; i < paragraphs.length; i++) {
  let text = paragraphs[i].textContent;
  let words = text.split(" ");
  let modifiedText = "";

  for (let j = 0; j < words.length; j++) {
    let word = words[j];
    let firstVowelIndex = -1;
    let secondVowelIndex = -1;

    for (let k = 0; k < word.length; k++) {
      if (/[aeiouAEIOU]/.test(word[k])) {
        if (firstVowelIndex === -1) {
          firstVowelIndex = k;
        } else {
          secondVowelIndex = k;
          break;
        }
      }
    }

    if (firstVowelIndex === -1) {
      // No vowel found in the word
      modifiedText += word;
    } else if (secondVowelIndex === -1) {
      // Only one vowel found, apply original rule
      modifiedText += "<strong>" + word.slice(0, firstVowelIndex) + "</strong>" + word.slice(firstVowelIndex);
    } else {
      // Two vowels found, apply the exception rule
      modifiedText += "<strong>" + word.slice(0, secondVowelIndex) + "</strong>" + word.slice(secondVowelIndex);
    }

    if (j < words.length - 1) {
      modifiedText += " ";
    }
  }

  paragraphs[i].innerHTML = modifiedText;
}
