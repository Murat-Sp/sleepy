import React from "react";
import Schedule from "./Schedule";
import "./SleepAnalytics.css";

const SleepAnalytics = ({ sleepRecords }) => {
  if (!sleepRecords || sleepRecords.length === 0) {
    return <p className="no-data">Немає даних для відображення 😴</p>;
  }


  const validRecords = sleepRecords
    .map(r => ({
      ...r,
      hours: Number(r.duration),
      mood: Number(r.qualityPercent),

    }))
    .filter(r => !isNaN(r.hours) && !isNaN(r.mood));

  if (validRecords.length === 0) {
    return <p className="no-data">Недостатньо коректних даних для аналітики 😴</p>;
  }

  const slides = [
    {
      label: "Тривалість сну (години)",
      data: validRecords.map(r => r.hours),
      labels: validRecords.map(r => r.date),
      borderColor: "#4caf50",
    },
    {
      label: "Якість сну",
      data: validRecords.map(r => r.mood),
      labels: validRecords.map(r => r.date),
      borderColor: "#2196f3",
    },
  ];

  const avgHours = (
    validRecords.reduce((acc, rec) => acc + rec.hours, 0) / validRecords.length
  ).toFixed(1);

  const avgMood = (
    validRecords.reduce((acc, rec) => acc + rec.mood, 0) / validRecords.length
  ).toFixed(1);

  return (
    <div className="analytics-container">
      <h1 className="title">Аналітика сну</h1>

      <div className="charts">
        <Schedule slides={slides} buttonClass="Schedulebtn" />
      </div>

      <div className="summary">
        <h2>Зведена статистика</h2>
        <div className="summary-cards">
          <div className="card">
            <p className="card-title">Записів</p>
            <p className="card-value">{validRecords.length}</p>
          </div>
          <div className="card">
            <p className="card-title">Середня тривалість</p>
            <p className="card-value">{avgHours} год</p>
          </div>
          <div className="card">
            <p className="card-title">Якість Сну</p>
            <p className="card-value">{avgMood}/100</p>
          </div>
          
        </div>
      </div>
    </div>
  );
};




export default SleepAnalytics;
