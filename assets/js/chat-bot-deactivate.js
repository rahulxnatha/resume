// HTML elements
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Function to handle user input
async function handleUserInput() {
    const input = userInput.value.trim();
    if (input) {
        addMessage(input, 'user');
        userInput.value = '';
        
        try {
            const botResponse = await getAIResponse(input);
            addMessage(botResponse, 'bot');
        } catch (error) {
            addMessage("Sorry, there was an issue processing your request.", 'bot');
        }
    }
}

// Function to call AI API
async function getAIResponse(input) {
    const response = await fetch('https://api.yourbackend.com/ai-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
    });
    const data = await response.json();
    return data.response;  // assuming API returns a JSON with 'response'
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


// -----------------------------------

// Node.js backend with Express and OpenAI
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

app.post('/ai-response', async (req, res) => {
    const userMessage = req.body.message;
    try {
        const aiResponse = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: "system", content: "You are a helpful assistant for language correction and user intent detection." },
                { role: "user", content: userMessage }
            ],
            max_tokens: 100
        });
        
        const botMessage = aiResponse.data.choices[0].message.content.trim();
        res.json({ response: botMessage });
    } catch (error) {
        console.error('Error with AI response:', error);
        res.status(500).json({ response: "Sorry, I couldn't process that." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
