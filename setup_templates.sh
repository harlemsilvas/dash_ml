#!/bin/bash

# BASE_DIR=/dash_ml
# cd $BASE_DIR || exit

echo "🔹 Preenchendo arquivos com templates mínimos..."

# ── PAGES ──
cat > src/pages/index.js <<EOL
export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">🏠 Dashboard ML</h1>
      <p>Página inicial funcionando!</p>
    </div>
  );
}
EOL

cat > src/pages/404.js <<EOL
export default function Custom404() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl mt-4">Página não encontrada</p>
    </div>
  );
}
EOL

cat > src/pages/_app.js <<EOL
import '@/styles/globals.css'

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
EOL

cat > src/pages/pedidos/index.js <<EOL
export default function PedidosPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">📦 Pedidos Recentes</h1>
      <p>Ainda não há pedidos.</p>
    </div>
  );
}
EOL

cat > src/pages/admin/vendedores.js <<EOL
export default function AdminSellers() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">👥 Vendedores Conectados</h1>
      <p>Lista de vendedores aparecerá aqui.</p>
    </div>
  );
}
EOL

cat > src/pages/selecionar-vendedor.js <<EOL
export default function SelecionarVendedor() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Selecionar Vendedor</h1>
    </div>
  );
}
EOL

cat > src/pages/zpl/index.js <<EOL
export default function ZPLPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Gerar ZPL</h1>
    </div>
  );
}
EOL

# ── COMPONENTES ──
cat > src/components/layout/Layout.js <<EOL
export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="p-4 bg-blue-600 text-white font-bold">Dashboard ML</header>
      <main className="p-4">{children}</main>
    </div>
  );
}
EOL

cat > src/components/ui/Button.js <<EOL
export default function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      {children}
    </button>
  );
}
EOL

cat > src/components/ui/Card.js <<EOL
export default function Card({ children, title }) {
  return (
    <div className="border rounded p-4 shadow-sm bg-white mb-4">
      {title && <h2 className="font-bold text-lg mb-2">{title}</h2>}
      {children}
    </div>
  );
}
EOL

# ── STYLES ──
mkdir -p src/styles
cat > src/styles/globals.css <<EOL
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-50 text-gray-900;
}

a {
  @apply text-blue-600 hover:underline;
}
EOL

echo "✅ Todos os arquivos principais foram preenchidos com templates React mínimos."

