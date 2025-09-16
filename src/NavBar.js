import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();
  const [active, setActive] = useState("home");

  const items = [
    { id: "home", to: "/", img: "/png/home.png", imgActive: "/png/home-active.png" },
    { id: "add", to: "/add", img: "/png/plus.png", imgActive: "/png/plus-active.png" },
    { id: "stats", to: "/stats", img: "/png/stats.png", imgActive: "/png/stats-active.png" },
    { id: "chat", to: "/chat", img: "/png/chat.png", imgActive: "/png/chat-active.png" }
  ];

  // синхронізуємо активний пункт з поточним шляхом
  useEffect(() => {
    const current = items.find(item => item.to === location.pathname);
    if (current) setActive(current.id);
  }, [location.pathname]);

  return (
    <div className="navbar">
      {items.map((item) => (
        <NavLink 
          key={item.id} 
          to={item.to} 
          className="nav-link"
          onClick={() => setActive(item.id)}
        >
          <div className={`nav-item ${active === item.id ? "active" : ""}`}>
            <img
              src={active === item.id ? item.imgActive : item.img}
              alt={item.id}
            />
          </div>
        </NavLink>
      ))}
    </div>
  );
};

export default NavBar;
