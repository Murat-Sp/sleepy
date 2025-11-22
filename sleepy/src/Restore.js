import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Restore() {
  const [restoreEmail,setRestoreEmail]=useState("");
  const [nextForm, setNextForm]=useState(null);
  const [restoreCode,setCode]=useState("");
  const [restorePassword,setNewPassword]=useState("")
  const [message,setMessage]=useState(null);
  const navigate = useNavigate();
  const [timer,setTimer]=useState(null);
  const [showPassword,setShowPassword]=useState(false);
    const ShowPassword = (e)=>{
      setShowPassword(true)
    }
    const hidePassword = (e)=>{
      setShowPassword(false)
    }
    useEffect(() => {
    if (nextForm == null || nextForm == "password") return;
    let seconds = 0;
    const interval = setInterval(() => {
      seconds++;
      setTimer(seconds);
      if (seconds >= 59) {    
        clearInterval(interval);
      }
    }, 1000); 

    return () => clearInterval(interval); 
  }, [nextForm]);

  const handleSubmit =  async(e) =>{
    e.preventDefault()
        try{
            const response = await fetch("http://localhost:5008/api/login/restore",{
                 method: "POST",
                 headers: { "Content-Type": "application/json" },
                 credentials: "include",
                 body: JSON.stringify({restoreEmail}),
            });
              if(response.ok){
                const data =  await response.json()
                alert(data.message)
                 setMessage(null)
                setNextForm("code");
              }
              if (!response.ok) {
                if(response.status == 404){
                 const message = await response.text();
                   setMessage(message)
                  }
                  throw new Error(message || "Невідома помилка");
               }
        } 
  catch(error){
      console.error(error.message)
  }
  }
const handleCode =  async(e) =>{
    e.preventDefault()
        try{
            const response = await fetch("http://localhost:5008/api/login/verify-code",{
                 method: "POST",
                 headers: { "Content-Type": "application/json" },
                 credentials: "include",
                 body: JSON.stringify({restoreCode,restoreEmail}),
            });
              if(response.ok){
                const data =  await response.json()
                alert(data.message)
                setNextForm("password");
                setMessage(null);
              }
              if (!response.ok) {
                if(response.status === 400){
                 const message = await response.text();
                   setMessage(message)
                  }
                  throw new Error(message || "Невідома помилка");
               }
        } 
  catch(error){
      console.error(error.message)
  }
  }
const handlePassword=  async(e) =>{
    e.preventDefault()
        try{
            const response = await fetch("http://localhost:5008/api/login/new-password",{
                 method: "POST",
                 headers: { "Content-Type": "application/json" },
                 credentials: "include",
                 body: JSON.stringify({restorePassword,restoreEmail}),
            });
              if(response.ok){
                const data =  await response.json()
                alert(data.message)
                 navigate("/")
              }
               if (!response.ok) {
                if(response.status === 404){
                 const message = await response.text();
                   setMessage(message)
                  }
                  throw new Error(message || "Невідома помилка");
               }
           } 
         catch(error){
             console.error(error.message)
         }
  }
    return(
        <div className="Loginbox">
            <h2 className="Enter">Відновлення паролю</h2>
           {nextForm === null && (<form className="loginForm" onSubmit={handleSubmit}>
                <input   className="input-log" type="email"
                 value={restoreEmail} onChange={(e)=>setRestoreEmail(e.target.value)} placeholder="Введіть Eмейл"></input>
                <button className="log-button" type="submit">Відправити код відновлення</button>
                 {message && <p className="invalid-message">{message}</p>}
            </form>)}{nextForm === "code" && <form className="loginForm" onSubmit={handleCode}>
                <input   className="input-log" type="text"
                 value={restoreCode} onChange={(e)=>setCode(e.target.value)} placeholder="Введіть 6-значний код"></input>
                <button className="log-button" type="submit">Перевірити код</button>
                 {message && <p className="invalid-message">{message}</p>}
                {timer<59? <p className="timer">00:{timer}</p>:<p className="discribe-log">Неприйшов код?<a className="link-log" onClick={handleSubmit}>Надіслати код</a></p>}
            </form>
            }
            {nextForm === "password" &&  <form className="loginForm" onSubmit={handlePassword}>
                <input   className="input-log" type={showPassword?"text":"password"}
                 value={restorePassword} onChange={(e)=>setNewPassword(e.target.value)} placeholder="Введіть новий пароль"></input>
                <button className="log-button" type="submit">Надіслати</button>
                  {showPassword?<i className="fa-solid fa-eye-slash eyeRestore" id="eye3" onClick={hidePassword}></i>: <i className="fa-solid fa-eye" id="eye3" onClick={ShowPassword}></i> }
                  {message && <p className="invalid-message">{message}</p>}
            </form>}
        </div>
    )
}