// src/pages/pedidos/index.js
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function Pedidos() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const userRes = await fetch("/api/auth/current-token");
      if (!userRes.ok) throw new Error("Não autenticado");
      const userData = await userRes.json();
      setUser(userData);

      const ordersRes = await fetch(
        `/api/orders?seller_id=${userData.user_id}`
      );
      const ordersData = await ordersRes.json();
      setOrders(Array.isArray(ordersData.orders) ? ordersData.orders : []);
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
      window.location.href = "/api/auth/login";
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (shipmentId) => {
    window.open(`/zpl?shipment_id=${shipmentId}`, "_blank");
  };

  return (
    <Layout activePage="pedidos">
      <h1>📦 Pedidos Recentes</h1>

      {loading ? (
        <p>Carregando pedidos...</p>
      ) : orders.length === 0 ? (
        <p>Nenhum pedido pronto para envio.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {orders.map((order) => (
            <li
              key={order.id}
              style={{
                border: "1px solid #ddd",
                margin: "10px 0",
                padding: "15px",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#f9f9f9",
              }}
            >
              <div>
                <strong>Pedido:</strong> {order.id} <br />
                <strong>Status:</strong> {order.status} <br />
                <strong>Data:</strong>{" "}
                {new Date(order.date_created).toLocaleString()} <br />
                <strong>Total:</strong> R${order.total_amount?.toFixed(2)}{" "}
                <br />
                <strong>Comprador:</strong> {order.buyer} <br />
                <strong>Shipment ID:</strong>{" "}
                {order.shipping?.id || "Não disponível"}
              </div>

              {order.shipping?.id ? (
                <Button onClick={() => handlePrint(order.shipping.id)}>
                  🖨️ Imprimir Etiqueta
                </Button>
              ) : (
                <span style={{ color: "#999", fontStyle: "italic" }}>
                  Sem etiqueta
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
