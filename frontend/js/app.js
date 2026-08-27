// API Configuration
const API_BASE_URL = 'http://localhost:8000';
const API_ENDPOINTS = {
    CHAT: '/api/chat',
    HISTORY: '/api/history',
    CLEAR_HISTORY: '/api/clear-history',
    HEALTH: '/health'
};

// State
let conversationHistory = [];
let isLoading = false;
let totalTokens = 0;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadHistory();
    checkAPIHealth();
});

// Setup event listeners
function setupEventListeners() {
    const messageInput = document.getElementById('message-input');
    
    // Send message on Enter (Ctrl+Enter for multiline)
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Auto-resize textarea
    messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto';
        messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
    });
}

// Check API health
async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.HEALTH}`);
        if (!response.ok) {
            showToast('Warning: Could not connect to API', 'error');
        }
    } catch (error) {
        console.error('Health check failed:', error);
        showToast('API connection failed. Please check if backend is running.', 'error');
    }
}

// Send message
async function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    
    if (!message) return;
    if (isLoading) return;
    
    // Add user message to UI
    addMessageToUI(message, 'user');
    messageInput.value = '';
    messageInput.style.height = 'auto';
    
    // Show loading state
    setLoading(true);
    
    try {
        // Make API request
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CHAT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                model: 'gpt-4-turbo-preview',
                temperature: 0.7,
                max_tokens: 2000
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to get response');
        }
        
        const data = await response.json();
        
        // Add AI response to UI
        addMessageToUI(data.ai_response, 'ai');
        
        // Update tokens count
        totalTokens += data.tokens_used;
        document.getElementById('tokens-count').textContent = totalTokens.toLocaleString();
        
        // Save to conversation history
        conversationHistory.push({
            id: data.id,
            user_message: data.user_message,
            ai_response: data.ai_response,
            model_used: data.model_used,
            tokens_used: data.tokens_used,
            created_at: data.created_at
        });
        
        // Update history sidebar
        addHistoryItem(message);
        
    } catch (error) {
        console.error('Error:', error);
        showToast(`Error: ${error.message}`, 'error');
        addMessageToUI(`Error: ${error.message}`, 'error');
    } finally {
        setLoading(false);
        messageInput.focus();
    }
}

// Add message to UI
function addMessageToUI(message, role) {
    const messagesArea = document.getElementById('messages-area');
    
    // Remove welcome message on first message
    const welcomeMessage = messagesArea.querySelector('.welcome-message');
    if (welcomeMessage && (role === 'user' || role === 'ai')) {
        welcomeMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Format message (basic markdown-like formatting)
    contentDiv.innerHTML = formatMessage(message);
    
    messageDiv.appendChild(contentDiv);
    messagesArea.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

// Format message with basic markdown support
function formatMessage(message) {
    // Escape HTML
    let formatted = message
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    
    // Convert code blocks
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Convert inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Convert bold
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Convert italic
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Convert line breaks
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
}

// Load chat history
async function loadHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.HISTORY}?skip=0&limit=20`);
        if (!response.ok) throw new Error('Failed to load history');
        
        const data = await response.json();
        conversationHistory = data.items;
        
        // Populate history list
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';
        
        data.items.reverse().forEach((item) => {
            addHistoryItem(item.user_message);
        });
        
        // Update total tokens
        totalTokens = data.items.reduce((sum, item) => sum + item.tokens_used, 0);
        document.getElementById('tokens-count').textContent = totalTokens.toLocaleString();
        
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

// Add item to history sidebar
function addHistoryItem(message) {
    const historyList = document.getElementById('history-list');
    
    const item = document.createElement('div');
    item.className = 'history-item';
    item.textContent = message.substring(0, 50) + (message.length > 50 ? '...' : '');
    item.title = message;
    item.onclick = () => {
        document.getElementById('message-input').value = message;
        document.getElementById('message-input').focus();
    };
    
    historyList.insertBefore(item, historyList.firstChild);
}

// Start new chat
function startNewChat() {
    const messagesArea = document.getElementById('messages-area');
    messagesArea.innerHTML = `
        <div class="welcome-message">
            <h2>Welcome to Retired AI</h2>
            <p>Ask me anything! I'm here to help with questions, explanations, code, and more.</p>
            <div class="quick-tips">
                <h4>Quick Tips:</h4>
                <ul>
                    <li>💡 Ask coding questions</li>
                    <li>📚 Request explanations</li>
                    <li>🔧 Get debugging help</li>
                    <li>✍️ Get writing assistance</li>
                </ul>
            </div>
        </div>
    `;
    
    document.getElementById('message-input').value = '';
    document.getElementById('message-input').focus();
}

// Clear history with confirmation
function clearHistoryConfirm() {
    if (confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
        clearHistory();
    }
}

// Clear chat history
async function clearHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CLEAR_HISTORY}`, {
            method: 'POST'
        });
        
        if (!response.ok) throw new Error('Failed to clear history');
        
        conversationHistory = [];
        document.getElementById('history-list').innerHTML = '';
        totalTokens = 0;
        document.getElementById('tokens-count').textContent = '0';
        startNewChat();
        
        showToast('Chat history cleared', 'success');
    } catch (error) {
        console.error('Error clearing history:', error);
        showToast('Failed to clear history', 'error');
    }
}

// Show/hide loading state
function setLoading(loading) {
    isLoading = loading;
    const spinner = document.getElementById('loading-spinner');
    const sendBtn = document.querySelector('.send-btn');
    
    if (loading) {
        spinner.style.display = 'block';
        sendBtn.disabled = true;
    } else {
        spinner.style.display = 'none';
        sendBtn.disabled = false;
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
