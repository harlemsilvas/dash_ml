import { getAllSellers } from "@/services/token-manager";

export default async function handler(req, res) {
  try {
    const sellers = await getAllSellers();
    // Garantindo que sempre seja um array
    res.status(200).json(Array.isArray(sellers) ? sellers : []);
  } catch (error) {
    console.error("[API /auth/sellers] Erro ao buscar vendedores:", error);
    res
      .status(500)
      .json({ error: "Falha ao buscar vendedores", details: error.message });
  }
}
