import { getSellerInfo } from "@/services/user-service";

export default async function handler(req, res) {
  const { id } = req.query;
  const userId = parseInt(id);

  if (isNaN(userId)) {
    return res.status(400).json({ error: "'id' deve ser um número válido" });
  }

  try {
    const userInfo = await getSellerInfo(userId);
    res.status(200).json(userInfo || {});
  } catch (error) {
    console.error(`[API /users/${id}] Erro ao buscar usuário:`, error);
    res
      .status(500)
      .json({ error: "Falha ao buscar usuário", details: error.message });
  }
}
