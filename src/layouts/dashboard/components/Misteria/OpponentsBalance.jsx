import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { LineChart, Line, Tooltip as RechartsTooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts";
import { fetchClient } from "../../../../lib/fetchClient";

function OpponentsBalance() {
  const [opponents, setOpponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClient("/api/misteria/opponents/balances")
      .then((data) => {
        setOpponents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading opponents:", err);
        setLoading(false);
      });
  }, []);

  // Función para determinar el estado con un toque de humor
  const getBalanceStatus = (balance, maxDebt) => {
    const balanceNum = Number(balance);
    const maxDebtNum = Number(maxDebt);

    if (balanceNum < 0) {
      const debtPercentage = Math.abs(balanceNum) / maxDebtNum;
      if (debtPercentage > 0.8) return { color: 'error', label: 'Pidiendo en la calle', variant: 'filled' };
      if (debtPercentage > 0.5) return { color: 'warning', label: 'En la cuerda floja', variant: 'filled' };
      return { color: 'warning', label: 'En números rojos', variant: 'outlined' };
    }

    if (balanceNum > 50000000) return { color: 'success', label: 'Ahorrador de élite', variant: 'outlined' };
    if (balanceNum > 20000000) return { color: 'success', label: 'Nivel de rico', variant: 'outlined' };
    if (balanceNum > 5000000) return { color: 'info', label: 'Con unos ahorrillos', variant: 'outlined' };

    return { color: 'default', label: 'Calvo de Hacienda', variant: 'outlined' };
  };

  // Función para formatear números de forma más compacta
  const formatCompactNumber = (num) => {
    const number = Number(num);
    if (Math.abs(number) >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(number) >= 1000) {
      return `${(number / 1000).toFixed(0)}K`;
    }
    return number.toLocaleString();
  };

  // Componente para mostrar la evolución del valor de los jugadores
  const PlayersValueEvolution = ({ playersValueData, opponentName }) => {
    if (!playersValueData || playersValueData.length === 0) {
      return (
        <Typography variant="caption" color="text.disabled">
          Sin datos de evolución
        </Typography>
      );
    }

    // Ordenar datos por fecha (más reciente primero para los cálculos)
    const sortedDataDesc = [...playersValueData].sort((a, b) => new Date(b.date) - new Date(a.date));
    // Ordenar datos por fecha (más antiguo primero para el gráfico)
    const sortedData = [...playersValueData].sort((a, b) => new Date(a.date) - new Date(b.date));

    const today = sortedDataDesc[0]; // Más reciente
    const yesterday = sortedDataDesc[1]; // Segundo más reciente
    const fiveDaysAgo = sortedDataDesc[sortedDataDesc.length - 1]; // Más antiguo

    // Cálculos para hoy vs ayer
    const deltaYesterday = yesterday ? today.total_value - yesterday.total_value : 0;
    const deltaYesterdayPercentage = yesterday && yesterday.total_value !== 0
      ? ((deltaYesterday / yesterday.total_value) * 100).toFixed(1)
      : '0.0';

    // Cálculos para hoy vs hace 5 días
    const delta5Days = today.total_value - fiveDaysAgo.total_value;
    const delta5DaysPercentage = fiveDaysAgo.total_value !== 0
      ? ((delta5Days / fiveDaysAgo.total_value) * 100).toFixed(1)
      : '0.0';

    const isPositiveTrend = delta5Days > 0;
    const isPositiveTrendYesterday = deltaYesterday > 0;

    // Calcular el rango de valores para mejor visualización
    const values = sortedData.map(d => d.total_value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;
    const padding = range * 0.1; // 10% de padding
    const yAxisMin = Math.max(0, minValue - padding);
    const yAxisMax = maxValue + padding;

    // Determinar el color del gradiente basado en la tendencia
    const gradientColors = isPositiveTrend
      ? { start: '#4caf5020', end: '#4caf5060', stroke: '#4caf50' }
      : delta5Days === 0
        ? { start: '#9e9e9e20', end: '#9e9e9e60', stroke: '#9e9e9e' }
        : { start: '#f4433620', end: '#f4433660', stroke: '#f44336' };

    return (
      <Box sx={{ mt: 2 }}>
        {/* Título de la sección */}
        <Typography variant="caption" color="text.secondary" fontWeight="medium">
          🏃‍♂️ Valor plantilla (5 días)
        </Typography>

        {/* Gráfico mejorado */}
        <Box sx={{ height: 80, mt: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sortedData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id={`gradient-${opponentName}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={gradientColors.start} />
                  <stop offset="95%" stopColor={gradientColors.end} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e0e0e0"
                strokeOpacity={0.5}
                horizontal={true}
                vertical={false}
              />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#666' }}
                tickFormatter={(date) => new Date(date).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit'
                })}
                axisLine={false}
                tickLine={false}
                height={20}
              />

              <YAxis
                domain={[yAxisMin, yAxisMax]}
                tick={{ fontSize: 10, fill: '#666' }}
                tickFormatter={formatCompactNumber}
                axisLine={false}
                tickLine={false}
                width={35}
              />

              <Area
                type="monotone"
                dataKey="total_value"
                stroke={gradientColors.stroke}
                strokeWidth={2.5}
                fill={`url(#gradient-${opponentName})`}
                dot={{ r: 3, fill: gradientColors.stroke, strokeWidth: 0 }}
                activeDot={{
                  r: 4,
                  fill: gradientColors.stroke,
                  strokeWidth: 2,
                  stroke: '#fff',
                  filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,0.3))'
                }}
              />

              <RechartsTooltip
                content={({ payload, label }) => {
                  if (!payload?.length) return null;
                  const current = payload[0].value;

                  // Calcular cambio desde el día anterior
                  const currentIndex = sortedData.findIndex(d => d.date === label);
                  const previousDay = currentIndex > 0 ? sortedData[currentIndex - 1] : null;
                  const dailyChange = previousDay ? current - previousDay.total_value : 0;
                  const dailyChangePercentage = previousDay && previousDay.total_value !== 0
                    ? ((dailyChange / previousDay.total_value) * 100).toFixed(1)
                    : '0.0';

                  return (
                    <Box
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.98)",
                        border: "1px solid #ddd",
                        borderRadius: 2,
                        p: 1.5,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        minWidth: 200
                      }}
                    >
                      <Typography variant="caption" fontWeight="bold" color="primary.main">
                        📅 {new Date(label).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                      </Typography><br />

                      <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                        💰 <strong>{formatCompactNumber(current)} €</strong>
                      </Typography>

                      {dailyChange !== 0 && (
                        <Typography
                          variant="caption"
                          color={dailyChange > 0 ? 'success.main' : 'error.main'}
                          sx={{ display: 'block', mt: 0.5 }}
                        >
                          {dailyChange > 0 ? '📈' : '📉'} {dailyChange > 0 ? '+' : ''}{formatCompactNumber(dailyChange)} € ({dailyChangePercentage}%)
                        </Typography>
                      )}

                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        👤 {opponentName}
                      </Typography>
                    </Box>
                  );
                }}
                cursor={{ stroke: gradientColors.stroke, strokeWidth: 1, strokeDasharray: '3 3' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        {/* Estadísticas del cambio mejoradas */}
        <Box sx={{ mt: 1.5, p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
          {/* Valor actual destacado */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" fontWeight="medium">
              💎 Valor actual:
            </Typography>
            <Typography variant="caption" fontWeight="bold" color="primary.main">
              {formatCompactNumber(today.total_value)} €
            </Typography>
          </Box>

          {/* Cambio vs ayer */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              📊 vs Ayer:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography
                variant="caption"
                color={isPositiveTrendYesterday ? 'success.main' : deltaYesterday === 0 ? 'text.secondary' : 'error.main'}
                fontWeight="bold"
              >
                {deltaYesterday === 0 ? '=' : (isPositiveTrendYesterday ? '+' : '')}{formatCompactNumber(deltaYesterday)} €
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: '0.65rem' }}
              >
                ({deltaYesterdayPercentage}%)
              </Typography>
            </Box>
          </Box>

          {/* Cambio vs 5 días */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              📈 Tendencia 5d:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography
                variant="caption"
                color={isPositiveTrend ? 'success.main' : delta5Days === 0 ? 'text.secondary' : 'error.main'}
                fontWeight="bold"
              >
                {isPositiveTrend ? "🚀" : delta5Days === 0 ? "➡️" : "📉"} {isPositiveTrend ? "+" : ""}{formatCompactNumber(delta5Days)} €
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: '0.65rem' }}
              >
                ({delta5DaysPercentage}%)
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (opponents.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="text.secondary">
          ¿Dónde están los rivales? Se han escondido.
        </Typography>
      </Box>
    );
  }

  // Ordenar por saldo (de mayor a menor)
  const sortedOpponents = [...opponents].sort((a, b) => Number(b.balance) - Number(a.balance));

  return (
    <Grid container spacing={2}>
      {sortedOpponents.map((opponent) => {
        const balanceStatus = getBalanceStatus(opponent.balance, opponent.max_debt);
        const isNegative = Number(opponent.balance) < 0;

        return (
          <Grid item xs={12} sm={6} lg={4} key={opponent.id}>
            <Card
              sx={{
                boxShadow: 1,
                border: '1px solid',
                borderColor: 'grey.300',
                '&:hover': {
                  boxShadow: 2,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                },
                p: 1.5,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%'
              }}
            >
              <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                {/* Header con nombre y estado */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {opponent.name}
                  </Typography>
                  <Chip
                    label={balanceStatus.label}
                    size="small"
                    color={balanceStatus.color}
                    variant={balanceStatus.variant}
                  />
                </Box>

                {/* Saldo principal */}
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color={isNegative ? 'error.main' : 'success.main'}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  💰 {formatCompactNumber(opponent.balance)} €
                </Typography>

                {/* Deuda máxima */}
                <Box mt={1} display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    🏦 Límite: {formatCompactNumber(opponent.max_debt)} €
                  </Typography>

                  {isNegative && (
                    <Typography variant="caption" color="error.main" fontWeight="medium">
                      {Math.round((Math.abs(Number(opponent.balance)) / Number(opponent.max_debt)) * 100)}% de deuda
                    </Typography>
                  )}
                </Box>

                {/* Nueva sección: Evolución del valor de jugadores */}
                <PlayersValueEvolution
                  playersValueData={opponent.players_value_last_5_days}
                  opponentName={opponent.name}
                />
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default OpponentsBalance;