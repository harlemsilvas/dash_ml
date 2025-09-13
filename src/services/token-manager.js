// import fetch from "node-fetch";
import dbConnect from "../lib/mongodb";
import Token from "../models/Token";

/**
 * Helper genérico para chamadas à API do Mercado Livre
 */
async function callMLApi(url, token) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Erro desconhecido");
    throw new Error(`ML API error ${res.status}: ${text}`);
  }

  return res.json();
}

/**
 * Retorna todos os vendedores conectados
 */
export async function getAllSellers() {
  await dbConnect();
  return await Token.find({}, "user_id nickname created_at").sort({
    created_at: -1,
  });
}

/**
 * Retorna token válido (renova se necessário)
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
    console.log("[Token] Próximo de expirar. Renovando...");
    token = await refreshAccessToken(token.user_id);
  }

  return token;
}

/**
 * Renova o token usando refresh_token
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
  if (!res.ok) throw new Error(`Falha ao renovar token: ${data.error}`);

  const renewedToken = await Token.create({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    user_id: data.user_id,
    expires_in: data.expires_in,
  });

  console.log("[Token] Renovado com sucesso para user_id:", data.user_id);
  return renewedToken;
}

/**
 * Salva um novo token a partir do código recebido no OAuth
 */
export async function saveTokenFromCode(code, redirectUri) {
  await dbConnect();

  const res = await fetch("https://api.mercadolibre.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.MERCADO_LIVRE_APP_ID,
      client_secret: process.env.MERCADO_LIVRE_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      `Erro ao trocar código por token: ${data.error_description || data.error}`
    );
  }

  // 🔹 Pegar nickname do usuário autenticado
  const userRes = await fetch(
    `https://api.mercadolibre.com/users/${data.user_id}`,
    {
      headers: { Authorization: `Bearer ${data.access_token}` },
    }
  );
  const userInfo = await userRes.json();

  // 🔹 Salvar no banco
  const saved = await Token.create({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    user_id: data.user_id,
    nickname: userInfo.nickname || null,
    expires_in: data.expires_in,
  });

  console.log(
    `[Auth] Token salvo para user_id=${data.user_id}, nickname=${userInfo.nickname}`
  );

  return saved;
}
