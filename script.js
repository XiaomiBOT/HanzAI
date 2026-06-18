// HanzAi - AI Assistant
// Gemini API Configuration
const GEMINI_API_KEY = "AQ.Ab8RN6KU3Vy6m6n2WsvGuyrOA6zPVxq6BzCEtVmEjRHMh-8aXw";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// State Management
let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
let currentChatId = null;
let conversations = JSON.parse(localStorage.getItem('conversations')) || {};
let isDarkMode = JSON.parse(localStorage.getItem('isDarkMode')) || false;
let fontSize = localStorage.getItem('fontSize') || 'medium';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadChatHistory();
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').checked = true;
    }
    document.body.classList.add(`font-${fontSize}`);
});

// Initialize App
function initializeApp() {
    startNewChat();
    setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
    document.getElementById('userInput').addEventListener('keydown', handleKeyPress);
    document.addEventListener('click', closeModalsOnOutsideClick);
}

// Handle Key Press
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        if (event.shiftKey) {
            // Shift+Enter untuk baris baru
            event.preventDefault();
            const input = event.target;
            const start = input.selectionStart;
            const end = input.selectionEnd;
            input.value = input.value.substring(0, start) + '\n' + input.value.substring(end);
            input.selectionStart = input.selectionEnd = start + 1;
        } else {
            // Enter untuk kirim
            event.preventDefault();
            sendMessage();
        }
    }
}

// Send Message
async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();

    if (!message) return;

    // Hide welcome screen
    document.getElementById('welcomeScreen').style.display = 'none';

    // Add user message to UI
    addMessageToUI(message, 'user');
    userInput.value = '';

    // Add to chat history
    if (!currentChatId) {
        startNewChat();
    }

    conversations[currentChatId].messages.push({
        role: 'user',
        content: message
    });

    // Show typing indicator
    addTypingIndicator();

    try {
        // Get AI response
        const response = await getGeminiResponse(message);
        
        // Remove typing indicator
        removeTypingIndicator();

        // Add AI response to UI
        addMessageToUI(response, 'assistant');

        // Add to chat history
        conversations[currentChatId].messages.push({
            role: 'assistant',
            content: response
        });

        // Save conversations
        saveConversations();

    } catch (error) {
        removeTypingIndicator();
        console.error('Error:', error);
        addMessageToUI('Maaf, terjadi kesalahan. Silakan coba lagi.', 'assistant');
    }
}

// Get Gemini Response
async function getGeminiResponse(userMessage) {
    const messages = conversations[currentChatId].messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));

    const requestBody = {
        contents: messages,
        generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
        }
    };

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Invalid response format');
        }

    } catch (error) {
        console.error('Gemini API Error:', error);
        throw error;
    }
}

// Add Message to UI
function addMessageToUI(message, role) {
    const chatMessages = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', role);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    
    // Parse markdown-like formatting
    contentDiv.innerHTML = parseMessageContent(message);

    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Parse Message Content
function parseMessageContent(content) {
    let html = content;

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Line breaks
    html = html.replace(/\n/g, '<br>');

    // Lists
    html = html.replace(/^\- (.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>');

    return html;
}

// Add Typing Indicator
function addTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'assistant');
    messageDiv.id = 'typing-indicator';

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    contentDiv.innerHTML = `
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;

    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove Typing Indicator
function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Start New Chat
function startNewChat() {
    currentChatId = generateId();
    conversations[currentChatId] = {
        id: currentChatId,
        title: 'Chat Baru',
        createdAt: new Date(),
        messages: [
            {
                role: 'system',
                content: 'Anda adalah HanzAi, sebuah asisten AI yang ramah dan membantu. Jawab pertanyaan pengguna dengan jelas dan informatif.'
            }
        ]
    };

    saveConversations();
    loadChatHistory();
    clearChatUI();
    showWelcomeScreen();
}

// Clear Chat UI
function clearChatUI() {
    document.getElementById('chatMessages').innerHTML = '';
}

// Show Welcome Screen
function showWelcomeScreen() {
    document.getElementById('welcomeScreen').style.display = 'flex';
}

// Send Suggestion
function sendSuggestion(text) {
    document.getElementById('userInput').value = text;
    sendMessage();
}

// Generate ID
function generateId() {
    return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Save Conversations
function saveConversations() {
    localStorage.setItem('conversations', JSON.stringify(conversations));
}

// Load Chat History
function loadChatHistory() {
    const chatList = document.getElementById('chatList');
    chatList.innerHTML = '';

    const sortedConversations = Object.values(conversations)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    sortedConversations.forEach(conv => {
        const chatItem = document.createElement('div');
        chatItem.classList.add('chat-item');
        if (conv.id === currentChatId) {
            chatItem.classList.add('active');
        }

        // Get first user message as title
        let title = 'Chat Baru';
        for (let msg of conv.messages) {
            if (msg.role === 'user') {
                title = msg.content.substring(0, 30) + (msg.content.length > 30 ? '...' : '');
                break;
            }
        }

        chatItem.textContent = title;
        chatItem.onclick = () => loadConversation(conv.id);

        chatList.appendChild(chatItem);
    });
}

// Load Conversation
function loadConversation(id) {
    currentChatId = id;
    clearChatUI();
    loadChatHistory();

    const conversation = conversations[id];
    if (conversation) {
        conversation.messages.forEach(msg => {
            if (msg.role !== 'system') {
                addMessageToUI(msg.content, msg.role === 'user' ? 'user' : 'assistant');
            }
        });
    }

    document.getElementById('welcomeScreen').style.display = 'none';
}

// New Chat
function newChat() {
    startNewChat();
}

// Toggle Sidebar
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('show');
}

// Toggle Settings
function toggleSettings() {
    const modal = document.getElementById('settingsModal');
    modal.classList.toggle('show');
}

// Toggle Help
function toggleHelp() {
    const modal = document.getElementById('helpModal');
    modal.classList.toggle('show');
}

// Close Modals on Outside Click
function closeModalsOnOutsideClick(event) {
    const settingsModal = document.getElementById('settingsModal');
    const helpModal = document.getElementById('helpModal');

    if (event.target === settingsModal) {
        settingsModal.classList.remove('show');
    }
    if (event.target === helpModal) {
        helpModal.classList.remove('show');
    }
}

// Toggle Theme
function toggleTheme() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
}

// Toggle Dark Mode (from settings)
function toggleDarkMode() {
    toggleTheme();
}

// Change Font Size
function changeFontSize(size) {
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${size}`);
    fontSize = size;
    localStorage.setItem('fontSize', size);
}

// Clear History
function clearHistory() {
    if (confirm('Apakah Anda yakin ingin menghapus semua riwayat chat?')) {
        conversations = {};
        chatHistory = [];
        localStorage.removeItem('conversations');
        localStorage.removeItem('chatHistory');
        startNewChat();
        alert('Riwayat chat telah dihapus');
    }
}

// Save Chat History
function saveChatHistory() {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}
