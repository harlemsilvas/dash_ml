# Usando Node.js LTS
FROM node:20-alpine

# Diretório da aplicação
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do projeto
COPY . .

# Expondo a porta padrão do Next.js
EXPOSE 3000

# Comando default
CMD ["npm", "run", "dev"]
