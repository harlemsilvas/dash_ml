export default function Card({ children, title }) {
  return (
    <div className="border rounded p-4 shadow-sm bg-white mb-4">
      {title && <h2 className="font-bold text-lg mb-2">{title}</h2>}
      {children}
    </div>
  );
}
