// src/MainHome.js
import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * MainHome
 * - якщо немає записів -> показує картинку + кнопку Continue (переходить на /add)
 * - якщо є запис -> ховає картинку і показує пораду + підсумок останньої ночі
 * lastRecord — останній елемент масиву sleepData
 */

const getAdviceTextFromQuality = (pct) => {
  if (pct >= 80) return "Сон був чудовим! Продовжуй у тому ж дусі 💪";
  if (pct >= 60) return "Сон хороший, але можна трохи покращити: менше гаджетів перед сном.";
  if (pct >= 40) return "Сон середній — зверни увагу на розслаблення перед сном.";
  return "Якість сну низька. Спробуй знизити стрес та уникати кофеїну ввечері.";
};

export default function MainHome({ sleepData }) {
  const navigate = useNavigate();
  const last = sleepData && sleepData.length ? sleepData[sleepData.length - 1] : null;

  return (
    <div className="mainhome">
      {!last ? (
        <>
          {/* картинка зникає коли є останній запис */}
          <img id="lineId" className="line" src="/png/line-1.png" alt="line" />
          <div>
            <p id="stepsId" className="steps">1 steps left</p>
            <p id="stepsTextId" className="stepsText">
              complete today's steps
              <br />
              to improve sleep
            </p>
            <button id="btnStepsId" className="btnSteps" onClick={() => navigate("/add")}>
              continue
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Порада */}
          <div className="advice-box">
            <p className="advice-title">Порада на сьогодні</p>
            <p className="advice-text">
              {getAdviceTextFromQuality(last.qualityPercent)}
            </p>
            <small className="advice-sub">
              (основні фактори: {last.usedGadgets ? "гаджети, " : ""}
              {last.caffeine ? "кофеїн, " : ""}стрес: {last.stress})
            </small>
          </div>

          {/* Останній сон */}
          <div className="last-sleep-box">
            <h4 className="last-sleep-title">Last sleep — {last.date}</h4>
            <p>
              Заснув: {last.bedtime} • Прокинувся: {last.wakeTime} • Тривалість:{" "}
              {last.duration} год.
            </p>
            <p>
              Прокидань: {last.wakeUps} • Настрій: {last.mood} • Якість:{" "}
              {last.qualityScale}/10 ({last.qualityPercent}%)
            </p>
          </div>
        </>
      )}
    </div>
  );
}
