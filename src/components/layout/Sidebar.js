import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-6 flex flex-col">
      <h2 className="text-xl font-bold mb-6">📋 Menu</h2>
      <nav className="flex flex-col space-y-3">
        <Link href="/dashboard" className="hover:text-gray-300">
          📊 Dashboard
        </Link>
        <Link href="/selecionar-vendedor" className="hover:text-gray-300">
          👥 Vendedores
        </Link>
        <Link href="/admin/vendedores" className="hover:text-gray-300">
          ⚙️ Admin Vendedores
        </Link>
        <Link href="/pedidos" className="hover:text-gray-300">
          📦 Pedidos
        </Link>
      </nav>
    </aside>
  );
}
