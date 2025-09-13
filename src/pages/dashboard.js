import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sellers")
      .then((res) => res.json())
      .then((data) => {
        setSellers(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading)
    return <p style={{ textAlign: "center" }}>🔄 Carregando vendedores...</p>;

  return (
    <div
      style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}
    >
      <h1>📊 Dashboard</h1>
      <p>Vendedores conectados ao Mercado Livre:</p>

      {sellers.length === 0 ? (
        <p>Nenhum vendedor conectado ainda.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr style={{ background: "#f4f4f4" }}>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                User ID
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Apelido
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Data</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((s) => (
              <tr key={s._id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {s.user_id}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {s.nickname || "—"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {new Date(s.created_at).toLocaleString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: "30px" }}>
        <Link href="/connect-ml">
          <button
            style={{
              padding: "10px 20px",
              background: "#ffe600",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ➕ Conectar nova conta
          </button>
        </Link>
      </div>
    </div>
  );
}
