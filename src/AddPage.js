// src/AddSleep.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * AddSleep збирає розширені дані і обчислює:
 * - duration (в годинах, float)
 * - qualityPercent (0-100) за алгоритмом
 * - qualityScale (1-10)
 *
 * Потім викликає addSleepRecord(record) і повертає користувача на "/"
 */

export default function AddSleep({ addSleepRecord }) {
  const navigate = useNavigate();

  const [bedtime, setBedtime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [wakeUps, setWakeUps] = useState(0);
  const [difficultyFallingAsleep, setDifficultyFallingAsleep] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState(3); // 1-10
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

  // розрахунок тривалості у годинах (float)
  const calcDuration = (bt, wt) => {
    if (!bt || !wt) return 0;
    const [bh, bm] = bt.split(":").map(Number);
    const [wh, wm] = wt.split(":").map(Number);
    let start = bh * 60 + bm;
    let end = wh * 60 + wm;
    if (end <= start) end += 24 * 60; // прокинувся наступного дня
    const diffMin = end - start;
    return +(diffMin / 60).toFixed(2);
  };

  // алгоритм визначення якості у відсотках
  const computeQualityPercent = (rec) => {
    let score = 100;

    // тривалість
    if (rec.duration < 6) score -= 20;
    else if (rec.duration < 7) score -= 10;
    else if (rec.duration > 9) score -= 5;

    // важко заснути
    if (rec.difficultyFallingAsleep) {
      score -= 10;
      score -= Math.min(rec.difficultyLevel * 1.5, 10);
    }

    // прокидань
    score -= Math.min(rec.wakeUps * 10, 30);

    // гаджети
    if (rec.usedGadgets) {
      score -= 10;
      score -= Math.min(Math.floor(rec.gadgetMinutes / 10), 10);
    }

    // кофеїн
    if (rec.caffeine) score -= 8;

    // стрес
    if (rec.stress > 5) score -= (rec.stress - 5) * 4;

    // настрій
    if (rec.mood === "bad") score -= 12;
    else if (rec.mood === "normal") score -= 3;

    // дуже пізно лягав (>01:00)
    if (rec.bedtime) {
      const [hh] = rec.bedtime.split(":").map(Number);
      if (hh >= 1 && hh <= 4) score -= 8;
    }

    // нормалізуємо
    if (score < 0) score = 0;
    if (score > 100) score = 100;

    return Math.round(score);
  };

  const handleSave = () => {
    const duration = calcDuration(bedtime, wakeTime);

    const record = {
      date: new Date().toLocaleDateString(),
      bedtime,
      wakeTime,
      duration,
      wakeUps: Number(wakeUps),
      difficultyFallingAsleep,
      difficultyLevel: Number(difficultyLevel),
      mood,
      usedGadgets,
      gadgetMinutes: Number(gadgetMinutes),
      caffeine,
      caffeineWhen,
      stress: Number(stress),
      activity,
      lastMeal,
      dreams,
      notes,
    };

    // якість алгоритмічно
    const qualityPercent = computeQualityPercent(record);
    const qualityScale = Math.max(1, Math.round(qualityPercent / 10));
    record.qualityPercent = qualityPercent;
    record.qualityScale = qualityScale;

    // додаємо запис у масив (App передасть addSleepRecord)
    addSleepRecord(record);

    // повертаємося на головну
    navigate("/");

    // (не використовуємо localStorage — друг потім зможе серіалізувати масив sleepData)
  };

  return (
    <div className="add-page" style={{ padding: 16 }}>
      <h2>Додати інформацію про сон</h2>

      <h3>1. Основні</h3>
      <label>
        Час засинання:
        <input type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)} />
      </label>

      <label>
        Час пробудження:
        <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} />
      </label>

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
          <option value="bad">Розбитий / Поганий</option>
        </select>
      </label>

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

      <div style={{ marginTop: 12 }}>
        <button onClick={handleSave} style={{ padding: "10px 16px" }}>
          Зберегти сьогоднішні дані
        </button>
      </div>
    </div>
  );
}
