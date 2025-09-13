run.ps1# =======================================
# Script para rodar Next.js + Docker (Windows 11)
# =======================================

Write-Host "🚀 Iniciando ambiente de desenvolvimento com Docker..."

# Garantir que não tem container antigo rodando
docker-compose down

# Build da imagem (apenas se necessário)
docker-compose build

# Subir container em modo desenvolvimento (hot reload)
docker-compose up
