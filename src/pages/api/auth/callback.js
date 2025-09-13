// pages/api/auth/callback.js
import { saveTokenFromCode, getValidToken } from "@/services/token-manager";

export default async function handler(req, res) {
  const { code, state } = req.query;
  const savedState = req.cookies?.auth_state;

  if (state !== savedState) {
    return res.status(401).json({ error: "CSRF: state inválido" });
  }

  try {
    const redirectUri = `https://${req.headers.host}/api/auth/callback`;
    const token = await saveTokenFromCode(code, redirectUri);

    console.log("[Callback] Token salvo com sucesso:", token.user_id);

    res.setHeader("Set-Cookie", [
      `ml_access_token=${token.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=21600`,
      `ml_user_id=${token.user_id}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=21600`,
    ]);

    res.redirect("/?auth=success");
  } catch (error) {
    console.error("[Callback] Erro ao processar autenticação", error);
    res.status(500).json({ error: error.message });
  }
}
