// Callback page to handle OAuth redirect
// src/pages/auth/callback.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function CallbackPage() {
  const router = useRouter();
  const { code, state, error } = router.query;
  const [status, setStatus] = useState("Processando...");

  useEffect(() => {
    if (error) {
      setStatus("❌ Erro na autenticação: " + error);
      return;
    }
    if (code && state) {
      // Chama a rota API que troca code por token
      fetch(`/api/auth/callback?code=${code}&state=${state}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setStatus("❌ Erro: " + data.message);
          } else {
            setStatus(`✅ Conectado! User ID: ${data.user_id}`);
            setTimeout(() => {
              router.push("/dashboard"); // Redireciona para painel
            }, 2000);
          }
        })
        .catch((err) => setStatus("❌ Falha: " + err.message));
    }
  }, [code, state, error, router]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{status}</h2>
    </div>
  );
}
