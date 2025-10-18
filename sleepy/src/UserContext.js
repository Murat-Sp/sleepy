import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error("UserProvider: cannot parse user from localStorage", e);
      return null; // <- повертаємо null, raw тут не потрібен
    }
  });

  const [additionalInfo, setAdditionalInfo] = useState(() => {
    try {
      const raw = localStorage.getItem("additionalInfo");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("UserProvider: cannot parse additionalInfo from localStorage", e);
      return []; // <- повертаємо порожній масив
    }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem("user", JSON.stringify(user));
      else localStorage.removeItem("user");
    } catch (e) {
      console.error("UserProvider: cannot write user to localStorage", e);
    }

    try {
      if (additionalInfo) localStorage.setItem("additionalInfo", JSON.stringify(additionalInfo));
      else localStorage.removeItem("additionalInfo");
    } catch (e) {
      console.error("UserProvider: cannot write additionalInfo to localStorage", e);
    }
  }, [user, additionalInfo]);

  return (
    <UserContext.Provider value={{ user, setUser, additionalInfo, setAdditionalInfo }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
