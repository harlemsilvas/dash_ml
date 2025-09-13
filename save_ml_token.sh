#!/bin/bash
# Uso: ./saveToken.sh CODE

CODE="$1"

# Verifica se o code foi passado
if [ -z "$CODE" ]; then
  echo "❌ Usage: $0 <authorization_code>"
  exit 1
fi

# Verifica se as variáveis de ambiente existem
: "${CLIENT_ID:?❌ CLIENT_ID não definido}"
: "${CLIENT_SECRET:?❌ CLIENT_SECRET não definido}"
: "${MONGODB_URI:?❌ MONGODB_URI não definido}"
: "${REDIRECT_URI:?❌ REDIRECT_URI não definido}"

echo "[1/5] Trocando code por access_token..."

RESPONSE=$(curl -s -X POST "https://api.mercadolibre.com/oauth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "client_id=${CLIENT_ID}" \
  -d "client_secret=${CLIENT_SECRET}" \
  -d "code=${CODE}" \
  -d "redirect_uri=${REDIRECT_URI}")

# Verifica se ocorreu erro
if echo "$RESPONSE" | grep -q "error"; then
  echo "❌ Erro ao trocar code por token:"
  echo "$RESPONSE"
  exit 1
fi

ACCESS_TOKEN=$(echo "$RESPONSE" | jq -r '.access_token')
REFRESH_TOKEN=$(echo "$RESPONSE" | jq -r '.refresh_token')
USER_ID=$(echo "$RESPONSE" | jq -r '.user_id')
EXPIRES_IN=$(echo "$RESPONSE" | jq -r '.expires_in')

echo "[2/5] Token obtido com sucesso:"
echo "   user_id: $USER_ID"
echo "   access_token: $ACCESS_TOKEN"
echo "   expires_in: $EXPIRES_IN"

echo "[3/5] Salvando token no MongoDB..."

mongo "$MONGODB_URI" --quiet <<EOF
use ml-auth
db.tokens.updateOne(
  { user_id: "$USER_ID" },
  {
    \$set: {
      access_token: "$ACCESS_TOKEN",
      refresh_token: "$REFRESH_TOKEN",
      expires_in: $EXPIRES_IN,
      updated_at: new Date()
    }
  },
  { upsert: true }
)
EOF

echo "[4/5] ✅ Token salvo com sucesso no MongoDB!"

echo "[5/5] Finalizado!"
