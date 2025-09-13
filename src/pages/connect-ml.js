import { useEffect, useState } from "react";

export default function ConnectML() {
  const [status, setStatus] = useState("idle");

  const handleLogin = async () => {
    setStatus("loading");
    window.location.href = "/api/auth/login"; // Redireciona para login
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Integração Mercado Livre</h1>
      <p>Conecte sua conta do Mercado Livre para começar.</p>

      <button
        onClick={handleLogin}
        style={{
          padding: "10px 20px",
          background: "#ffe600",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {status === "loading" ? "Redirecionando..." : "Conectar Mercado Livre"}
      </button>
    </div>
  );
}
