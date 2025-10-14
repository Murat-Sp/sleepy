import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './AddUserPage.css'

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      name,
      lastName,
      email,
      age: parseInt(age),
      height: parseFloat(height),
      weight: parseFloat(weight),
      password,
    };

    try {
      const res = await fetch("http://localhost:5008/api/user/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(userData)
})

      if (!res.ok) throw new Error("Помилка збереження");
      const data = await res.json();
      alert("Дані збережено!");
      navigate("/")
    } catch (err) {
      console.error(err);
      alert("❌ Помилка");
    }
  };

  return (
    <div className="Loginbox">
      <h1 className="Enter">Реєстрація</h1>
      <form className="loginForm" onSubmit={handleSubmit}>
        <label className="log-lable">Ім'я</label>
        <input type="text"  className="input-log" value={name} onChange={e => setName(e.target.value)} required />

        <label className="log-lable">Прізвище</label>
        <input type="text"  className="input-log" value={lastName} onChange={e => setLastName(e.target.value)} required />

        <label className="log-lable">Email</label>
        <input type="email"  className="input-log" value={email} onChange={e => setEmail(e.target.value)} required />

        <label className="log-lable">Вік</label>
        <input type="number"  className="input-log" value={age} onChange={e => setAge(e.target.value)} required />

        <label className="log-lable">Ріст</label>
        <input type="number"  className="input-log" value={height} onChange={e => setHeight(e.target.value)} required />

        <label className="log-lable">Вага</label>
        <input type="number"  className="input-log" value={weight} onChange={e => setWeight(e.target.value)} required />

        <label className="log-lable">Пароль</label>
        <input type="password"  className="input-log" value={password} onChange={e => setPassword(e.target.value)} required />

        <button type="submit" className="log-button">Зареєструватися</button>
      </form>
    </div>
  );
}
