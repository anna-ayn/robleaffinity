import "../App.css";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

function Dashboard() {
  const [dataOfUsersToDisplay, setDataOfUsersToDisplay] = useState()

  useEffect(() => {
    console.log("Epa")
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
        });
      }
    });
  }, []);


  return (
    <>
      <Sidebar />
    </>
  );
}

export default Dashboard;
