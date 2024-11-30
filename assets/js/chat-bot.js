const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Synonyms and responses
const synonyms = {
    greetings: ["hello", "hi", "hey", "greetings", "what's up", "hallo"],
    identity: ["what is your name", "who are you", "tell me about yourself"],
    howAreYou: ["how are you", "how do you do"],
    help: ["help", "assist", "what can you do"],
    purpose: ["why are you", "your purpose", "what can you do"],
    about: ["Rahul", "about Rahul", "why Rahul", "who is Rahul"],
    skills: ["skill", "skills"],
    qualifications: ["qualifications"],
    theme: ["theme"],
    ok: ["kk", "ok", "okay", "alright", "awesome", "k"],
};

const responses = {
    greetings: "Hi there! How can I assist you today?",
    identity: "I am Rahul's chatbot, here to assist you with any questions you may have.",
    howAreYou: "I'm just a program, but thanks for asking!",
    help: "I can help answer questions about Rahul or assist you with general tasks. Just ask!",
    purpose: "I'm here to answer your questions and help with information on Rahul's website.",
    about: "Rahul is a technology enthusiast with a background in mechanical engineering. He built this chatbot!.",
    skills: "Take a look at the \"Skills\" section.",
    qualifications: ["Take a look at the menu bar."],
    unknown: "I'm sorry, I didn't quite understand that. Could you please clarify?",
    theme: ["Done."],
    ok: ["Okay."],
};


// Helper functions
function correctGrammar(input) {
    // Basic spelling corrections (expand this list for more accuracy)
    const corrections = {
        "helo": "hello", "wat": "what", "ur": "your", "heloo": "hello",
        "gud": "good", "pleas": "please", "thnks": "thanks"
    };
    return input.split(" ").map(word => corrections[word] || word).join(" ");
}

function parseInput(input) {
    input = correctGrammar(input.trim().toLowerCase());
    for (const category in synonyms) {
        if (synonyms[category].some(synonym => input.includes(synonym))) {
            return category;
        }
    }
    return "unknown";
}


// Function to check for matching input
// function checkInput(input) {
//     input = input.trim().toLowerCase();

//     for (const category in synonyms) {
//         for (const synonym of synonyms[category]) {
//             if (input.includes(synonym)) {
//                 return category;
//             }
//         }
//     }
//     return null;
// }

// Function to handle user input
function handleUserInput() {
    const input = userInput.value.trim();

    if (input) {
        addMessage(input, 'user');
        userInput.value = '';


    }

    setTimeout(function () {
        if (input) {
            const parsedCategory = parseInput(input);
            const botResponse = responses[parsedCategory] || responses.unknown;
            addMessage(botResponse, 'bot');
        }
    }, 1800);

    setTimeout(function () {
        document.getElementById("briefblock0").scrollTop = document.getElementById("briefblock0").scrollHeight;
        document.getElementById("viewport").scrollTop = document.getElementById("viewport").scrollHeight;
        document.getElementById("viewPort").scrollTop = document.getElementById("viewPort").scrollHeight;
        document.getElementById("color_inversion_notice_box").style.display = "none";
    }, 1);

    setTimeout(function () {
        document.getElementById("briefblock0").scrollTop = document.getElementById("briefblock0").scrollHeight;
        document.getElementById("viewport").scrollTop = document.getElementById("viewport").scrollHeight;
        document.getElementById("viewPort").scrollTop = document.getElementById("viewPort").scrollHeight;
        document.getElementById("color_inversion_notice_box").style.display = "none";
    }, 2001);

    // document.getElementById("briefblock0").scrollTop = divElement.scrollHeight;

    document.getElementById('tab1').click();
    document.getElementById("color_inversion_notice_box").style.display = "none";

}

// Function to add messages to the chat
function addMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'bot' ? 'bot-message' : 'user-message';
    messageDiv.textContent = message;



    setTimeout(function () { chatBox.appendChild(messageDiv); }, 0);

    chatBox.scrollTop = chatBox.scrollHeight;
}

// Simple math solver
function solveMath(problem) {
    try {
        return eval(problem);
    } catch (e) {
        return "Invalid math problem.";
    }
}

// Event listeners
sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleUserInput();
    }
});
