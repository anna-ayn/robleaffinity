import "../App.css";

function Dashboard() {
  const logOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      <h1>Home</h1>
      <p>¡Bienvenido!</p>
      <p>¡Ya estás logueado!</p>

      <div className="flex flex-col">
        <button className="pulse m-3 p-3">Ver mi Perfil</button>
        <button className="pulse m-3 p-3">
          Configuracion del app y de preferencias
        </button>
        <button
          onClick={logOut}
          className="bg-[#de5466] hover:bg-[#e02841] text-white font-bold py-2 px-4 rounded"
        >
          Salir
        </button>
      </div>
    </>
  );
}

export default Dashboard;
