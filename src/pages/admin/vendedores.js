// src/pages/admin/vendedores.js
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import SellerCard from "@/components/layout/SellerCard";

export default function AdminSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await fetch("/api/auth/sellers");
        const data = await res.json();
        setSellers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao carregar vendedores:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  return (
    <Layout activePage="admin-sellers">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">👥 Vendedores Conectados</h1>

        {loading ? (
          <p>Carregando vendedores...</p>
        ) : sellers.length === 0 ? (
          <p>Nenhum vendedor conectado.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sellers.map((seller) => (
              <SellerCard
                key={seller.user_id}
                userId={seller.user_id}
                nickname={seller.nickname || `Seller ${seller.user_id}`}
                createdAt={seller.created_at}
              />
            ))}
          </ul>
        )}

        <div className="mt-6">
          <a
            href="/api/auth/login"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            ➕ Conectar Novo Vendedor
          </a>
        </div>
      </div>
    </Layout>
  );
}
