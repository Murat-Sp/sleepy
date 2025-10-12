import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import fetch from "node-fetch"

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      }),
    })
    const data = await response.json()
    res.json({ reply: data.choices?.[0]?.message?.content || "Помилка у відповіді" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

app.listen(process.env.PORT, () => console.log(`✅ Server running on port ${process.env.PORT}`))
