
console.log("This is search.");


let searchBar = document.getElementById('search_bar');
let searchButton = document.getElementById('search_button_action');

searchButton.addEventListener('click', function () {

// if (searchBar.value.length

// searchBar.addEventListener('oninput', function () {

    // Get the text of the search query.
    let searchQuery = searchBar.value;

    document.getElementById('searchQuery').innerText = searchQuery;

    // For each article on the page, check if the article contains the search query.
    let articles = document.querySelectorAll('article');
    for (let article of articles) {
        // Check if the article contains the search query in the title, body, or any of the tags.
        let articleText = article.textContent;
        let articleTags = article.querySelectorAll('*');
        let articleTagsText = '';
        for (let tag of articleTags) {
            articleTagsText += tag.textContent;
        }

        // If the article does not contain the search query, hide the article.
        if (!articleText.includes(searchQuery) && !articleTagsText.includes(searchQuery)) {
            article.style.display = 'none';
            console.log("If the article does not contain the search query, hide the article.");

        } else {
            // If the article does contain the search query, display the article.
            article.style.display = 'block';
            console.log("If the article does contain the search query, display the article.");
        }
    }

    document.getElementById('search_result_section').style.display = 'block';
    document.getElementById('cubeSection').style.display = 'none';
    document.getElementById('banner').style.display = 'none';




});

document.getElementById('search_result_section').style.display = 'none';