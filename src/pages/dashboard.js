// src/pages/dashboard.js
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const userRes = await fetch("/api/auth/current-token");
      if (!userRes.ok) throw new Error("Não autenticado");
      const userData = await userRes.json();

      const userInfoRes = await fetch(`/api/users/${userData.user_id}`);
      const userInfo = await userInfoRes.json();
      setUser({ ...userData, nickname: userInfo.nickname || "Sem nickname" });
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
      window.location.href = "/api/auth/login";
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout activePage="dashboard">
      <h1>🏠 Painel do Vendedor</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        user && (
          <Card title="Informações do Vendedor">
            <p>
              <strong>Nickname:</strong> {user.nickname}
            </p>
            <p>
              <strong>ID:</strong> {user.user_id}
            </p>
            <p>
              <strong>Status:</strong> Conectado
            </p>
          </Card>
        )
      )}
    </Layout>
  );
}
