import dbConnect from "../lib/mongodb";
import Token from "../models/Token";

/**
 * Salva um token a partir do código OAuth
 * @param {string} code Código recebido do Mercado Livre
 * @param {string} redirectUri Redirect URI usado na requisição
 * @returns {Promise<Object>} Token salvo no MongoDB
 */
export async function saveTokenFromCode(code, redirectUri) {
  await dbConnect();

  if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
    throw new Error("Variáveis CLIENT_ID ou CLIENT_SECRET não definidas");
  }

  // Troca code por token
  const res = await fetch("https://api.mercadolibre.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("[TokenManager] Erro ao trocar code por token:", data);
    throw new Error(
      `Erro ao trocar código por token: ${data.error_description || data.error}`
    );
  }

  // Evita duplicidade de user_id
  await Token.deleteMany({ user_id: data.user_id });

  const token = await Token.create({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    user_id: data.user_id,
    nickname: data.nickname,
    expires_in: data.expires_in,
    created_at: new Date(),
  });

  console.log("[TokenManager] Token salvo para user_id:", data.user_id);
  return token;
}

/**
 * Retorna um token válido e renova se necessário
 * @param {string|null} userId
 */
export async function getValidToken(userId = null) {
  await dbConnect();

  let token;
  if (userId) {
    token = await Token.findOne({ user_id: userId }).sort({ created_at: -1 });
  } else {
    token = await Token.findOne().sort({ created_at: -1 });
  }

  if (!token) throw new Error("Nenhum token registrado. Inicie o fluxo OAuth.");

  const now = Date.now();
  const tokenAge = now - new Date(token.created_at).getTime();
  const expiresInMs = token.expires_in * 1000;

  if (tokenAge > expiresInMs - 60000) {
    console.log("[TokenManager] Token próximo de expirar. Renovando...");
    token = await refreshAccessToken(token.user_id);
  }

  return token;
}

/**
 * Renova o token usando refresh_token
 * @param {string} userId
 */
export async function refreshAccessToken(userId) {
  await dbConnect();

  const latestToken = await Token.findOne({ user_id: userId }).sort({
    created_at: -1,
  });
  if (!latestToken) throw new Error("Nenhum token encontrado para renovação");

  const res = await fetch("https://api.mercadolibre.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      refresh_token: latestToken.refresh_token,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("[TokenManager] Erro ao renovar token:", data);
    throw new Error(
      `Erro ao renovar token: ${data.error_description || data.error}`
    );
  }

  // Evita duplicidade
  await Token.deleteMany({ user_id: data.user_id });

  const renewedToken = await Token.create({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    user_id: data.user_id,
    nickname: data.nickname,
    expires_in: data.expires_in,
    created_at: new Date(),
  });

  console.log("[TokenManager] Token renovado para user_id:", data.user_id);
  return renewedToken;
}
