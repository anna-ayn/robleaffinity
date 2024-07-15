import "../App.css";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const logOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      <Sidebar />
    </>
  );
}

export default Dashboard;
