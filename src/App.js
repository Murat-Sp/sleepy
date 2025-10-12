// src/App.js
import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import Details from "./Details";
import Schedule from "./Schedule";
import MainHome from "./MainHome";
import AddSleep from "./AddPage";
import SleepAnalytics from "./Analytics";
import Chat from "./chat";




export default function App() {
  const [sleepData, setSleepData] = useState([]); 


  const addSleepRecord = (record) => {
    setSleepData((prev) => [...prev, record]);
  };

  
  const convertToSlides = (data) => {
    if (!data || data.length === 0) {
      return [
        { id: "bedtime", label: "Час засипання", labels: [], data: [], borderColor: "blue" },
        { id: "sleepHours", label: "Час сну", labels: [], data: [], borderColor: "green" },
        { id: "sleepQuality", label: "Якість сну (%)", labels: [], data: [], borderColor: "purple" },
      ];
    }

    const labels = data.map((d, i) => d.date || `День ${i + 1}`);
    return [
      {
        id: "bedtime",
        label: "Час засипання (години)",
        labels,
        data: data.map((d) => {
          
          if (!d.bedtime) return null;
          const [hh, mm] = d.bedtime.split(":").map(Number);
          return +(hh + mm / 60).toFixed(2);
        }),
        borderColor: "blue",
      },
      {
        id: "sleepHours",
        label: "Тривалість сну (год.)",
        labels,
        data: data.map((d) => d.duration || 0),
        borderColor: "green",
      },
      {
        id: "sleepQuality",
        label: "Якість сну (%)",
        labels,
        data: data.map((d) => d.qualityPercent || 0),
        borderColor: "purple",
      },
    ];
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {}
          <Route
            path="/"
            element={
              <>
                {}
                <div className="headM">
                  <h1>Sleepy</h1>
                  <div className="imgA">
                    <a href="#">
                      <img className="to" src="/png/3to.png" alt="menu" />
                    </a>
                    <a href="#">
                      <img className="plus" src="/png/plus.png" alt="add" />
                    </a>
                  </div>
                </div>

                <div className="user">
                  <img className="avatar" src="/png/ava.jpg" alt="avatar" />
                  <p>Hi User</p>
                </div>

                {}
                <MainHome sleepData={sleepData} />

                {}
                <Details slides={convertToSlides(sleepData)} />

                {}
                <div className="ScheduleFat">
                  <div className="Schedule"></div>
                  <div style={{ textAlign: "center", fontFamily: "Arial" }}>
                    <h1>sleep tracker</h1>
                    <Schedule slides={convertToSlides(sleepData)} />
                  </div>
                </div>
              </>
            }
          />

          
          <Route path="/add" element={<AddSleep addSleepRecord={addSleepRecord} />} />

        
          <Route path="/analytics" element={<SleepAnalytics sleepRecords={sleepData} />} />


         
          <Route path="/chat" element={<Chat sleepRecords={sleepData} />} />

        </Routes>


        <div className="NavBarFull">
          <NavBar />
        </div>
      </div>
    </Router>
  );
}
