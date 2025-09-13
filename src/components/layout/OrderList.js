// components/OrderList.js
import OrderCard from "./OrderCard";

export default function OrderList({ orders, onPrint }) {
  if (!orders || orders.length === 0) {
    return <p>Nenhum pedido pronto para envio.</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} onPrint={onPrint} />
      ))}
    </ul>
  );
}
