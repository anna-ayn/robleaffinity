import { useState } from 'react';
import { AiOutlinePaperClip, AiOutlineSend } from 'react-icons/ai'; // Para íconos de enviar y adjuntar

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hola, ¿cómo estás?', sender: 'other' },
    { id: 2, text: '¡Hola! Estoy bien, ¿y tú?', sender: 'self' },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: message, sender: 'self' }]);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto border border-gray-200 rounded-lg shadow-md" style={{ width: "1200px" }}>
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

export default Chat;
