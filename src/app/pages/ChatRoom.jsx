import { useState, useEffect } from 'react';
import { AiOutlinePaperClip, AiOutlineSend } from 'react-icons/ai'; // Para íconos de enviar y adjuntar
import { useParams } from 'react-router-dom';

const ChatRoom = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hola, ¿cómo estás?', sender: 'other' },
    { id: 2, text: '¡Hola! Estoy bien, ¿y tú?', sender: 'self' },
  ]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { idChat, idOtroUsuario } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/getPublicDataOfUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ otherUserId: idOtroUsuario }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [idOtroUsuario]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: message, sender: 'self' }]);
      setMessage('');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto border border-gray-200 rounded-lg shadow-md" style={{ width: "1200px" }}>
      <div className="p-4 border-b border-gray-200 flex items-center space-x-4 bg-white">
        {userData && (
          <>
            {userData.fotos.length > 0 && (
              <img
                className="w-12 h-12 rounded-full"
                src={`data:image/jpeg;base64,${userData.fotos[0].r_foto}`}
                alt="User"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {userData.nombre} {userData.apellido}
              </h2>
            </div>
          </>
        )}
      </div>

      {/* Messages Section */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'self' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-3 rounded-lg ${msg.sender === 'self' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-100 border-t border-gray-200 p-4 flex items-center">
        <input
          type="file"
          id="file-upload"
          className="hidden"
        />
        <label htmlFor="file-upload" className="mr-2 cursor-pointer text-gray-500 hover:text-gray-700">
          <AiOutlinePaperClip size={24} />
        </label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <AiOutlineSend size={24} />
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;

