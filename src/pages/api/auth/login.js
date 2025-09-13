import crypto from "crypto";

export default function handler(req, res) {
  const clientId = process.env.CLIENT_ID || process.env.MERCADO_LIVRE_APP_ID;

  // Define redirectUri baseado no ambiente
  const redirectUri =
    process.env.NODE_ENV === "production"
      ? "https://dash-ml.vercel.app/api/auth/callback"
      : `http://${req.headers.host}/api/auth/callback`;

  // Gera state seguro
  const state = crypto.randomBytes(16).toString("hex");

  // Define cookie com Secure apenas em produção
  const isSecure = process.env.NODE_ENV === "production";
  const cookieFlags = [
    `auth_state=${state}`,
    "Path=/",
    "HttpOnly",
    isSecure ? "Secure" : "",
    "SameSite=Lax",
  ]
    .filter(Boolean)
    .join("; ");

  res.setHeader("Set-Cookie", cookieFlags);

  // Monta URL de autenticação Mercado Livre
  const authUrl =
    `https://auth.mercadolivre.com.br/authorization?` +
    `response_type=code&` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `state=${state}`;

  res.redirect(authUrl);
}
