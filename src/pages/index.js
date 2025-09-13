// src/pages/index.js
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function Home() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      // Carrega dados do vendedor atual
      const userRes = await fetch("/api/auth/current-token");
      if (!userRes.ok) throw new Error("Não autenticado");
      const userData = await userRes.json();

      // Busca nickname do vendedor
      const userInfoRes = await fetch(`/api/users/${userData.user_id}`);
      const userInfo = await userInfoRes.json();
      setUser({ ...userData, nickname: userInfo.nickname || "Sem nickname" });

      // Carrega pedidos do vendedor
      const ordersRes = await fetch(
        `/api/orders?seller_id=${userData.user_id}`
      );
      const ordersData = await ordersRes.json();
      setOrders(Array.isArray(ordersData.orders) ? ordersData.orders : []);
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
      window.location.href = "/api/auth/login";
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (shipmentId) => {
    window.open(`/zpl?shipment_id=${shipmentId}`, "_blank");
  };

  return (
    <Layout activePage="dashboard">
      <h1>🏠 Painel do Vendedor</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          {user && (
            <Card title="Informações do Vendedor">
              <p>
                <strong>Nickname:</strong> {user.nickname}
              </p>
              <p>
                <strong>ID:</strong> {user.user_id}
              </p>
              <p>
                <strong>Status:</strong> Conectado
              </p>
            </Card>
          )}

          <Card title="Pedidos Recentes" style={{ marginTop: "20px" }}>
            {orders.length === 0 ? (
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
                      <strong>Total:</strong> R${" "}
                      {order.total_amount?.toFixed(2)} <br />
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
          </Card>
        </>
      )}
    </Layout>
  );
}
