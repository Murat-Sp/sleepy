import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5008/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        alert("Невірний email або пароль");
        return;
      }

      const data = await response.json();

      console.log("[Login] server user:", data);

      try {
        localStorage.setItem("user", JSON.stringify(data));
        console.log("[Login] saved to localStorage");
      } catch (e) {
        console.error("[Login] cannot save to localStorage", e);
      }

      setUser(data);

      // невелика затримка щоб бути впевненим, що контекст оновився
      setTimeout(() => {
        navigate("/Home", { replace: true });
      }, 120);
    } catch (error) {
      console.error("[Login] error:", error);
      alert("Помилка мережі або сервера");
    }
  };

  return (
    <div className="Loginbox">
      <h1 className="Enter">Ввійдіть в акаунт</h1>
      <form className="loginForm" onSubmit={handleSubmit}>
        <label className="log-lable">Email</label><br/>
        <input
          className="input-log"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br/>

        <label className="log-lable">Пароль</label><br/>
        <input 
          className="input-log"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br/>

        <button className="log-button" type="submit">Увійти</button>
      </form>

      <p className="discribe-log">
        У вас немає акаунту?<br/>
        <a href="/addUser" className="link-log">Зареєструватися</a>
      </p>
    </div>
  );
}
