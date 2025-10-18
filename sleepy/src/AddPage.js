// src/AddSleep.js
import React, { useState,useContext} from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import "./AddSleep.css";

export default function AddSleep({ addSleepRecord }) {
  const navigate = useNavigate();
  const {user,setAdditionalInfo}= useContext(UserContext);
  // const { id } = useParams()
  const [bedtime, setBedtime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [wakeUps, setWakeUps] = useState(0);
  const [difficultyFallingAsleep, setDifficultyFallingAsleep] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState(3);
  const [mood, setMood] = useState("normal");
  const [usedGadgets, setUsedGadgets] = useState(false);
  const [gadgetMinutes, setGadgetMinutes] = useState(0);
  const [caffeine, setCaffeine] = useState(false);
  const [caffeineWhen, setCaffeineWhen] = useState("");
  const [stress, setStress] = useState(5);
  const [activity, setActivity] = useState("medium");
  const [lastMeal, setLastMeal] = useState("");
  const [dreams, setDreams] = useState("");
  const [notes, setNotes] = useState("");

  const [showModal, setShowModal] = useState(false);

  const calcDuration = (bt, wt) => {
    if (!bt || !wt) return 0;
    const [bh, bm] = bt.split(":").map(Number);
    const [wh, wm] = wt.split(":").map(Number);
    let start = bh * 60 + bm;
    let end = wh * 60 + wm;
    if (end <= start) end += 24 * 60;
    return +((end - start) / 60).toFixed(2);
  };

  const computeQualityPercent = (tempRecord) => {
    let score = 100;
    console.log(tempRecord.Duration)
    if (tempRecord.Duration < 6) score -= 20;
    else if (tempRecord.Duration < 7) score -= 10;
    else if (tempRecord.Duration > 9) score -= 5;
    if (tempRecord.DifficultyFallingAsleep) {
      score -= 10 + Math.min(tempRecord.DifficultyLevel * 1.5, 10);
    }
    score -= Math.min(tempRecord.WakeUps * 10, 30);
    if (tempRecord.UsedGadgets)
      score -= 10 + Math.min(Math.floor(tempRecord.GadgetMinutes / 10), 10);
    if (tempRecord.Caffeine) score -= 8;
    if (tempRecord.Stress > 5) score -= (tempRecord.Stress - 5) * 4;
    if (tempRecord.mood === "bad") score -= 12;
    else if (tempRecord.Mood === "normal") score -= 3;
    if (tempRecord.Bedtime) {
      const [hh] = tempRecord.Bedtime.split(":").map(Number);
      if (hh >= 1 && hh <= 4) score -= 8;
    }
    return Math.max(0, Math.min(100, Math.round(score)));
  };

const handleSubmit = async (e) => {
  if (!bedtime || !wakeTime) {
    setShowModal(true);
    return;
  }

  if (!user) {
    alert("Користувач не авторизований");
    return;
  }
  console.log(user)
if (!bedtime || !wakeTime || !user?.id) {
  alert("Заповніть обов'язкові поля!");
  return;
}
const duration = calcDuration(bedtime, wakeTime);

const tempRecord = {
  BedTime: bedtime,         
  Waketime: wakeTime,       
  Duration: duration,      
  WakeUps: Number(wakeUps),
  DifficultyFallingAsleep: difficultyFallingAsleep,
  DifficultyLevel: Number(difficultyLevel),
  Mood: mood,
  UsedGadgts: usedGadgets,
  GadgetMinutes: Number(gadgetMinutes),
  Caffeine: caffeine,
  caffeineWhen: caffeine ? caffeineWhen : null, 
  Stress: Number(stress),
  Activity: activity,
  LastMeal: lastMeal ? Number(lastMeal.split(":")[0]) : 0, 
  Dreams: dreams,
  Notes: notes,
  UserId: user.id,
};
const qualityPercent = computeQualityPercent(tempRecord);
const qualityScale = Math.max(1, Math.round(qualityPercent / 10));
const record = {
  ...tempRecord,
  QualityPercent:qualityPercent,
  QualityScale:qualityScale
};
try {
    const res = await fetch(`http://localhost:5008/api/AdditionalInfo/${user.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify( record ),
    });

    if (!res.ok) {
    const errorText = await res.text();
    console.error("Помилка серверу:", res.status, errorText);
    alert("Помилка серверу: " + res.status);
    return;
  }
  const data = await res.json();
  console.log(data);
  setAdditionalInfo(data.additionalInfo)
  alert(data.message);
} catch (error) {
  console.error("Помилка при відправленні:", error);
}
};


  return (
    <div className="add-page">
      <h2>Додати інформацію про сон</h2>
     <form onSubmit={handleSubmit}>
      <section>
        <h3>1. Основні</h3>
        <label>
          Час засинання*:
          <input type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)} />
        </label>

        <label>
          Час пробудження*:
          <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} />
        </label>
      </section>

      <section>
        <h3>2. Якість і відчуття</h3>
        <label>
          Кількість пробуджень:
          <input type="number" min="0" value={wakeUps} onChange={(e) => setWakeUps(e.target.value)} />
        </label>

        <label>
          Важко заснути?
          <input type="checkbox" checked={difficultyFallingAsleep} onChange={(e) => setDifficultyFallingAsleep(e.target.checked)} />
        </label>

        {difficultyFallingAsleep && (
          <label>
            Рівень труднощі (1-10):
            <input type="range" min="1" max="10" value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value)} />
            {difficultyLevel}
          </label>
        )}

        <label>
          Настрій вранці:
          <select value={mood} onChange={(e) => setMood(e.target.value)}>
            <option value="good">Бадьорий</option>
            <option value="normal">Нормальний</option>
            <option value="bad">Поганий</option>
          </select>
        </label>
      </section>

      <section>
        <h3>3. Додаткові фактори</h3>

        <label>
          Використання гаджетів перед сном?
          <input type="checkbox" checked={usedGadgets} onChange={(e) => setUsedGadgets(e.target.checked)} />
        </label>

        {usedGadgets && (
          <label>
            Скільки хвилин?
            <input type="number" min="0" value={gadgetMinutes} onChange={(e) => setGadgetMinutes(e.target.value)} />
          </label>
        )}

        <label>
          Кофеїн / енергетики перед сном?
          <input type="checkbox" checked={caffeine} onChange={(e) => setCaffeine(e.target.checked)} />
        </label>

        {caffeine && (
          <label>
            Коли (час):
            <input type="time" value={caffeineWhen} onChange={(e) => setCaffeineWhen(e.target.value)} />
          </label>
        )}

        <label>
          Стрес перед сном (1-10):
          <input type="range" min="1" max="10" value={stress} onChange={(e) => setStress(e.target.value)} />
          {stress}
        </label>

        <label>
          Фізична активність:
          <select value={activity} onChange={(e) => setActivity(e.target.value)}>
            <option value="low">Низька</option>
            <option value="medium">Середня</option>
            <option value="high">Висока</option>
          </select>
        </label>

        <label>
          Час останнього прийому їжі:
          <input type="time" value={lastMeal} onChange={(e) => setLastMeal(e.target.value)} />
        </label>

        <label>
          Коротко про сни / кошмари:
          <textarea value={dreams} onChange={(e) => setDreams(e.target.value)} />
        </label>

        <label>
          Нотатки:
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
      </section>

      <div className="save-button">
        <button type="submit">Зберегти сьогоднішні дані</button>
      </div>
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Не всі дані заповнені</h3>
            <p>Заповни час засинання та пробудження, щоб продовжити.</p>
            <button onClick={() => setShowModal(false)}>Продовжити</button>
          </div>
        </div>
      )}
    </div>
  );
}
