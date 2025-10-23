import React, { useState, useContext, use } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import "./Login.css";

export default function Restore() {
  const [restoreEmail,setRestoreEmail]=useState("");
  const navigate = useNavigate();
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
                navigate("/")
              }
        } 
  catch(error){
      console.error(error)
  }
  }
    return(
        <div className="Loginbox">
            <h2 className="Enter">Відновлення паролю</h2>
            <form className="loginForm" onSubmit={handleSubmit}>
                <input   className="input-log" type="email"
                 value={restoreEmail} onChange={(e)=>setRestoreEmail(e.target.value)} placeholder="Введіть Email"></input>
                <button className="log-button" type="submit">Відправити код відновлення</button>
            </form>
        </div>
    )
}