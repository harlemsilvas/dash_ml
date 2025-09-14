// src/pages/index.js
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para o dashboard do vendedor
    router.replace("/dashboard");
  }, [router]);

  return <p>Redirecionando para o painel...</p>;
}
