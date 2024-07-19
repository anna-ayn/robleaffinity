import "../App.css";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import Profile from "./Profile";

function Dashboard() {
  const [dataOfUsersToDisplay, setDataOfUsersToDisplay] = useState();

  useEffect(() => {
    fetch("http://localhost:3001/api/getPeopleByPreferences", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.error) {
        alert(res.error);
      } else {
        res.json().then(async (res) => {
          console.log(res);
          setDataOfUsersToDisplay(res);
        });
      }
    });
  }, []);

  const insertlike = (user, isSuper) => {
    const action = isSuper ? "superlike" : "like";
    fetch("http://localhost:3001/api/likeOrSwipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        targetUserId: user,
        action: action,
      }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Like dado con éxito");
          return response.text();
        } else {
          response.text().then((text) => {
            alert(Error(text));
          });
          console.log(
            response.text().then((text) => {
              throw new Error(text);
            })
          );
        }
      })
      .catch((error) => {
        alert("Error 500 al dar like: ", error);
      });
  };

  const insertSwipe = (user) => {
    fetch("http://localhost:3001/api/likeOrSwipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        targetUserId: user,
        action: "dislike",
      }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Dislike exitoso");
          return response.text();
        } else {
          response.text().then((text) => {
            alert(Error(text));
          });
          console.log(
            response.text().then((text) => {
              throw new Error(text);
            })
          );
        }
      })
      .catch((error) => {
        alert("Error 500 al dar dislike: ", error);
      });
  };

  return (
    <>
      <Sidebar />
      {dataOfUsersToDisplay ? (
        <div>
          {dataOfUsersToDisplay.map((user) => (
            <div key={user} className="my-10 justify-center">
              <Profile id_usuario={user} />
              <div className="ml-[15rem] mt-5 flex flex-row justify-around ">
                <button
                  className="bg-red-500 text-white rounded-md p-2"
                  onClick={() => insertSwipe(user)}
                >
                  Dislike
                </button>
                <button
                  className="bg-green-500 text-white rounded-md p-2"
                  onClick={() => insertlike(user, true)}
                >
                  Superlike
                </button>
                <button
                  className="bg-blue-500 text-white rounded-md p-2"
                  onClick={() => insertlike(user, false)}
                >
                  Like
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>loading...</div>
      )}
    </>
  );
}

export default Dashboard;
