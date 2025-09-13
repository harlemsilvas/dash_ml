#!/bin/sh
# Inicia localtunnel apontando para porta 3000
# Gera URL pública HTTPS

# Substitua subdomain se quiser fixo (opcional)
SUBDOMAIN="https://rude-cases-stay.loca.lt"

echo "Iniciando localtunnel..."
npx localtunnel --port 3000 --subdomain $SUBDOMAIN
