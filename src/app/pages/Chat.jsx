import "../App.css";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
export default function Chat() {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/getUserChatsAndInfo", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setChats(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        alert("Error fetching data");
      });
  }, []);

  return (
    <div className="flex" style={{ width: "1200px" }}>
      <Sidebar />
      <div className="ml-[15rem] flex-1 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {chats.map((chat) => (
            <div
              key={chat.id_chat}
              className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  {chat.nombre}
                </h2>
                <p className="text-gray-600">Age: {chat.edad}</p>
              </div>
              <div className="p-4">
                <p className="text-gray-700">Description: {chat.descripcion}</p>
                <p className="text-gray-700">Sex: {chat.sexo}</p>
              </div>
              <div className="p-4 border-t border-gray-200 text-center">
                {chat.fotos.length > 0 && (
                  <img
                    className="w-full h-auto rounded-md"
                    src={`data:image/jpeg;base64,${chat.fotos[0].r_foto}`}
                    alt="User"
                  />
                )}
              </div>
              <div className="p-4 border-t border-gray-200 text-center">
                <button
                  onClick={() =>
                    (window.location.href = `/chat/${chat.id_chat}/${chat.id_otro_usuario}`)
                  }
                  className="inline-block px-6 py-3 mt-4 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                >
                  Ir a chat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
