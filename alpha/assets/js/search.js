
let searchBar = document.getElementById('search_bar');
let searchButton = document.getElementById('search_button_action');

searchButton.addEventListener('click', function search() {

    // Get the text of the search query.
    let searchQuery = searchBar.value;

    document.getElementById('searchQuery').innerText = searchQuery;

    // For each article on the page, check if the article contains the search query.
    let articles = document.querySelectorAll('article');
    let article_remove_count = 0;
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
            article_remove_count++;
            console.log("If the article does not contain the search query, hide the article.");

        } else {
            // If the article does contain the search query, display the article.
            article.style.display = 'block';
            console.log("If the article does contain the search query, display the article.");
        }
    }



    document.getElementById('cubeSection').style.display = 'none';
    document.getElementById('banner').style.display = 'none';

    document.getElementById('results_count').innerText = document.querySelector('body').getElementsByTagName('article').length - article_remove_count;

    if (document.querySelector('body').getElementsByTagName('article').length - article_remove_count < 1) {
        document.getElementById('showing_search_results').style.display = "block";
        document.getElementById('showing_search_results').innerText = "Can you please check the search query for typos or use other keywords? I am unable to get any results with this query. I am still under development, but I hope to be able to answer this query in the future.";
        document.getElementById('whether_showing_search_results').innerText = "Sorry, can't show";

    }

    let spanElements = document.querySelectorAll('main > section > span');

    for (let i = 4; i < spanElements.length; i++) {
        spanElements[i].style.display = 'none';
        console.log(i);
    }

    document.getElementById('search_result_section').style.display = 'block';
});


// let searchBar = document.getElementById('search_bar');
searchBar.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        // Submit the search form.
        // document.getElementById('search_form').submit();
        document.getElementById('search_button_action').click();
    }
});

document.getElementById('search_result_section').style.display = 'none';


// Array.from(document.querySelectorAll('main section span')).style.display = 'none';
