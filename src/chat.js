import { useState } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import "./chat.css"

export default function Chat() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMessage = { sender: "user", text: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const res = await axios.post("http://localhost:3001/api/chat", { message: input })
      const botMessage = { sender: "bot", text: res.data.reply }
      setMessages(prev => [...prev, botMessage])
    } catch (err) {
      console.error("Axios error:", err)
      const errorMessage = { sender: "bot", text: "⚠️ Сталася помилка на сервері." }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chat-container">
      <h1 className="chat-title">💬 Sleepy AI</h1>

      <div className="chat-box">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`message ${m.sender}`}
          >
            {m.text}
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="typing"
          >
            <span className="dot">•</span>
            <span className="dot">•</span>
            <span className="dot">•</span>
          </motion.div>
        )}
      </div>

      <div className="input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Напиши повідомлення..."
          className="input"
        />
        <button onClick={sendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  )
}
