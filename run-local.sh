#!/bin/bash

# 1. Build e start do Docker
echo "🚀 Subindo container Docker..."
docker-compose up -d --build

# 2. Espera Next.js iniciar (ajuste se necessário)
echo "⏳ Aguardando Next.js iniciar na porta 3000..."
sleep 10

# 3. Instala localtunnel caso não tenha
if ! command -v lt &> /dev/null
then
    echo "📦 Instalando localtunnel..."
    npm install -g localtunnel
fi

# 4. Cria túnel local para porta 3000
echo "🌐 Iniciando LocalTunnel..."
lt --port 3000 --subdomain dashml-test
# lt --port 3000 --subdomain rude-cases-stay # fixed subdomain example
# Substitua subdomain se quiser fixo (opcional)
# SUBDOMAIN="https://rude-cases-stay.loca.lt"

#  echo "Iniciando localtunnel..."
# npx localtunnel --port 3000 --subdomain $SUBDOMAIN