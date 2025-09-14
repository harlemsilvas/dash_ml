// pages/selecionar-vendedor.js
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";

export default function SelecionarVendedor() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/auth/sellers")
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setError("Erro ao carregar vendedores");
          setSellers([]);
        } else {
          setSellers(data);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Erro ao carregar vendedores");
        setSellers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <h1>👥 Vendedores Conectados</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p>{error}</p>
      ) : sellers.length === 0 ? (
        <p>Nenhum vendedor conectado.</p>
      ) : (
        <ul>
          {sellers.map((seller) => (
            <li key={seller.user_id}>
              Vendedor ID: {seller.user_id} - Conectado em{" "}
              {new Date(seller.created_at).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
      <br />
      <a
        href="/api/auth/login"
        style={{
          padding: "10px 20px",
          backgroundColor: "#0070ba",
          color: "white",
          textDecoration: "none",
          borderRadius: "4px",
        }}
      >
        ➕ Conectar Novo Vendedor
      </a>
    </Layout>
  );
}
