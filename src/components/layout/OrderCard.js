// components/OrderCard.js
import Button from "./Button";

export default function OrderCard({ order, onPrint }) {
  return (
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
        <strong>Data:</strong> {new Date(order.date_created).toLocaleString()}{" "}
        <br />
        <strong>Total:</strong> R$ {order.total_amount?.toFixed(2)} <br />
        <strong>Comprador:</strong> {order.buyer} <br />
        <strong>Shipment ID:</strong> {order.shipping?.id || "Não disponível"}
      </div>

      {order.shipping?.id ? (
        <Button onClick={() => onPrint(order.shipping.id)}>
          🖨️ Imprimir Etiqueta
        </Button>
      ) : (
        <span style={{ color: "#999", fontStyle: "italic" }}>Sem etiqueta</span>
      )}
    </li>
  );
}
