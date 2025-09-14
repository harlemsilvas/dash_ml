// pages/selecionar-vendedor.js
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";

export default function SelecionarVendedor() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/sellers")
      .then((r) => r.json())
      .then((data) => {
        setSellers(data);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <h1 className="text-xl font-bold mb-4">👥 Vendedores Conectados</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : sellers.length === 0 ? (
        <p>Nenhum vendedor conectado.</p>
      ) : (
        <ul className="space-y-2">
          {sellers.map((seller) => (
            <li
              key={seller.user_id}
              className="p-2 border rounded bg-gray-50 shadow-sm"
            >
              <span className="font-medium">Vendedor ID:</span> {seller.user_id}{" "}
              <br />
              <span className="text-sm text-gray-600">
                Conectado em{" "}
                {new Date(seller.created_at).toLocaleDateString("pt-BR")}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <Button
          as="a"
          href="/api/auth/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          ➕ Conectar Novo Vendedor
        </Button>
      </div>
    </Layout>
  );
}
