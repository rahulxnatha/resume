// HTML elements
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Synonyms and responses
const synonyms = {
    greetings: ["hello", "hi", "hey", "greetings", "what's up"],
    identity: ["what is your name", "who are you", "tell me about yourself"],
    howAreYou: ["how are you", "how do you do"],
    help: ["help", "assist", "what can you do"],
    purpose: ["why are you", "your purpose", "what can you do"],
    about: ["Rahul", "about Rahul", "who is Rahul"],
    skills: ["skill", "skills"],
};

const responses = {
    greetings: "Hi there! How can I assist you today?",
    identity: "I am Rahul's chatbot, here to assist you with any questions you may have.",
    howAreYou: "I'm just a program, but thanks for asking!",
    help: "I can help answer questions about Rahul or assist you with general tasks. Just ask!",
    purpose: "I'm here to answer your questions and help with information on Rahul's website.",
    about: "Rahul is a technology enthusiast with a background in mechanical engineering. He built this chatbot!",
    skills: "Rahul’s skills are listed under the 'Skills' section on his website. Have a look!",
    unknown: "I'm sorry, I didn't quite understand that. Could you please clarify?",
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

// Handle user input
function handleUserInput() {
    const input = userInput.value.trim();
    if (input) {
        addMessage(input, 'user');
        userInput.value = '';

        const parsedCategory = parseInput(input);
        const botResponse = responses[parsedCategory] || responses.unknown;
        addMessage(botResponse, 'bot');
    }
}

// Add messages to chat
function addMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'bot' ? 'bot-message' : 'user-message';
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Event listeners
sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') handleUserInput();
});
