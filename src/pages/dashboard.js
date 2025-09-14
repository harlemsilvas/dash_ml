// pages/dashboard.js
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Layout>
      <h1>📊 Dashboard</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : !stats ? (
        <p>Não foi possível carregar os dados.</p>
      ) : (
        <div>
          <p>Pedidos Hoje: {stats.pedidosHoje}</p>
          <p>Vendas do Mês: R$ {stats.vendasMes}</p>
        </div>
      )}
    </Layout>
  );
}
