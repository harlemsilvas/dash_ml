import { saveTokenFromCode } from "@/services/token-manager";
import Token from "@/models/Token";
import { getUserInfo } from "@/services/user-service";

export default async function handler(req, res) {
  const { code, state } = req.query;
  const savedState = req.cookies?.auth_state;

  // Valida parâmetros
  if (!code) {
    return res.status(400).json({ error: "Parâmetro 'code' ausente" });
  }

  if (state !== savedState) {
    return res.status(401).json({ error: "CSRF: state inválido" });
  }

  try {
    // Define redirectUri baseado no ambiente
    const redirectUri =
      process.env.NODE_ENV === "production"
        ? "https://dash-ml.vercel.app/api/auth/callback"
        : `http://${req.headers.host}/api/auth/callback`;

    // Troca o code pelo token
    const tokenData = await saveTokenFromCode(code, redirectUri);

    // Pega nickname real do seller
    const userInfo = await getUserInfo(tokenData.user_id);
    const nickname = userInfo.nickname || `Seller ${tokenData.user_id}`;

    // Salva/atualiza token e nickname no Mongo
    await Token.findOneAndUpdate(
      { user_id: tokenData.user_id },
      {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
        nickname,
        created_at: new Date(),
      },
      { upsert: true }
    );

    // Define cookies seguros
    const isSecure = process.env.NODE_ENV === "production";
    res.setHeader("Set-Cookie", [
      `ml_access_token=${tokenData.access_token}; Path=/; HttpOnly; Secure=${isSecure}; SameSite=Lax; Max-Age=21600`,
      `ml_user_id=${tokenData.user_id}; Path=/; HttpOnly; Secure=${isSecure}; SameSite=Lax; Max-Age=21600`,
    ]);

    // Redireciona para dashboard/home
    res.redirect("/");
  } catch (error) {
    console.error("[Callback] Erro ao processar autenticação", error);
    res.status(500).json({
      error: "Erro interno ao processar autenticação",
      message: error.message,
    });
  }
}
