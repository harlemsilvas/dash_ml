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
        const response = await fetch("/api/auth/sellers");
        const data = await response.json();
        setSellers(data);
      } catch (error) {
        console.error("Erro ao carregar vendedores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">👥 Vendedores Conectados</h1>

        {loading ? (
          <p>Carregando...</p>
        ) : sellers.length === 0 ? (
          <p>Nenhum vendedor conectado.</p>
        ) : (
          <ul className="space-y-2">
            {sellers.map((seller) => (
              <SellerCard key={seller.user_id} seller={seller} />
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
