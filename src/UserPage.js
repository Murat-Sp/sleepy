
import { useParams } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";

export default function UsersPage() {
  const { id } = useParams();
  const [photo, setPhoto] = useState(null);
  const [User, setUserPage] = useState(null);
  const [newName,setNewName]=useState(null);
  const [newLastName,setNewLastName]=useState(null);
  const [newEmail,setNewEmail]=useState(null);
  const [repeatPassword,setRepeatPassword]=useState(null);
  const [newPassword,setNewPassword]=useState(null);
  useEffect(() => {
    if (!id) return;

    console.log("ID користувача з URL:", id);

    fetch(`http://localhost:5008/api/UserPage/${id}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Помилка при отриманні даних");
        return res.json();
      })
      .then((data) => {
        console.log("Дані користувача:", data);
        setUserPage(data);
      })
      .catch((err) => console.error(err));
}, [id]);
const handleSubmit = async (e) => {
    // e.preventDefault();
    if (!photo) {
      alert("Оберіть файл");
      return;
    }

    const formData = new FormData();
    formData.append("photo", photo);

    try {
      const res = await fetch(
        `http://localhost:5008/api/UserPage/setPhoto/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (res.ok) {
        // const data = await res.json();
        alert("Фото успішно завантажено");
        // setUserPage(data); // оновлюємо сторінку після завантаження
      } else {
        alert("Помилка при завантаженні фото");
      }
    } catch (error) {
      console.error("Помилка при fetch:", error);
      alert("Помилка при завантаженні фото");
    }
  };
  const handlePut = async (e) =>{
   const updateInfo = {
  newName,
  newLastName,
  newEmail,
  newPassword,
  repeatPassword
};

const checkinfo = {};
if (updateInfo.newName?.trim()) checkinfo.newName = updateInfo.newName;
if (updateInfo.newLastName?.trim()) checkinfo.newLastName = updateInfo.newLastName;
if (updateInfo.newEmail?.trim()) checkinfo.newEmail = updateInfo.newEmail;
if (updateInfo.repeatPassword?.trim()) checkinfo.repeatPassword = updateInfo.repeatPassword;
if (updateInfo.newPassword?.trim()) checkinfo.newPassword = updateInfo.newPassword;
if (Object.keys(checkinfo).length === 0) {
  alert("Немає змін для оновлення");
  return;
}else{
  console.log(JSON.stringify(checkinfo))
}

try {
  const response = await fetch(`http://localhost:5008/api/UpdateInfo/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(checkinfo),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Помилка сервера:", errText);
    alert("Помилка при оновленні даних");
    return;
  }

  const data = await response.json();
  alert("✅ Дані оновлено успішно!");
  console.log("Відповідь сервера:", data);
} catch (error) {
  console.error("Помилка при оновленні:", error);
}

  }
  return (
    <div className="main-user-info">
      <div className="user-header">
           {User?.photo ? (
               <img
                    src={`http://localhost:5008/uploads/${User.photo}`}
                    className="profile-img"
                    alt="User"
                    width="200"
                />) : (
                <img
                  src={`http://localhost:5008/uploads/avatar.jpg`}
                  className="avatar"
                  alt="Default"
                  width="200"
                />
             )}

           <h2 className="user-info">{User?.name}</h2>
           <h2 className="user-info">{User?.lastName}</h2>
      </div>
          <h3 className="additional-header">Додаткова інформація: </h3>
       <div>
          <p  className="additional-info"><span className="lable" >Емейл:</span>{User?.email}</p><br/>
          <p  className="additional-info"><span className="lable" >Вік: </span> {User?.age}</p><br/>
          <p  className="additional-info"><span className="lable" >Вага: </span>{User?.weight}</p><br/>
          <p  className="additional-info"><span className="lable" >Зріст:</span> {User?.height}</p>
      </div>
      <hr/>
       <form onSubmit={handlePut}>
          <div className="Update-info">
             <label className="update-lable">Змінити ім'я</label><br />
             <input type="text" className="update-input" placeholder={User?.name} value={newName} onChange={e => setNewName(e.target.value)}></input><br />
          </div>
          <div className="Update-info">
             <label className="update-lable">Змінити Прізвище </label><br />
             <input type="text" className="update-input" placeholder={User?.lastName} value={newLastName} onChange={e => setNewLastName(e.target.value)}></input><br />
          </div>
          <div className="Update-info">
             <label className="update-lable">Змінити email </label><br />
             <input type="text" className="update-input" placeholder={User?.email} value={newEmail} onChange={e => setNewEmail(e.target.value)}></input><br />
          </div>
          <div className="Update-info">
             <label className="update-lable">Змінити Пароль</label><br />
             <input type="password" className="update-input" placeholder="Новий пароль" value={newPassword} onChange={e => setNewPassword(e.target.value)}></input><br />
             <input type="password" className="update-input" placeholder="Повторіть пароль" value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)}></input><br />
          </div >
             <button type="submit" className="user-button">Змінити дані</button>
       <hr/>
       </form>
        <form className="upload-photo" encType="multipart/form-data" onSubmit={handleSubmit}>
        <label htmlFor="photo"className="update-lable">Оновити фото</label>
        <br />
        <input
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          required
        />
        <button className="log-button" type="submit">
          оновити зображення
        </button>
      </form>
    <a  className="log-out"href="/">Вийти з акаунту</a>
    </div>
  );
}
