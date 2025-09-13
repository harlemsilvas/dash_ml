#!/usr/bin/env node
/**
 * Uso: node saveToken.js CODIGO_RECEBIDO REDIRECT_URI
 */
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import fetch from "node-fetch";

// Variáveis de ambiente
const { MONGODB_URI, CLIENT_ID, CLIENT_SECRET } = process.env;

if (!MONGODB_URI || !CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "❌ Variáveis MONGODB_URI, CLIENT_ID e CLIENT_SECRET não definidas"
  );
  process.exit(1);
}

// Recebe argumentos
const [code, redirectUri] = process.argv.slice(2);
if (!code || !redirectUri) {
  console.error("Uso: node saveToken.js CODIGO_RECEBIDO REDIRECT_URI");
  process.exit(1);
}

// Modelo Token
const tokenSchema = new mongoose.Schema(
  {
    user_id: Number,
    access_token: String,
    refresh_token: String,
    expires_in: Number,
    nickname: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { collection: "tokens" }
);
const Token = mongoose.models.Token || mongoose.model("Token", tokenSchema);

async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("[MongoDB] Conectado com sucesso");

    // Troca code por token
    const response = await fetch("https://api.mercadolibre.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        `Erro ao trocar code por token: ${data.error} ${data.message || ""}`
      );
    }

    const { access_token, refresh_token, user_id, expires_in } = data;
    console.log("[ML] Token obtido com sucesso:", {
      user_id,
      access_token,
      refresh_token,
    });

    // Busca nickname
    const userRes = await fetch(
      `https://api.mercadolibre.com/users/${user_id}`,
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    const userData = await userRes.json();
    const nickname = userData.nickname || `SELLER_${user_id}`;

    // Salva ou atualiza no MongoDB
    await Token.findOneAndUpdate(
      { user_id },
      {
        access_token,
        refresh_token,
        expires_in,
        nickname,
        updated_at: new Date(),
      },
      { upsert: true, new: true }
    );

    console.log("✅ Token salvo/atualizado no MongoDB com sucesso!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erro:", err.message);
    process.exit(1);
  }
}

main();
