// src/components/layout/SellerCard.js
export default function SellerCard({ userId, nickname, createdAt }) {
  return (
    <li className="p-4 border rounded-md shadow-sm bg-white">
      <p>
        <strong>ID:</strong> {userId}
      </p>
      <p>
        <strong>Nickname:</strong> {nickname}
      </p>
      <p>
        <strong>Conectado em:</strong>{" "}
        {new Date(createdAt).toLocaleDateString()}
      </p>
    </li>
  );
}
