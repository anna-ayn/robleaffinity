import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";

const Pagos = () => {
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);
  const [cards, setCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState("");
  const [selectedTier, setSelectedTier] = useState("");
  const [tiers, setTiers] = useState([]);
  const [plazoTier, setPlazoTier] = useState("1");

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/getTiers");
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        const data = await response.json();
        setTiers(data);
        if (data.length > 0) setSelectedTier(data[0].nombre_tier);
      } catch (error) {
        console.error("Error fetching tiers:", error);
      }
    };

    const getDataOfCards = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/getDataOfCards",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        const data = await response.json();
        if (data.length > 0) setSelectedCard(data[0].digitos_tarjeta);
        setCards(data);
      } catch (error) {
        console.error("Error fetching card data:", error);
      }
    };

    const getPayments = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/getPagos", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        const data = await response.json();
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    const getActiveSubscription = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/getActiveSubscriptionUser",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        const data = await response.json();

        if (
          data.get_active_subscription_user !== "No tiene subscripción activa"
        )
          setSubscription(data.get_active_subscription_user);
      } catch (error) {
        console.error("Error fetching active subscription:", error);
      }
    };

    fetchTiers();
    getDataOfCards();
    getPayments();
    getActiveSubscription();
  }, []);

  const handleCancelSubscription = async () => {
    try {
      await fetch("http://localhost:3001/api/subscription", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error canceling subscription:", error);
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

    // Extraer valores del estado
    const tierActual = tiers.find((currentTier) => currentTier.nombre_tier);
    const nombreTierUsuario = tierActual.nombre_tier;
    const precio_tier = parseFloat(tierActual.monto_tier);
    const plazoTierValue = parseInt(plazoTier);
    const digitosTarjetaUsuario = selectedCard;
    const estadoPagoValue = true;
    const montoPagoValue = precio_tier * plazoTierValue;

    try {
      await fetch("http://localhost:3001/api/subscribeUserToTier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          nombre_tier_usuario: nombreTierUsuario,
          plazo_tier: plazoTierValue,
          digitos_tarjeta_usario: digitosTarjetaUsuario,
          estado_pago: estadoPagoValue,
          monto_pago: montoPagoValue,
        }),
      });

      handleCloseModal();
    } catch (error) {
      console.error("Error submitting payment:", error);
    }
  };

  return (
    <>
      <Sidebar />
      <div style={{ width: "1200px" }}>
        <div className="text-right">
          <div className="mb-2">
            {subscription
              ? `Suscripción actual: ${subscription}`
              : "No tienes una suscripción activa"}
          </div>
        </div>
        <div className="flex justify-center p-4">
          <button
            onClick={handleOpenModal}
            className="bg-green-500 text-black px-4 py-2 rounded"
          >
            Hacer Pago
          </button>
        </div>
        <div>
          <div className="p-4 ml-[15rem]">
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
                    <td className="py-2">
                      {payment.r_estado ? "Pagado" : "Pendiente"}
                    </td>
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
              <div className="bg-white p-4 rounded" style={{ width: "600px" }}>
                <h2 className="text-xl mb-4 text-black">Hacer Pago</h2>
                <form onSubmit={handleSubmitPayment}>
                  <div className="mb-4">
                    <label className="block mb-2 text-black">Tarjeta</label>
                    <select
                      value={selectedCard}
                      onChange={(e) => setSelectedCard(e.target.value)}
                      className="w-full border p-2 rounded text-black"
                    >
                      {cards.map((card, i) => (
                        <option key={i} value={card.digitos_tarjeta}>
                          {card.digitos_tarjeta}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-black">Tier</label>
                    <select
                      value={selectedTier}
                      onChange={(e) => setSelectedTier(e.target.value)}
                      className="w-full border p-2 rounded text-black"
                      onClick={() => console.log(tiers)}
                    >
                      {tiers.map((tier) => (
                        <option key={tier.nombre_tier} value={tier.nombre_tier}>
                          {tier.nombre_tier} - ${tier.monto_tier}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-black">
                      Plazo del Tier
                    </label>
                    <select
                      value={plazoTier}
                      onChange={(e) => setPlazoTier(e.target.value)}
                      className="w-full border p-2 rounded text-black"
                    >
                      <option value={1}>1</option>
                      <option value={3}>3</option>
                      <option value={6}>6</option>
                      <option value={12}>12</option>
                    </select>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="bg-gray-500 text-black px-4 py-2 rounded mr-2"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-black px-4 py-2 rounded"
                    >
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

{
  /*isModalOpen && (
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
                      {cards.map((card, i) => (
                        <option key={card.id} value={card.digitos_tarjeta}>
                          {card.digitos_tarjeta}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-black">Tier</label>
                    <select
                      value={selectedTier}
                      onChange={(e) => setSelectedTier(e.target.value)}
                      className="w-full border p-2 rounded text-black"
                    >
                      {tiers.map((tier, i) => (
                        <option key={i} value={tier.nombre_tier}>
                          {tier.nombre_tier} - ${tier.monto_tier}
                        </option>
                      ))}
                    </select>
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
          )*/
}
