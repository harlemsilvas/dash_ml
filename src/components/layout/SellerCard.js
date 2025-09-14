// src/components/layout/SellerCard.js
export default function SellerCard({ seller }) {
  return (
    <li className="p-4 border rounded-md shadow-sm bg-white">
      <p>
        <strong>ID:</strong> {seller.user_id}
      </p>
      <p>
        <strong>Conectado em:</strong>{" "}
        {new Date(seller.created_at).toLocaleDateString()}
      </p>
    </li>
  );
}
