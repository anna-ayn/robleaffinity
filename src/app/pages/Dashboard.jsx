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

  const insertlike = () => {
    fetch("http://localhost:3001/api/likeOrSwipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        targetUserId: dataOfUsersToDisplay[0],
        action: "like",
      }),
    }).then((res) => {
      if (res.error) {
        alert(res.error);
      } else {
        res.json().then(async (res) => {
          console.log(res);
        });
      }
    });
  };

  const insertSwipe = () => {
    fetch("http://localhost:3001/api/likeOrSwipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        targetUserId: dataOfUsersToDisplay[0],
        action: "dislike",
      }),
    }).then((res) => {
      if (res.error) {
        alert(res.error);
      } else {
        res.json().then(async (res) => {
          console.log(res);
        });
      }
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
                  onClick={insertSwipe}
                >
                  Dislike
                </button>
                <button
                  className="bg-blue-500 text-white rounded-md p-2"
                  onClick={insertlike}
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
