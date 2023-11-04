// Get references to DOM elements
const searchBar = document.getElementById('search_bar');
const searchButton = document.getElementById('search_button_action');
const resultsSection = document.getElementById('search_result_section');
const searchQueryElement = document.getElementById('searchQuery');
const resultsCountElement = document.getElementById('results_count');
const showingSearchResultsElement = document.getElementById('showing_search_results');
const whetherShowingSearchResultsElement = document.getElementById('whether_showing_search_results');

// Add event listener for the search button click
searchButton.addEventListener('click', function () {
    // Get the search query from the input field
    const searchQuery = searchBar.value.trim();
    
    // Update the displayed search query
    searchQueryElement.innerText = searchQuery;

    // Split the search query into individual words
    const filteredWords = searchQuery.split(' ').filter(word => word !== '');

    // Get all articles on the page
    const articles = document.querySelectorAll('article');
    let articleNumbers = [];

    // Loop through each article
    articles.forEach((article, index) => {
        const articleText = article.textContent.toLowerCase();
        const articleTagsText = article.querySelectorAll('*').map(tag => tag.textContent.toLowerCase()).join('');

        // Check if all filtered words are present in the article text or tags
        const allWordsMatch = filteredWords.every(word => 
            articleText.includes(word.toLowerCase()) || articleTagsText.includes(word.toLowerCase())
        );

        // If all words match, add the article number to the array
        if (allWordsMatch) {
            articleNumbers.push(index);
        }
    });

    // Update the results count
    resultsCountElement.innerText = articleNumbers.length;

    // Show/hide the "No results" message based on the count
    if (articleNumbers.length < 1) {
        showingSearchResultsElement.style.display = 'block';
        showingSearchResultsElement.innerText = "Can you please check the search query for typos or use other keywords? I am unable to get any results with this query. I am still under development, but I hope to be able to answer this query in the future.";
        whetherShowingSearchResultsElement.innerText = "Sorry, can't show";
    } else {
        showingSearchResultsElement.style.display = 'none';
        whetherShowingSearchResultsElement.innerText = "Showing";
    }

    // Hide additional span elements
    const spanElements = document.querySelectorAll('main > section > span');
    spanElements.forEach((span, index) => {
        if (index >= 4) {
            span.style.display = 'none';
        }
    });

    // Display the results section
    resultsSection.style.display = 'block';

    console.log(articleNumbers); // Array of article numbers that match all filtered words
});

// Add event listener for Enter key press in the search input field
searchBar.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        searchButton.click(); // Trigger the search button click event
    }
});

// Hide the results section initially
resultsSection.style.display = 'none';
