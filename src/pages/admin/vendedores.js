// src/pages/admin/vendedores.js
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import Card from "@/components/ui/Card";

export default function AdminSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSellersWithInfo();
  }, []);

  const loadSellersWithInfo = async () => {
    try {
      const res = await fetch("/api/auth/sellers");
      const sellerList = await res.json();

      if (!Array.isArray(sellerList)) {
        console.error("API retornou dados inválidos:", sellerList);
        setSellers([]);
        return;
      }

      // Para cada vendedor, busca o nickname
      const sellersWithInfo = await Promise.all(
        sellerList.map(async (seller) => {
          try {
            const userInfoRes = await fetch(`/api/users/${seller.user_id}`);
            const userInfo = await userInfoRes.json();
            return {
              ...seller,
              nickname: userInfo.nickname || "Sem nickname",
            };
          } catch (err) {
            console.error(
              "Erro ao buscar info do usuário:",
              seller.user_id,
              err
            );
            return { ...seller, nickname: "Erro ao carregar" };
          }
        })
      );

      setSellers(sellersWithInfo);
    } catch (err) {
      console.error("Erro ao carregar vendedores:", err);
      setSellers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout activePage="admin">
      <h1>👥 Vendedores Conectados</h1>
      {loading ? (
        <p>Carregando informações...</p>
      ) : sellers.length === 0 ? (
        <p>Nenhum vendedor conectado.</p>
      ) : (
        <div style={{ display: "grid", gap: "15px" }}>
          {sellers.map((seller) => (
            <Card key={seller.user_id} title={seller.nickname}>
              <p>
                <strong>ID:</strong> {seller.user_id}
              </p>
              <p>
                <strong>Conectado em:</strong>{" "}
                {new Date(seller.created_at).toLocaleString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
}
