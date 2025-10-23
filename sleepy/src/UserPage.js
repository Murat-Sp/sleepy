
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState,useContext } from "react";
import { UserContext } from "./UserContext";
import "./UserPage.css";

export default function UsersPage() {
  const { id } = useParams();
  const [photo, setPhoto] = useState(null);
  const {user,setUser} = useContext(UserContext);
  const [newName,setNewName]=useState(null);
  const [newLastName,setNewLastName]=useState(null);
  const [newEmail,setNewEmail]=useState(null);
  const [repeatPassword,setRepeatPassword]=useState(null);
  const [newPassword,setNewPassword]=useState(null);
  // const [User,setUser]=useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`http://localhost:5008/api/UserPage/user`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok){
          throw new Error("Помилка при отриманні даних");
        }
        if(res.status===401)navigate("/");
        return res.json();
      })
      .then((data) => {
        console.log("Дані користувача:", data.user);
        setUser(data.user);
        if(data.loggedIn){
          console.log("Сесія активна")
        }
      })
      .catch((err) => console.error(err));
  }, []);
const handleSubmit = async (e) => {
  // e.preventDefault(); // краще залишити, якщо це форма

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
    const responseText = await res.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = null;
    }

    if (res.ok) {
      console.log("Сервер повернув:", data || responseText);

      if (data?.message) alert(data.message);
      if (data?.userData) setUser(data.userData);

      if (res.status === 401) {
        navigate("/");
      } else {
        console.log("Фото оновлено!");
      }
    } else {
      console.error("Помилка HTTP:", res.status, responseText);
      alert("Помилка при завантаженні фото");
    }
  } catch (error) {
    console.error("Помилка при fetch:", error);
    alert("Помилка при завантаженні фото (fetch не вдався)");
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
  const response = await fetch(`http://localhost:5008/api/UpdateInfo`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(checkinfo),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Помилка сервера:", errText);
    alert("Помилка при оновленні даних");
    return;
  }
  if(response.status===401)navigate("/");
  const data = await response.json();
  alert(data.message);
  console.log("Відповідь сервера:", data.userData);
} catch (error) {
  console.error("Помилка при оновленні:", error);
}

};
const handleDelete = async (e) => {
   const confirmed = window.confirm("Ви точно хочете видалити акаунт?")
  if(confirmed){
     try{
      const res = await fetch(`http://localhost:5008/api/UserPage/delete`,{
      method:"DELETE",
      credentials: "include",
     });
     if(res.ok){
      alert("Акаунт видалено")
      navigate("/")
     }
     else{
      alert("Видалити невдалось")
     }
     }
       catch(error){
        
        console.error("Невдалось відправити запит",error)

      }
  }
};
const handleLogOut = async (e)=>{
 const response = await fetch("http://localhost:5008/api/Login/logout", {
      method: "POST",
      credentials: "include",
    });
    if(response.ok){
      const data = await response.json();
      alert(data.message);
    }
    // navigate("/");
};
  return (
    <div className="main-user-info">
      <div className="user-header">
           {user?.photo ? (
               <img
                    src={`http://localhost:5008/uploads/${user?.photo}`}
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

           <h2 className="user-info">{user?.name}</h2>
           <h2 className="user-info">{user?.lastName}</h2>
      </div>
          <h3 className="additional-header">Додаткова інформація: </h3>
       <div>
          <p  className="additional-info"><span className="lable" >Емейл:</span>{user?.email}</p><br/>
          <p  className="additional-info"><span className="lable" >Вік: </span> {user?.age}</p><br/>
          <p  className="additional-info"><span className="lable" >Вага: </span>{user?.weight}</p><br/>
          <p  className="additional-info"><span className="lable" >Зріст:</span> {user?.height}</p>
      </div>
      <hr/>
       <form onSubmit={handlePut}>
          <div className="Update-info">
             <label className="update-lable">Змінити ім'я</label><br />
             <input type="text" className="update-input" placeholder={user?.name} value={newName} onChange={e => setNewName(e.target.value)}></input><br />
          </div>
          <div className="Update-info">
             <label className="update-lable">Змінити Прізвище </label><br />
             <input type="text" className="update-input" placeholder={user?.lastName} value={newLastName} onChange={e => setNewLastName(e.target.value)}></input><br />
          </div>
          <div className="Update-info">
             <label className="update-lable">Змінити email </label><br />
             <input type="text" className="update-input" placeholder={user?.email} value={newEmail} onChange={e => setNewEmail(e.target.value)}></input><br />
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
     <a href="/" className="log-out" onClick={handleLogOut}>Вийти з акаунту</a>
     <button type="submit" className="user-button" onClick={handleDelete}>Видалити акаунт</button>
    </div>
  );
}
