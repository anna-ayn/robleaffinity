const Sidebar = () => {
  const logOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div>
      <aside className="fixed top-0 left-0 z-40 pt-10 w-[250px] bg-[#996ff242] backdrop-blur-xl shadow-xl h-screen transition-transform -translate-x-full sm:translate-x-0 flex flex-col">
        <h3 className="text-2xl">Menu</h3>
        <div className="flex flex-col justify-evenly gap-72">
          <div className="mx-3 px-4 py-2 w-30 ">
            <button
              className="w-full px-4 py-2 mb-5 text-sm border-x-2 border-[#de5466] hover:animate-pulse hover:text-black"
              onClick={() => (window.location.href = "/Dashboard")}
            >
              Inicio
            </button>
            <button
              className="w-full px-4 py-2 mb-5 text-sm border-x-2 border-[#de5466] hover:animate-pulse hover:text-black"
              onClick={() => (window.location.href = "/MyProfile")}
            >
              Ver mi Perfil
            </button>
            <button
              className="w-full px-4 py-2 mb-5 text-sm border-x-2 border-[#de5466] hover:animate-pulse hover:text-black"
              onClick={() => (window.location.href = "/payments")}
            >
              Pagos
            </button>            
            <button
              className="w-full px-4 py-2 text-sm border-x-2 border-[#de5466] hover:animate-pulse hover:text-black"
              onClick={() => (window.location.href = "/settings")}
            >
              Configuracion del app y de preferencias
            </button>
          </div>
          <button
            onClick={logOut}
            className="bg-[#de5466] hover:bg-[#e02841] text-white font-bold py-2 px-4 m-3 rounded w-30 transition-colors duration-500"
          >
            Salir
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
