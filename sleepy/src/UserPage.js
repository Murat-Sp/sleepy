import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "./UserContext";
import "./UserPage.css";

export default function UsersPage() {
  const { id } = useParams();
  const [photo, setPhoto] = useState(null);
  const { user, setUser } = useContext(UserContext);
  const [newName, setNewName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    fetch(`http://localhost:5008/api/UserPage/user`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) navigate("/");
        if (!res.ok) throw new Error("Помилка при отриманні даних");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        if (data.loggedIn) console.log("Сесія активна");
      })
      .catch((err) => console.error(err));
  }, [navigate, setUser]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo) {
      alert("Оберіть файл");
      return;
    }

    const formData = new FormData();
    formData.append("photo", photo);

    try {
      const res = await fetch("http://localhost:5008/api/UserPage/setPhoto", {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (res.status === 401) {
        navigate("/");
        return;
      }

      const responseText = await res.text();
      let data = {};
      try {
        data = JSON.parse(responseText);
      } catch {
       
      }

      if (!res.ok) {
        alert(data?.message || "Помилка при завантаженні фото");
        return;
      }

      alert(data?.message || "Фото успішно оновлено!");
      window.location.reload();
      if (data?.userData) setUser(data.userData);
    } catch (error) {
      console.error("Помилка при fetch:", error);
      alert("Помилка при з'єднанні з сервером");
    }
  };


  const handlePut = async (e) => {
    e.preventDefault();

    const updateInfo = {
      newName,
      newLastName,
      newEmail,
      newPassword,
      repeatPassword,
    };

    const checkinfo = {};
    if (updateInfo.newName?.trim()) checkinfo.newName = updateInfo.newName;
    if (updateInfo.newLastName?.trim())
      checkinfo.newLastName = updateInfo.newLastName;
    if (updateInfo.newEmail?.trim()) checkinfo.newEmail = updateInfo.newEmail;
    if (updateInfo.repeatPassword?.trim())
      checkinfo.repeatPassword = updateInfo.repeatPassword;
    if (updateInfo.newPassword?.trim())
      checkinfo.newPassword = updateInfo.newPassword;

    if (Object.keys(checkinfo).length === 0) {
      alert("Немає змін для оновлення");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5008/api/UpdateInfo`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(checkinfo),
      });

      if (response.status === 401) {
        navigate("/");
        return;
      }

      if (!response.ok) {
        const errText = await response.text();
        console.error("Помилка сервера:", errText);
        alert("Помилка при оновленні даних");
        return;
      }

      const data = await response.json();
      alert(data.message || "Дані успішно оновлені!");
      console.log("Відповідь сервера:", data.userData);
    } catch (error) {
      console.error("Помилка при оновленні:", error);
      alert("Помилка при з'єднанні з сервером");
    }
  };


  const handleDelete = async () => {
    const confirmed = window.confirm("Ви точно хочете видалити акаунт?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:5008/api/UserPage/delete`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        alert("Акаунт видалено");
        navigate("/");
      } else {
        alert("Видалити не вдалося");
      }
    } catch (error) {
      console.error("Невдалось відправити запит", error);
      alert("Помилка при з'єднанні з сервером");
    }
  };


  const handleLogOut = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5008/api/Login/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || "Вихід успішний");
        navigate("/");
      } else {
        alert("Не вдалося вийти");
      }
    } catch (error) {
      console.error("Помилка при виході:", error);
      alert("Помилка при з'єднанні з сервером");
    }
  };

  return (
    <div className="main-user-info">
      <div className="user-header">
        {user?.photo ? (
          <img
            src={`http://localhost:5008/uploads/${user.photo}`}
            className="profile-img"
            alt="User"
            width="200"
          />
        ) : (
          <img
            src={`http://localhost:5008/uploads/avatar.jpg`}
            className="avatar"
            alt="Default"
            width="200"
          />
        )}

        <h2 className="user-info">{user?.name}</h2>
        <h2 className="user-info">{user?.lastName}</h2>
      </div>

      <h3 className="additional-header">Додаткова інформація:</h3>
      <div>
        <p className="additional-info">
          <span className="lable">Емейл:</span> {user?.email}
        </p>
        <p className="additional-info">
          <span className="lable">Вік:</span> {user?.age}
        </p>
        <p className="additional-info">
          <span className="lable">Вага:</span> {user?.weight}
        </p>
        <p className="additional-info">
          <span className="lable">Зріст:</span> {user?.height}
        </p>
      </div>

      <hr />

      <form onSubmit={handlePut}>
        <div className="Update-info">
          <label className="update-lable">Змінити ім'я</label>
          <input
            type="text"
            className="update-input"
            placeholder={user?.name}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>

        <div className="Update-info">
          <label className="update-lable">Змінити прізвище</label>
          <input
            type="text"
            className="update-input"
            placeholder={user?.lastName}
            value={newLastName}
            onChange={(e) => setNewLastName(e.target.value)}
          />
        </div>

        <div className="Update-info">
          <label className="update-lable">Змінити email</label>
          <input
            type="text"
            className="update-input"
            placeholder={user?.email}
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>

        <div className="Update-info">
          <label className="update-lable">Змінити пароль</label>
          <input
            type="password"
            className="update-input"
            placeholder="Новий пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            className="update-input"
            placeholder="Повторіть пароль"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="user-button">
          Змінити дані
        </button>
      </form>

      <hr />

      <form
        className="upload-photo"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <label htmlFor="photo" className="update-lable">
          Оновити фото
        </label>
        <input
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          required
        />
        <button className="log-button" type="submit">
          Оновити зображення
        </button>
      </form>
      <a href="/" className="log-out" onClick={handleLogOut}>
        Вийти з акаунту
      </a>

      <button type="button" className="user-button" onClick={handleDelete}>
        Видалити акаунт
      </button>
    </div>
  );
}
