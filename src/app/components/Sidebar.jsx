const Sidebar = () => {
  const logOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div>
      <aside className="fixed top-10 left-0 z-40 w-80 h-screen transition-transform -translate-x-full sm:translate-x-0 flex flex-col">
        <h3>Menu</h3>
        <button className="pulse m-3 px-4 py-2 w-full text-sm">
          Ver mi Perfil
        </button>
        <button className="pulse m-3 px-4 py-2 w-full text-sm">
          Configuracion del app y de preferencias
        </button>
        <button
          onClick={logOut}
          className="bg-[#de5466] hover:bg-[#e02841] text-white font-bold py-2 px-4 m-3 rounded w-full"
        >
          Salir
        </button>
      </aside>
    </div>
  );
};

export default Sidebar;
