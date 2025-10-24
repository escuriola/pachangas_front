import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const BalanceDashboard = () => {
  const [balances, setBalances] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/balances`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar los balances');
        return res.json();
      })
      .then((data) => setBalances(data.balances))
      .catch(setError);
  }, []);

  const format = (num) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(num);

  if (error) return <div className="text-red-500 text-center">❌ {error.message}</div>;
  if (balances.length === 0) return <div className="text-center">Cargando balances...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">📊 Balances de todos los jugadores</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {balances.map((user) => (
          <Card key={user.name} className="rounded-xl shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-center truncate">{user.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[110px] pr-2">
                <ul className="text-sm text-gray-700 space-y-1">
                  <li><strong>Saldo actual:</strong> {format(user.current)}</li>
                  <li><strong>Deuda máx.:</strong> {format(user.maxDebt)}</li>
                </ul>
              </ScrollArea>
              <div className="text-xs text-gray-500 mt-2 text-right">
                {new Date(user.timestamp * 1000).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BalanceDashboard;
