export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="p-4 bg-blue-600 text-white font-bold">Dashboard ML</header>
      <main className="p-4">{children}</main>
    </div>
  );
}
