import { fetchSellerOrders } from "@/services/order-service";

export default async function handler(req, res) {
  const { seller_id } = req.query;

  if (!seller_id) {
    return res
      .status(400)
      .json({ error: "Parâmetro 'seller_id' é obrigatório" });
  }

  const sellerId = parseInt(seller_id);
  if (isNaN(sellerId)) {
    return res
      .status(400)
      .json({ error: "'seller_id' deve ser um número válido" });
  }

  try {
    const orders = await fetchSellerOrders(sellerId);
    res.status(200).json({ orders: Array.isArray(orders) ? orders : [] });
  } catch (error) {
    console.error("[API /orders] Erro ao buscar pedidos:", error);
    res
      .status(500)
      .json({ error: "Falha ao buscar pedidos", details: error.message });
  }
}
