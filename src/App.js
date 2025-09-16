// src/App.js
import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import Details from "./Details";
import Schedule from "./Schedule";
import MainHome from "./MainHome";
import AddSleep from "./AddPage";

/**
 * App — головний файл
 * - зберігає масив записів sleepData
 * - передає його в MainHome (щоб показувати пораду / last night)
 * - передає перетворені дані (convertToSlides) в Details / Schedule
 */

export default function App() {
  const [sleepData, setSleepData] = useState([]); // масив об'єктів — всі записи сну

  // додає новий запис
  const addSleepRecord = (record) => {
    setSleepData((prev) => [...prev, record]);
  };

  // Перетворити sleepData в формат slides (для Schedule / Details)
  // BEDTIME у графіку береться як година засинання (0-23)
  // DURATION -> години сну (float)
  // QUALITY -> percent або scale (збережено у записі)
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
          // bedtime зберігається як "HH:MM" -> беремо годину + хвилини/60
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
          {/* Головна сторінка: весь твій основний UI */}
          <Route
            path="/"
            element={
              <>
                {/* Header / Avatar (вбудовано тут, щоб було як у тебе) */}
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

                {/* MainHome показує Continue або пораду (і приховує картинку якщо є дані) */}
                <MainHome sleepData={sleepData} />

                {/* Details (передаємо slides) */}
                <Details slides={convertToSlides(sleepData)} />

                {/* Schedule як частина головної сторінки */}
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

          {/* Сторінка додавання — додає запис у масив */}
          <Route path="/add" element={<AddSleep addSleepRecord={addSleepRecord} />} />

          {/* Окрема сторінка статистики (якщо треба) */}
          <Route path="/stats" element={<Details slides={convertToSlides(sleepData)} />} />

          {/* заглушка для чату */}
          <Route path="/chat" element={<div style={{ padding: 20 }}>Чат (порожній)</div>} />
        </Routes>

        {/* Навігаційна панель завжди внизу */}
        <div className="NavBarFull">
          <NavBar />
        </div>
      </div>
    </Router>
  );
}
