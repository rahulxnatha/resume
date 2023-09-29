
var searchBar = document.getElementById('search_bar');
let searchButton = document.getElementById('search_button_action');



searchButton.addEventListener('click', function search() {

    // Get the text of the search query.
    var searchQuery = searchBar.value;
    document.getElementById('searchQuery').innerText = searchQuery;

    function extractKeyword(sentence) {
        const keywords = {
            // study: [],
            education: ['education', 'educational', 'qualifications', 'qualification', 'school', 'study', 'studied', 'studying'],
            work: ['experience', 'work', 'internship', 'job', 'corporate', 'company', 'sector', 'profession', 'field'],
            course: ['passion', 'course', 'coursera', 'LinkedIn Learning'],
            are_you_stupid: ['stupid', 'dumb', 'idiot', 'mean']

            // Add more keywords and corresponding mappings as needed
        };

        // Convert the sentence to lowercase for case-insensitive matching
        const lowerCaseSentence = sentence.toLowerCase();

        // Iterate through the keywords and check if any of them appear in the sentence
        for (const keyword in keywords) {
            if (keywords[keyword].some(key => lowerCaseSentence.includes(key))) {
                return keyword;
            }
        }

        // Return a default value if no keyword is found
        return 'not found';
    }


    // Split the sentence into an array of words.
    let words = searchQuery.split(' ');

    // Remove any empty strings from the array.
    let filteredWords = words.filter(word => word !== '');

    // The filteredWords array now contains all of the words in the sentence.
    console.log(filteredWords);




    // For each article on the page, check if the article contains the search query.
    let articles = document.querySelectorAll('article');
    let article_remove_count = 0;


    for (let article of articles) {

        let articleText = article.textContent;
        let articleTags = article.querySelectorAll('*');
        let articleTagsText = '';
        for (let tag of articleTags) {
            articleTagsText += tag.textContent;
        }

        searchQuery = extractKeyword(searchQuery);

        if (!articleText.toLowerCase().includes(searchQuery.toLowerCase()) && !articleTagsText.toLowerCase().includes(searchQuery.toLowerCase())) {
            article.style.display = 'none';
            article_remove_count++;
            console.log("If the article does not contain the search query, hide the article.");

        } else {

            article.style.display = 'block';
            console.log("If the article does contain the search query, display the article.");
        }
    }

    document.getElementById('cubeSection').style.display = 'none';
    document.getElementById('banner').style.display = 'none';

    document.getElementById('results_count').innerText = document.querySelector('body').getElementsByTagName('article').length - article_remove_count;

    if (document.querySelector('body').getElementsByTagName('article').length - article_remove_count < 1 || searchQuery == "") {
        document.getElementById('showing_search_results').style.display = "block";
        document.getElementById('showing_search_results').innerText = "Can you please check the search query for typos or use other keywords? I am unable to get any results with this query. I am still under development, but I hope to be able to answer this query in the future.";
        document.getElementById('whether_showing_search_results').innerText = "Sorry, can't show";

    } else {
        document.getElementById('showing_search_results').style.display = "none";
        document.getElementById('whether_showing_search_results').innerText = "Showing";
    }

    let spanElements = document.querySelectorAll('main > section > span');

    for (let i = 4; i < spanElements.length; i++) {
        spanElements[i].style.display = 'none';
    }

    document.getElementById('search_result_section').style.display = 'block';



    let section1 = document.querySelector('#work_section');
    let section2 = document.querySelector('#edu_section');
    let section3 = document.querySelector('#skill_section');
    let section4 = document.querySelector('#project_section');
    let section5 = document.querySelector('#waste_section');

    // // Append the contents of the second section tag to the first section tag.
    // section1.appendChild(section2.childNodes);
    // section1.appendChild(section3.childNodes);
    // section1.appendChild(section4.childNodes);
    // section1.appendChild(section5.childNodes);

    // // Remove the second section tag from the DOM.
    // section2.parentNode.removeChild(section2);
    // section3.parentNode.removeChild(section3);
    // section4.parentNode.removeChild(section4);
    // section5.parentNode.removeChild(section5);


   



    // Get the HTML content of the two section tags.
    let section1HTML = section1.innerHTML;
    let section2HTML = section2.innerHTML;
    let section3HTML = section3.innerHTML;
    let section4HTML = section4.innerHTML;
    let section5HTML = section5.innerHTML;

    // Combine the HTML content of the two section tags into a single string.
    const combinedHTML = section1HTML + section2HTML + section3HTML + section4HTML + section5HTML;

    // Set the innerHTML property of the first section tag to the combined HTML string.
    section1.innerHTML = combinedHTML;

  // Remove the contents of the second section tag.
     section2.innerHTML = '';
     section3.innerHTML = '';
     section4.innerHTML = '';
     section5.innerHTML = '';

});

searchBar.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        document.getElementById('search_button_action').click();
    }
});

document.getElementById('search_result_section').style.display = 'none';
