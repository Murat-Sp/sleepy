import { useState,useEffect } from "react";
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
  const [checkEmail,setCheckEmail]=useState(null)
  const navigate = useNavigate();
  const [isCorrect, setIsCorrect] = useState(null);
  const [isCorrectLength, setIsCorrectLength] = useState(null);
  const [registerIsCorect, setRegisterIsCorect] = useState(null);
  const [numIsCorect, setNumIsCorect] = useState(null);
  const [ageIsCorrect,setAgeIsCorrect]=useState(null);
  const [heightIsCorrect,setHeightIsCorrect]=useState(null);
  const [clicked, setClicked] = useState(false);
  const [showPassword,setShowPassword]=useState(false);
  const target = document.getElementById("email");

    const ShowPassword = (e)=>{
      setShowPassword(true)
    }
    const hidePassword = (e)=>{
      setShowPassword(false)
    }
  useEffect(() => {  
    if(age >= 120){
      setAgeIsCorrect(true)
      return;
    }
    else if(height>= 250){
      setHeightIsCorrect(true)
      return;
    }
    setAgeIsCorrect(false);
    setHeightIsCorrect(false);
    setCheckEmail(null);
}, [email,age,height]);
const hideRules  = (e)=>{
    setClicked(true)
}
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

      if (!res.ok){
         const data = await res.json();
        if(data.isCreate){
        setCheckEmail(true);
        target.scrollIntoView({behavior:"auto"})
      }
          return;
      };
      setCheckEmail(false);
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
        <input type="email"  className={checkEmail===null?'input-log': checkEmail ? 'invalid':'valid'} id="email" value={email} onChange={e => setEmail(e.target.value)} required />
        {checkEmail&&<p className="error-message">Користувач з таким емейлом вже існує</p>}
        <label className="log-lable">Вік</label>
        <input type="number"  className="input-log" value={age} onChange={e => setAge(e.target.value)} required />
        {ageIsCorrect&&<p className="error-message">Вік не може бути більшим за 120</p>}

        <label className="log-lable">Ріст</label>
        <input type="number"  className="input-log" value={height} onChange={e => setHeight(e.target.value)} required />
        {heightIsCorrect&&<p className="error-message">Зріст не може бути більший за 250см</p>}

        <label className="log-lable">Вага</label>
        <input type="number"  className="input-log" value={weight} onChange={e => setWeight(e.target.value)} required />

        <label className="log-lable">Пароль</label>
        <input  type={showPassword?"text":"password"}  className={isCorrect === null ? 'input-log' : isCorrect ? 'valid' : 'invalid'} value={password} onChange={e => {setPassword(e.target.value);checkPassword(e.target.value)}} onClick={hideRules}required />
        {showPassword?<i class="fa-solid fa-eye-slash" id="eye1" onClick={hidePassword}></i>: <i class="fa-solid fa-eye" id="eye1" onClick={ShowPassword}></i> }
        {clicked&&<ul className="password-rules">
            <li className={isCorrectLength ? "valid-message":"invalid-message"}>Пароль повинен містити не менше 6 символів</li>
            <li className={registerIsCorect ? "valid-message":"invalid-message"}>Пароль повинен складатись хоча б із однієї великої літери</li>
            <li className={numIsCorect ? "valid-message":"invalid-message"}>Пароль повинен містити хочаб 1 цифру</li>
       </ul>
}
        <button type="submit" className="log-button" disabled={!isCorrect}>Зареєструватися</button>
      </form>
       <p className="discribe-reg">
        У вас є акаунт?<br/>
        <a href="/" className="link-reg">Увійти</a>
      </p>
    </div>
  );
}
