import React, { useEffect, useState } from 'react';
import Sidebar from "../components/Sidebar";

const Pagos = () => {
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);
  const [cards, setCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState('');
  const [amount, setAmount] = useState('');

 /* useEffect(() => {
    // Obtener la suscripción actual
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/subscription');
        const data = await response.json();
        setSubscription(data);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      }
    };

    // Obtener la lista de pagos
    const fetchPayments = async () => {
      try {
        const response = await fetch('/api/payments');
        const data = await response.json();
        setPayments(data);
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    fetchSubscription();
    fetchPayments();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      // Obtener la lista de tarjetas
      const fetchCards = async () => {
        try {
          const response = await fetch('/api/cards');
          const data = await response.json();
          setCards(data);
        } catch (error) {
          console.error('Error fetching cards:', error);
        }
      };

      fetchCards();
    }
  }, [isModalOpen]);*/

  const handleCancelSubscription = async () => {
    try {
      await fetch('/api/subscription', {
        method: 'DELETE',
      });
      window.location.reload();
    } catch (error) {
      console.error('Error canceling subscription:', error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitPayment = async (event) => {
    event.preventDefault();
    try {
      await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId: selectedCard,
          amount,
        }),
      });
      handleCloseModal();
      window.location.reload();
    } catch (error) {
      console.error('Error submitting payment:', error);
    }
  };

  return (
    <>
      <Sidebar />
      <div style={{width: "1200px"}}>
        <div className="text-right">
          <div className="mb-2">
            {subscription ? `Suscripción actual: ${subscription.name}` : 'No tienes una suscripción activa'}
          </div>
          {subscription && (
            <button onClick={handleCancelSubscription} className="bg-red-500 text-black px-4 py-2 rounded">
              Cancelar suscripción
            </button>
          )}
        </div>
        <div className="flex justify-center p-4">
          <button onClick={handleOpenModal} className="bg-green-500 text-black px-4 py-2 rounded">
            Hacer Pago
          </button>
        </div>
        <div>
          <div className="p-4">
            <table className="min-w-full bg-white w-full text-black">
              <thead>
                <tr>
                  <th className="py-2">ID Pago</th>
                  <th className="py-2">Número de Factura</th>
                  <th className="py-2">Estado</th>
                  <th className="py-2">Monto</th>
                  <th className="py-2">Fecha</th>
                  <th className="py-2">Documento Factura</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.r_id_pago}>
                    <td className="py-2">{payment.r_id_pago}</td>
                    <td className="py-2">{payment.r_numero_factura}</td>
                    <td className="py-2">{payment.r_estado ? 'Pagado' : 'Pendiente'}</td>
                    <td className="py-2">{payment.r_monto}</td>
                    <td className="py-2">{payment.r_fecha}</td>
                    <td className="py-2">{payment.r_documento_factura}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded">
                <h2 className="text-xl mb-4 text-black">Hacer Pago</h2>
                <form onSubmit={handleSubmitPayment}>
                  <div className="mb-4">
                    <label className="block mb-2 text-black">Tarjeta</label>
                    <select
                      value={selectedCard}
                      onChange={(e) => setSelectedCard(e.target.value)}
                      className="w-full border p-2 rounded text-black"
                    >
                      {cards.map((card) => (
                        <option key={card.id} value={card.id}>
                          {card.number} - {card.type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-black">Monto</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full border p-2 rounded text-black"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button type="button" onClick={handleCloseModal} className="bg-gray-500 text-black px-4 py-2 rounded mr-2">
                      Cancelar
                    </button>
                    <button type="submit" className="bg-blue-500 text-black px-4 py-2 rounded">
                      Pagar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
  
  
};

export default Pagos;
