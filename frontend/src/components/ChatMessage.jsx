import './ChatMessage.css'

export default function ChatMessage({ message }) {
  const isUser = message.sender === 'user'

  return (
    <div className={`message ${isUser ? 'user-message' : 'ai-message'}`}>
      {!isUser && <span className="avatar">🤖</span>}
      <div className="bubble">
        <p>{message.content}</p>
        <span className="timestamp">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
      {isUser && <span className="avatar">👤</span>}
    </div>
  )
}