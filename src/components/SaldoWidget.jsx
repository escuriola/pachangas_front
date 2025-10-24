import React, { useEffect, useState } from 'react';

function SaldoWidget() {
  const [saldo, setSaldo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/saldo`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar saldo');
        return res.json();
      })
      .then(setSaldo)
      .catch(setError);
  }, []);

  const format = (num) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(num);

  if (error) return <div className="text-red-500">❌ {error.message}</div>;
  if (!saldo) return <div>Cargando saldo...</div>;

  return (
    <div className="p-4 bg-white rounded-xl shadow-md w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">💰 Tu saldo</h2>
      <ul className="space-y-1 text-gray-700">
        <li><strong>Actual:</strong> {format(saldo.current)}</li>
        <li><strong>Futuro:</strong> {format(saldo.future)}</li>
        <li><strong>Deuda máxima:</strong> {format(saldo.maxDebt)}</li>
      </ul>
      <div className="text-sm text-gray-500 mt-4">
        Actualizado: {new Date(saldo.timestamp * 1000).toLocaleString()}
      </div>
    </div>
  );
}

export default SaldoWidget;
