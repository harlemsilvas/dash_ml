// pages/api/auth/login.js
import crypto from "crypto";

export default function handler(req, res) {
  const clientId = process.env.CLIENT_ID || process.env.MERCADO_LIVRE_APP_ID;
  const host = req.headers.host;
  const protocol = host.includes("localhost") ? "http" : "https";
  const redirectUri = `${protocol}://${host}/api/auth/callback`;

  // Gera state mais seguro
  const state = crypto.randomBytes(16).toString("hex");

  // Define cookie com Secure apenas em produção
  const isSecure = !host.includes("localhost");
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

  // URL de autenticação Mercado Livre
  const authUrl =
    `https://auth.mercadolivre.com.br/authorization?` +
    `response_type=code&` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `state=${state}`;

  res.redirect(authUrl);
}
