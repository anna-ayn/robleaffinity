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

  return (
    <>
      <Sidebar />
      {dataOfUsersToDisplay ? (
        <div>
          {dataOfUsersToDisplay.map((user) => (
            <div key={user} className="my-10 justify-center">
              <Profile id_usuario={user} />
              <div className="ml-[15rem] mx-96 flex flex-row justify-around ">
                <button className="bg-blue-500 text-white rounded-md p-2">
                  Like
                </button>
                <button className="bg-red-500 text-white rounded-md p-2">
                  Dislike
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
