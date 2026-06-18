import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import ChatMessage from './components/ChatMessage'
import InputBox from './components/InputBox'

function App() {
  const [messages, setMessages] = useState([
    {
      id: 0,
      sender: 'hanzai',
      content: 'Halo! 👋 Saya HanzAI, senang bertemu Anda! Apa yang bisa saya bantu hari ini?',
      timestamp: new Date()
    }
  ])
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return

    // Add user message to state
    const userMsg = {
      id: messages.length,
      sender: 'user',
      content: userMessage,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const response = await axios.post('http://localhost:8000/api/chat/send', {
        conversation_id: conversationId,
        message: userMessage,
        user_id: 1
      })

      const { ai_response, conversation_id } = response.data
      
      if (!conversationId) {
        setConversationId(conversation_id)
      }

      setMessages(prev => [...prev, {
        id: prev.length,
        sender: 'hanzai',
        content: ai_response.content,
        timestamp: new Date(ai_response.timestamp)
      }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        id: prev.length,
        sender: 'hanzai',
        content: 'Maaf, terjadi kesalahan. Coba lagi!',
        timestamp: new Date()
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="hanzai-container">
      <div className="header">
        <div className="logo">
          <span className="logo-icon">🤖</span>
          <h1>HanzAI</h1>
        </div>
        <p className="tagline">Advanced AI Chatbot</p>
      </div>

      <div className="chat-container">
        <div className="messages">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {loading && (
            <div className="message ai-message">
              <div className="bubble typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <InputBox onSend={sendMessage} disabled={loading} />
    </div>
  )
}

export default App