import React, { useState, useContext, useEffect, use } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation, Link, Navigate } from "react-router-dom";
import NavBar from "./NavBar";
import Details from "./Details";
import Schedule from "./Schedule";
import MainHome from "./MainHome";
import AddSleep from "./AddPage";
import SleepAnalytics from "./Analytics";
import Chat from "./chat";
import AddUser from "./AddUserPage";
import Login from "./Login";
import Profile from "./UserPage";
import { UserContext } from "./UserContext";

function AppContent() {
  const location = useLocation();
  const { user, setUser, additionalInfo , setAdditionalInfo } = useContext(UserContext);
  useEffect(() => {
    console.log("[AppContent] location:", location.pathname, "context user:", user);
     const fetchSleepData = async () => {
      try {
        const response = await fetch(`http://localhost:5008/api/AdditionalInfo/allInfo/${user.id}`);
        if (!response.ok) {
          throw new Error("Помилка при отриманні даних");
        }

        const data = await response.json();
        setAdditionalInfo(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("❌ Помилка запиту:", error);
      }
    };

    fetchSleepData();
    console.log(additionalInfo)
    if (!user) {
      try {
        const raw = localStorage.getItem("user");
        if (raw) {
          const parsed = JSON.parse(raw);
          console.log("[AppContent] syncing user from localStorage:", parsed);
          setUser(parsed);
        }
      } catch (e) {
        console.error("[AppContent] cannot read localStorage user", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

 const convertToSlides = (additionalInfo) => {
  const infoArray = Array.isArray(additionalInfo) ? additionalInfo : [];
  if (!additionalInfo || additionalInfo.length === 0) {
    return [
      { id: "bedtime", label: "Час засипання", labels: [], data: [], borderColor: "blue" },
      { id: "sleepHours", label: "Час сну", labels: [], data: [], borderColor: "green" },
      { id: "sleepQuality", label: "Якість сну (%)", labels: [], data: [], borderColor: "purple" },
    ];
  }

  const labels = additionalInfo.map((d, i) => `День ${i + 1}`);

  return [
    {
      id: "bedtime",
      label: "Час засипання (години)",
      labels,
      data: additionalInfo.map((d) => {
        if (!d.BedTime) return null;
        const [hh, mm] = d.BedTime.split(":").map(Number);
        return +(hh + mm / 60).toFixed(2);
      }),
      borderColor: "blue",
    },
    {
      id: "sleepHours",
      label: "Тривалість сну (год.)",
      labels,
      data: additionalInfo.map((d) => Number(d.Duration) || 0),
      borderColor: "green",
    },
    {
      id: "sleepQuality",
      label: "Якість сну (%)",
      labels,
      data: additionalInfo.map((d) => Number(d.QualityPercent) || 0),
      borderColor: "purple",
    },
  ];
};


  const hideNav = location.pathname === "/" || location.pathname.startsWith("/addUser");

  return (
    <div className="App">
      <Routes>
        <Route
          path="/Home"
          element={
            user ? (
              <>
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
                  <Link to={`/profile/${user?.id}`}>
                    <img
                      className="avatar"
                      src={`http://localhost:5008/uploads/${user?.photo}`}
                      alt="avatar"
                    />
                  </Link>
                  <p>
                    {user?.name} {user?.lastName}
                  </p>
                </div>

                <MainHome additionalInfo={additionalInfo} />
                <Details slides={convertToSlides(additionalInfo)} />

                <div className="ScheduleFat">
                  <div className="Schedule"></div>
                  <div style={{ textAlign: "center", fontFamily: "Arial" }}>
                    <h1>sleep tracker</h1>
                    <Schedule slides={convertToSlides(additionalInfo)} />
                  </div>
                </div>
              </>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route path="/addUser" element={<AddUser />} />
        <Route path="/" element={<Login />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/add" element={<AddSleep />} />
        <Route path="/analytics" element={<SleepAnalytics additionalInfoRecords={additionalInfo} />} />
        <Route path="/chat" element={<Chat additionalInfoRecords={additionalInfo} />} />
      </Routes>

      {!hideNav && (
        <div className="NavBarFull">
          <NavBar />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
