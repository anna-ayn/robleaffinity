import React, { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";

const CardTable = () => {
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [titular, setTitular] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [typeCard, setTypeCard] = useState('Credito');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const getCards = async () => {
      try {
        const data = await fetch("http://localhost:3001/api/getDataOfCards", {
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
                setCards(res);
              });
            }
          });        
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    getCards();
  }, []);

  const handleDelete = async (card_number) => {
    try {
      const dataJSON = {
        card_number,
      };

      fetch("http://localhost:3001/api/deleteRegisterInstance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(dataJSON),
      }).then((res) => {
        if (res.error) {
          alert(res.error);
        } else {
          res.json().then(async (res) => {
            console.log(res);
          });
        }
      });

      setCards(cards.filter(card => card.digitos_tarjeta !== card_number));
      setMessage('Tarjeta eliminada correctamente');
      setError('');
    } catch (error) {
      setError('Error al eliminar la tarjeta');
      setMessage('');
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3001/api/insertUserCard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          card_number: cardNumber,
          titular: titular,
          due_date: dueDate,
          cvv: cvv,
          type_card: typeCard,
        }),
      });

      const data = await fetch("http://localhost:3001/api/getDataOfCards", {
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
            setCards(res);
          });
        }
      });
      
      setShowModal(false);
      setMessage('Tarjeta agregada correctamente');
      setError('');
    } catch (error) {
      setError('Error al agregar la tarjeta');
      setMessage('');
    }
  };

  return (
    <>
    <Sidebar />
    <div className="p-4">
      <button
        onClick={() => setShowModal(true)}
        className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Agregar Nueva Tarjeta
      </button>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Número de Tarjeta
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Titular
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha de Vencimiento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              CVV
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo de Tarjeta
            </th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200" onClick={()=>console.log(cards)}>
          {cards?.map((card, i) => (
            <tr key={i}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{card.digitos_tarjeta}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{card.nombre_titular}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{card.fecha_caducidad}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{card.codigo_cv}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{card.tipo}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleDelete(card.digitos_tarjeta)}
                  className="text-red-600 hover:text-red-900"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Agregar Nueva Tarjeta</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black">Número de Tarjeta:</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-black focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Titular:</label>
                <input
                  type="text"
                  value={titular}
                  onChange={(e) => setTitular(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-black focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Fecha de Vencimiento:</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-black focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">CVV:</label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-black focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Tipo de Tarjeta:</label>
                <select
                  value={typeCard}
                  onChange={(e) => setTypeCard(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-black focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="Credito">Credito</option>
                  <option value="Debito">Debito</option>
                </select>
              </div>
              <button
                onClick={() => handleSubmit()}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Agregar Tarjeta
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full mt-2 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cerrar
              </button>
            </div>
            {message && <p className="mt-4 text-green-600">{message}</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default CardTable;

