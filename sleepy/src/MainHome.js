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

export default function MainHome({ additionalInfo }) {
  const navigate = useNavigate();
  const last = additionalInfo && additionalInfo.length ? additionalInfo[additionalInfo.length - 1] : null;

  return (
    <div className="mainhome">
      {!last ? (
        <>
          {/* картинка зникає коли є останній запис */}
          <img id="lineId" className="line" src="/png/line-1.png" alt="line" />
          <div>
            <p id="stepsId" className="steps">1 steps left</p>
            <p id="stepsTextId" className="stepsText">
               виконати сьогоднішні кроки
              <br />
              щоб покращити сон
            </p>
            <button id="btnStepsId" className="btnSteps" onClick={() => navigate("/add")}>
              продовжити
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
              (основні фактори: {last.UsedGadgets ? "гаджети, " : ""}
              {last.Caffeine ? "кофеїн, " : ""}стрес: {last.Stress})
            </small>
          </div>

          {/* Останній сон */}
          <div className="last-sleep-box">
            <h4 className="last-sleep-title">Крайній сон:</h4>
            <p>
              Заснув: {last.BedTime} • Прокинувся: {last.Waketime} • Тривалість:{" "}
              {last.Duration} год.
            </p>
            <p>
              Прокидань: {last.WakeUps} • Настрій: {last.Mood} • Якість:{" "}
              {last.qualityScale}/10 ({last.qualityPercent}%)
            </p>
          </div>
        </>
      )}
    </div>
  );
}
