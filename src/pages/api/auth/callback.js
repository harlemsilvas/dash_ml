import { saveTokenFromCode } from "@/services/token-manager";

export default async function handler(req, res) {
  const { code, state } = req.query;
  const savedState = req.cookies?.auth_state;

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

    // Salva token no MongoDB
    const token = await saveTokenFromCode(code, redirectUri);

    // Define cookies seguros
    const isSecure = process.env.NODE_ENV === "production";
    res.setHeader("Set-Cookie", [
      `ml_access_token=${token.access_token}; Path=/; HttpOnly; Secure=${isSecure}; SameSite=Lax; Max-Age=21600`,
      `ml_user_id=${token.user_id}; Path=/; HttpOnly; Secure=${isSecure}; SameSite=Lax; Max-Age=21600`,
    ]);

    res.redirect("/"); // Redireciona para dashboard ou home
  } catch (error) {
    console.error("[Callback] Erro ao processar autenticação", error);
    res.status(500).json({
      error: "Erro interno ao processar autenticação",
      message: error.message,
    });
  }
}
