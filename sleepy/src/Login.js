import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isCorrect, setIsCorrect] = useState(null);
  const [isCorrectLength, setIsCorrectLength] = useState(null);
  const [registerIsCorect, setRegisterIsCorect] = useState(null);
  const [numIsCorect, setNumIsCorect] = useState(null);
   const checkPassword = (value) => {
    const valid = value.length >= 6 && /[A-Z]/.test(value) && /\d/.test(value);
    setIsCorrect(valid);
    if(value.length >= 6){
         setIsCorrectLength(true)
    }
    else{
      setIsCorrectLength(false);
    }
    if(/[A-Z]/.test(value)){
         setRegisterIsCorect(true)
    }else{
        setRegisterIsCorect(false);
    }
    if(/\d/.test(value))
       setNumIsCorect(true)
    else{
      setNumIsCorect(false)
    }
  };

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
      }, 60);
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
          type="password"
          value={password}
          onChange={(e) => {setPassword(e.target.value);checkPassword(e.target.value);}}
          className={isCorrect === null ? 'input-logc' : isCorrect ? 'valid' : 'invalid'}
          required
        />
        <br/>
        <ul className="password-rules">
            <li className={isCorrectLength ? "valid-message":"invalid-message"}>Пароль повинен містити не менше 6 символів</li>
            <li className={registerIsCorect ? "valid-message":"invalid-message"}>Пароль повинен складатись хоча б із однієї великої літери</li>
            <li className={numIsCorect ? "valid-message":"invalid-message"}>Пароль повинен містити хочаб 1 цифру</li>
       </ul>
        <button className="log-button" type="submit">Увійти</button>
      </form>

      <p className="discribe-log">
        У вас немає акаунту?<br/>
        <a href="/addUser" className="link-log">Зареєструватися</a>
      </p>
    </div>
  );
}
