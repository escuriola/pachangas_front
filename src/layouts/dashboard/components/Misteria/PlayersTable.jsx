import React, { useEffect, useMemo, useState, useDeferredValue, useCallback } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, Box, Chip, Typography, TableSortLabel, InputAdornment, Grid,
  Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel,
  Tooltip as MuiTooltip, Skeleton, useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import SellIcon from "@mui/icons-material/Sell";
import { LineChart, Line, Tooltip as RechartsTooltip, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { fetchClient } from "../../../../lib/fetchClient";

// --- Utilidades ---
const formatCompactNumber = (num) => {
  const number = Number(num);
  if (Number.isNaN(number)) return "-";
  if (Math.abs(number) >= 1_000_000) return `${(number / 1_000_000).toFixed(1)}M`;
  if (Math.abs(number) >= 1_000) return `${(number / 1_000).toFixed(0)}K`;
  return number.toLocaleString("es-ES");
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
};

// Calcula delta en N días (euros). Devuelve { delta, deltaPct } o null si no hay datos suficientes
const calcLastNDaysDelta = (economics = [], days = 5) => {
  if (!Array.isArray(economics) || economics.length === 0) return null;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const recentData = economics
    .map((it) => ({
      date: new Date(it.date),
      value: Number(it.value),
    }))
    .filter((it) => !isNaN(it.date.getTime()) && !isNaN(it.value) && it.date >= cutoff)
    .sort((a, b) => a.date - b.date);

  if (recentData.length < 2) return null;

  const first = recentData[0];
  const last = recentData[recentData.length - 1];
  const delta = last.value - first.value;
  const deltaPct = first.value !== 0 ? (delta / first.value) * 100 : 0;

  return { delta, deltaPct };
};

// --- Mini componentes (memo) ---
const MiniChart = React.memo(function MiniChart({ economics }) {
  if (!economics || economics.length === 0) return <Typography variant="caption" color="text.disabled">Sin datos</Typography>;

  const data = [...economics]
    .map(item => ({ date: item.date, value: Number(item.value) }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const first = data[0];
  const last = data[data.length - 1];
  const isPositiveTrend = last.value > first.value;
  const delta = last.value - first.value;
  const deltaPercentage = ((delta / first.value) * 100).toFixed(1);

  const fmt = (n) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}k` : `${n}`);

  return (
    <Box sx={{ width: 150, height: 60 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" hide={false}
                 tickFormatter={(date) => new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                 tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis hide={false} domain={['auto', 'auto']} tickFormatter={(v) => fmt(Number(v))}
                 tick={{ fontSize: 10 }} width={30} />
          <Line type="natural" dataKey="value" stroke={isPositiveTrend ? "#4caf50" : "#f44336"} strokeWidth={2} dot={false} />
          <RechartsTooltip
            content={({ payload, label }) => {
              if (!payload?.length) return null;
              const current = payload[0].value;
              return (
                <Box sx={{ backgroundColor: "rgba(255,255,255,0.9)", border: "1px solid #ccc", borderRadius: 1, p: 1 }}>
                  <Typography variant="caption">📅 {new Date(label).toLocaleDateString()}</Typography><br />
                  <Typography variant="caption">💰 Valor: {fmt(current)} €</Typography><br />
                  <Typography variant="caption">
                    {isPositiveTrend ? "📈" : "📉"} {fmt(Math.abs(delta))} € ({Math.abs(Number(deltaPercentage))}%)
                  </Typography>
                </Box>
              );
            }}
            position={{ y: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
});

const Last5DaysChart = React.memo(function Last5DaysChart({ economics }) {
  if (!economics || economics.length === 0) return <Typography variant="caption" color="text.disabled">Sin datos</Typography>;

  const fiveDaysAgo = new Date(); fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

  const recentData = [...economics]
    .filter(item => new Date(item.date) >= fiveDaysAgo)
    .map(item => ({ date: item.date, value: Number(item.value) }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (recentData.length === 0) return <Typography variant="caption" color="text.disabled">Sin datos recientes</Typography>;

  const first = recentData[0];
  const last = recentData[recentData.length - 1];
  const isPositiveTrend = last.value > first.value;
  const delta = last.value - first.value;
  const deltaPct = first.value !== 0 ? ((delta / first.value) * 100).toFixed(1) : "0.0";

  const fmt = (n) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}k` : `${n}`);

  return (
    <Box sx={{ width: 120, height: 70, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '100%', height: 45, mb: 0.5 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={recentData}>
            <XAxis dataKey="date" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Line type="natural" dataKey="value" stroke={isPositiveTrend ? "#4caf50" : "#f44336"} strokeWidth={2} dot={{ r: 2 }} />
            <RechartsTooltip
              content={({ payload, label }) => {
                if (!payload?.length) return null;
                const current = payload[0].value;
                return (
                  <Box sx={{ backgroundColor: "rgba(255,255,255,0.95)", border: "1px solid #ccc", borderRadius: 1, p: 1, boxShadow: 1 }}>
                    <Typography variant="caption" fontWeight="bold">
                      📅 {new Date(label).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                    </Typography><br />
                    <Typography variant="caption">💰 {fmt(current)} €</Typography><br />
                    <Typography variant="caption" color={isPositiveTrend ? 'success.main' : 'error.main'}>
                      {isPositiveTrend ? "📈" : "📉"} {fmt(Math.abs(delta))} € ({Math.abs(Number(deltaPct))}%)
                    </Typography>
                  </Box>
                );
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ textAlign: 'center', height: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1 }}>
        <Typography variant="caption" color={isPositiveTrend ? 'success.main' : 'error.main'} fontWeight="bold" sx={{ fontSize: '0.7rem', lineHeight: 1 }}>
          {isPositiveTrend ? "+" : ""}{fmt(delta)} € ({deltaPct}%)
        </Typography>
      </Box>
    </Box>
  );
});

// --- Componente principal ---
function PlayersTable() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    owner: "",
    position: "",
    minValue: "",
    maxValue: "",
    onlyForSale: false,
    onlyTopRanking: false,
    // NUEVO:
    onlyBest5dMarket: false, // Mejores 5 días (en venta u otros equipos)
  });
  const [sortConfig, setSortConfig] = useState({ key: "value", direction: "desc" });

  useEffect(() => {
    let mounted = true;
    fetchClient("/api/misteria/players")
      .then((data) => { if (mounted) { setPlayers(Array.isArray(data) ? data : []); setLoading(false); } })
      .catch((err) => { console.error("Error loading players:", err); setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const deferredSearch = useDeferredValue(filters.search);

  const handleSort = (key) => {
    setSortConfig((prev) => ({ key, direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc" }));
  };

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Atajo: al activar el filtro de “Mejores 5 días (venta u otros)”, ordenamos por esa métrica desc
  const handleToggleBest5dMarket = (checked) => {
    setFilters(prev => ({ ...prev, onlyBest5dMarket: checked }));
    if (checked) setSortConfig({ key: 'last5d_delta', direction: 'desc' });
  };

  const uniqueOwners = useMemo(() => {
    const owners = [...new Set(players.map(p => p.owner).filter(Boolean))];
    return owners.sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
  }, [players]);

  const positionOptions = ['PT', 'DF', 'DL', 'MC'];

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const matchesSearch =
        !deferredSearch ||
        player.name?.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        player.mister_slug?.toLowerCase().includes(deferredSearch.toLowerCase());

      let matchesOwner = true;
      if (filters.owner) {
        if (filters.owner === 'NO_LIBRES') {
          matchesOwner = player.owner && player.owner.toLowerCase() !== 'mister';
        } else {
          matchesOwner = player.owner === filters.owner;
        }
      }

      const matchesPosition = !filters.position || player.main_position === filters.position;
      const matchesMinValue = !filters.minValue || Number(player.value) >= Number(filters.minValue) * 1_000_000;
      const matchesMaxValue = !filters.maxValue || Number(player.value) <= Number(filters.maxValue) * 1_000_000;
      const matchesForSale = !filters.onlyForSale || player.is_for_sale;
      const matchesTopRanking = !filters.onlyTopRanking || (player.top_ranking && player.top_ranking > 0);

      // ---- NUEVO: filtro “Mejores 5 días (venta u otros equipos)” ----
      let matchesBest5dMarket = true;
      if (filters.onlyBest5dMarket) {
        const ownerNorm = (player.owner || '').trim().toLowerCase();
        const isOtherTeam = ownerNorm && ownerNorm !== 'mister';
        const isForSale = !!player.is_for_sale;
        const evo = calcLastNDaysDelta(player.economics, 5);
        matchesBest5dMarket = (isForSale || isOtherTeam) && evo !== null;
      }

      return (
        matchesSearch &&
        matchesOwner &&
        matchesPosition &&
        matchesMinValue &&
        matchesMaxValue &&
        matchesForSale &&
        matchesTopRanking &&
        matchesBest5dMarket
      );
    });
  }, [
    players,
    filters.owner,
    filters.position,
    filters.minValue,
    filters.maxValue,
    filters.onlyForSale,
    filters.onlyTopRanking,
    filters.onlyBest5dMarket,
    deferredSearch
  ]);

  const sortedPlayers = useMemo(() => {
    const list = [...filteredPlayers];
    if (filters.onlyTopRanking && sortConfig.key === 'value' && sortConfig.direction === 'desc') {
      list.sort((a, b) => (a.top_ranking || Infinity) - (b.top_ranking || Infinity));
      return list;
    }

    // ---- NUEVO: orden especial por delta 5 días ----
    if (sortConfig.key === 'last5d_delta') {
      list.sort((a, b) => {
        const da = calcLastNDaysDelta(a.economics, 5)?.delta;
        const db = calcLastNDaysDelta(b.economics, 5)?.delta;
        const va = (da === null || da === undefined) ? Number.NEGATIVE_INFINITY : da;
        const vb = (db === null || db === undefined) ? Number.NEGATIVE_INFINITY : db;
        return sortConfig.direction === 'asc' ? va - vb : vb - va;
      });
      return list;
    }

    // Orden genérico
    list.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      if (typeof aValue === 'string' && !isNaN(Number(aValue))) { aValue = Number(aValue); bValue = Number(bValue); }
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [filteredPlayers, sortConfig, filters.onlyTopRanking]);

  const getClauseStatus = (player) => {
    const hasClause = player.clause && player.clause > 0;
    const hasExpirationDate = player.clause_expires_on;
    const isAvailable = player.clause_is_available;

    if (!hasClause) return { color: 'default', label: 'Sin cláusula', showRed: false, tooltipText: null };
    if (!isAvailable) {
      return { color: 'error', label: 'Bloqueada', showRed: true, tooltipText: hasExpirationDate ? `Bloqueada hasta: ${hasExpirationDate}` : 'Cláusula bloqueada' };
    }
    if (hasExpirationDate) {
      const formattedDate = formatDate(hasExpirationDate);
      return { color: 'error', label: `${formatCompactNumber(player.clause)} €`, showRed: true, tooltipText: formattedDate ? `Expira el: ${formattedDate}` : `Expira el: ${hasExpirationDate}` };
    }
    return { color: 'success', label: `${formatCompactNumber(player.clause)} €`, showRed: false, tooltipText: 'Cláusula disponible sin fecha de expiración' };
  };

  const FILTERS_HEIGHT = isMobile ? 88 : 76;

  const stickyColSx = {
    position: 'sticky',
    left: 0,
    backgroundColor: 'background.paper',
    backgroundClip: 'padding-box',
    minWidth: 200,
  };

  const SkeletonRow = () => (
    <TableRow>
      {Array.from({ length: 9 }).map((_, i) => (<TableCell key={i}><Skeleton variant="text" /></TableCell>))}
    </TableRow>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper sx={{ p: 1.5, position: 'sticky', top: 0, zIndex: 1100, backgroundColor: 'background.paper', boxShadow: 3, borderRadius: 1 }}>
        <Grid container spacing={1.5} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth size="small" label="Buscar jugador" value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Propietario</InputLabel>
              <Select value={filters.owner} label="Propietario" onChange={(e) => handleFilterChange('owner', e.target.value)}>
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="NO_LIBRES">No Libres</MenuItem>
                {uniqueOwners.map(owner => (<MenuItem key={owner} value={owner}>{owner}</MenuItem>))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Posición</InputLabel>
              <Select value={filters.position} label="Posición" onChange={(e) => handleFilterChange('position', e.target.value)}>
                <MenuItem value="">Todas</MenuItem>
                {['PT', 'DF', 'DL', 'MC'].map(pos => (<MenuItem key={pos} value={pos}>{pos}</MenuItem>))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={2}>
            <TextField fullWidth size="small" label="Valor mín (M€)" type="number" value={filters.minValue}
                       onChange={(e) => handleFilterChange('minValue', e.target.value)} />
          </Grid>

          <Grid item xs={6} md={2}>
            <TextField fullWidth size="small" label="Valor máx (M€)" type="number" value={filters.maxValue}
                       onChange={(e) => handleFilterChange('maxValue', e.target.value)} />
          </Grid>

          <Grid item xs={6} md={1.5}>
            <FormControlLabel control={<Checkbox checked={filters.onlyForSale} onChange={(e) => handleFilterChange('onlyForSale', e.target.checked)} size="small" />} label="Solo en venta" />
          </Grid>

          <Grid item xs={6} md={1.5}>
            <FormControlLabel control={<Checkbox checked={filters.onlyTopRanking} onChange={(e) => handleFilterChange('onlyTopRanking', e.target.checked)} size="small" />} label="Solo Top Ranking" />
          </Grid>

          {/* NUEVO: filtro Mejores 5 días (venta u otros equipos) */}
          <Grid item xs={12} md={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.onlyBest5dMarket}
                  onChange={(e) => handleToggleBest5dMarket(e.target.checked)}
                  size="small"
                />
              }
              label="Mejores 5 días (venta u otros)"
            />
          </Grid>

          <Grid item xs={12} md="auto">
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
              {sortedPlayers.length} de {players.length} jugadores
              {filters.onlyTopRanking && " • Top Ranking"}
              {filters.onlyBest5dMarket && " • Mejores 5 días (venta/otros)"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer
        component={Paper}
        sx={{
          position: 'relative',
          borderRadius: 1,
          overflow: "auto",
          maxHeight: { xs: `calc(100vh - ${FILTERS_HEIGHT + 90}px)`, md: `calc(100vh - ${FILTERS_HEIGHT + 140}px)` },
          width: "100%",
          overflowX: "auto",
          "& table": { minWidth: 900 },
          "& .MuiTableCell-stickyHeader": { top: 0, backgroundColor: "background.paper", zIndex: 1100 },
        }}
      >
        <Table size="small" stickyHeader aria-label="tabla de jugadores">
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...stickyColSx, zIndex: 1101 }}>
                <TableSortLabel active={sortConfig.key === 'name'} direction={sortConfig.key === 'name' ? sortConfig.direction : 'asc'} onClick={() => handleSort('name')}>
                  Jugador
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel active={sortConfig.key === 'main_position'} direction={sortConfig.key === 'main_position' ? sortConfig.direction : 'asc'} onClick={() => handleSort('main_position')}>
                  Posición
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel active={sortConfig.key === 'owner'} direction={sortConfig.key === 'owner' ? sortConfig.direction : 'asc'} onClick={() => handleSort('owner')}>
                  Propietario
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel active={sortConfig.key === 'value'} direction={sortConfig.key === 'value' ? sortConfig.direction : 'asc'} onClick={() => handleSort('value')}>
                  Valor Actual
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel active={sortConfig.key === 'max_sale_value'} direction={sortConfig.key === 'max_sale_value' ? sortConfig.direction : 'asc'} onClick={() => handleSort('max_sale_value')}>
                  Valor Máximo
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel active={sortConfig.key === 'points_last_season'} direction={sortConfig.key === 'points_last_season' ? sortConfig.direction : 'asc'} onClick={() => handleSort('points_last_season')}>
                  Puntos 24/25
                </TableSortLabel>
              </TableCell>
              <TableCell>Cláusula</TableCell>
              <TableCell>Evolución</TableCell>

              {/* NUEVO: orden por últimos 5 días */}
              <TableCell align="center">
                <TableSortLabel
                  active={sortConfig.key === 'last5d_delta'}
                  direction={sortConfig.key === 'last5d_delta' ? sortConfig.direction : 'desc'}
                  onClick={() => handleSort('last5d_delta')}
                >
                  Últimos 5 días
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading
              ? Array.from({ length: 10 }).map((_, idx) => <SkeletonRow key={`sk-${idx}`} />)
              : sortedPlayers.map((player) => {
                const clauseStatus = getClauseStatus(player);
                const isEscuriola = player.owner === 'escuriola';
                return (
                  <TableRow
                    key={player.id ?? `${player.mister_slug}-${player.name}`}
                    hover
                    sx={{
                      backgroundColor: isEscuriola ? 'primary.50' : (player.is_for_sale ? 'warning.50' : 'inherit'),
                      border: player.is_for_sale ? '1px solid' : 'none',
                      borderColor: player.is_for_sale ? 'warning.main' : 'transparent',
                      minHeight: '70px'
                    }}
                  >
                    <TableCell sx={{ ...stickyColSx, zIndex: 1099 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Box>
                          <Typography variant="body2" fontWeight="medium" noWrap>{isEscuriola && '⭐ '}{player.name}</Typography>
                          <Typography variant="caption" color="text.disabled" noWrap>{player.mister_slug}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {!!player.is_for_sale && (
                            <MuiTooltip title={`En venta por ${formatCompactNumber(player.sale_price)} €`} arrow placement="top">
                              <Chip icon={<SellIcon />} label="EN VENTA" size="small" color="warning" variant="filled"
                                    sx={{ fontWeight: 'bold', fontSize: '0.7rem', '& .MuiChip-icon': { fontSize: '0.8rem' } }} />
                            </MuiTooltip>
                          )}
                          {player.top_ranking && player.top_ranking > 0 && (
                            <MuiTooltip title={`Top ${player.top_ranking} más robado por cláusula`} arrow placement="top">
                              <Chip label={`💥 TOP ${player.top_ranking}`} size="small" color="error" variant="filled"
                                    sx={{ fontWeight: 'bold', fontSize: '0.7rem', backgroundColor: '#ff5722', color: 'white', '&:hover': { backgroundColor: '#e64919' } }} />
                            </MuiTooltip>
                          )}
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell><Typography variant="body2" fontWeight="medium">{player.main_position}</Typography></TableCell>

                    <TableCell>
                      <Typography variant="body2" color={isEscuriola ? 'primary.main' : 'text.primary'} fontWeight={isEscuriola ? 'bold' : 'normal'} noWrap>
                        {player.owner || 'Sin propietario'}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="medium">{formatCompactNumber(player.value)} €</Typography>
                      <Typography variant="caption" color="text.disabled">{Number(player.value).toLocaleString("es-ES")} €</Typography>
                    </TableCell>

                    <TableCell align="right"><Typography variant="body2" color="success.main">{formatCompactNumber(player.max_sale_value)} €</Typography></TableCell>
                    <TableCell align="right"><Typography variant="body2">{player.points_last_season ?? '-'}</Typography></TableCell>

                    <TableCell>
                      {clauseStatus.tooltipText ? (
                        <MuiTooltip title={clauseStatus.tooltipText} arrow placement="top">
                          <Chip label={clauseStatus.label} size="small" color={clauseStatus.showRed ? 'error' : 'success'} variant="outlined"
                                sx={{ cursor: 'help', '&:hover': { backgroundColor: clauseStatus.showRed ? 'error.50' : 'success.50' } }} />
                        </MuiTooltip>
                      ) : (
                        <Chip label={clauseStatus.label} size="small" color={clauseStatus.color} variant="outlined" />
                      )}
                    </TableCell>

                    <TableCell><MiniChart economics={player.economics} /></TableCell>
                    <TableCell align="center" sx={{ py: 1 }}><Last5DaysChart economics={player.economics} /></TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default PlayersTable;