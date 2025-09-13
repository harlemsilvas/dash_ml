import { getValidToken } from "./token-manager";

/**
 * Retorna informações do vendedor pelo userId
 */
export async function getSellerInfo(userId) {
  const token = await getValidToken(userId);
  const url = `https://api.mercadolibre.com/users/${userId}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });

  if (!response.ok) {
    throw new Error(`Falha ao buscar dados do vendedor: ${response.status}`);
  }

  return await response.json();
}
