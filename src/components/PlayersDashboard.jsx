import React, { useEffect, useMemo, useState, useCallback, useDeferredValue } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Chip,
  Typography,
  TableSortLabel,
  InputAdornment,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Skeleton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SellIcon from "@mui/icons-material/Sell";
import { LineChart, Line, Tooltip as RechartsTooltip, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { fetchClient } from "../../../../lib/fetchClient";

/** ===== Utilidades ===== */
const formatCompactNumber = (num) => {
  const number = Number(num);
  if (Number.isNaN(number)) return "-";
  if (Math.abs(number) >= 1_000_000) return `${(number / 1_000_000).toFixed(1)}M`;
  if (Math.abs(number) >= 1_000) return `${(number / 1_000).toFixed(0)}K`;
  return number.toLocaleString();
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const valid = !Number.isNaN(date.getTime());
  if (!valid) return dateString; // si llega un timestamp raw o texto, lo devolvemos
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
};

/** ===== Skeleton de tabla ===== */
const TableSkeleton = ({ rows = 12 }) => {
  const cols = [
    "Jugador",
    "Posición",
    "Propietario",
    "Valor Actual",
    "Valor Máximo",
    "Puntos 24/25",
    "Cláusula",
    "Evolución",
    "Últimos 5 días",
  ];

  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table stickyHeader size="small" aria-label="loading table">
        <TableHead>
          <TableRow>
            {cols.map((c) => (
              <TableCell key={c} sx={{ whiteSpace: "nowrap", fontWeight: 600 }}>
                {c}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rows }).map((_, r) => (
            <TableRow key={r} hover>
              {cols.map((_, i) => (
                <TableCell key={i}>
                  <Skeleton variant="rounded" height={24} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

/** ===== Gráficas (sin cambios de lógica) ===== */
const MiniChart = ({ economics }) => {
  if (!economics || economics.length === 0) {
    return <Typography variant="caption" color="text.disabled">Sin datos</Typography>;
  }

  const data = [...economics]
    .map(item => ({ date: item.date, value: Number(item.value) }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const first = data[0];
  const last = data[data.length - 1];
  const isPositiveTrend = last.value > first.value;
  const delta = last.value - first.value;
  const deltaPercentage = ((delta / first.value) * 100).toFixed(1);

  const localFormat = (num) =>
    num >= 1_000_000
      ? `${(num / 1_000_000).toFixed(1)}M`
      : num >= 1_000
        ? `${(num / 1_000).toFixed(1)}k`
        : num;

  return (
    <Box sx={{ width: 150, height: 60 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            hide={false}
            tickFormatter={(d) => new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" })}
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            hide={false}
            domain={["auto", "auto"]}
            tickFormatter={localFormat}
            tick={{ fontSize: 10 }}
            width={30}
          />
          <Line
            type="natural"
            dataKey="value"
            stroke={isPositiveTrend ? "#4caf50" : "#f44336"}
            strokeWidth={2}
            dot={false}
          />
          <RechartsTooltip
            content={({ payload, label }) => {
              if (!payload?.length) return null;
              const current = payload[0].value;
              return (
                <Box
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.9)",
                    border: "1px solid #ccc",
                    borderRadius: 1,
                    p: 1,
                  }}
                >
                  <Typography variant="caption">📅 {new Date(label).toLocaleDateString()}</Typography><br />
                  <Typography variant="caption">💰 Valor: {localFormat(current)} €</Typography><br />
                  <Typography variant="caption">
                    {isPositiveTrend ? "📈" : "📉"} {localFormat(delta)} € ({deltaPercentage}%)
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
};

const Last5DaysChart = ({ economics }) => {
  if (!economics || economics.length === 0) {
    return <Typography variant="caption" color="text.disabled">Sin datos</Typography>;
  }

  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

  const recentData = [...economics]
    .filter(item => new Date(item.date) >= fiveDaysAgo)
    .map(item => ({ date: item.date, value: Number(item.value) }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (recentData.length === 0) {
    return <Typography variant="caption" color="text.disabled">Sin datos recientes</Typography>;
  }

  const first = recentData[0];
  const last = recentData[recentData.length - 1];
  const isPositiveTrend = last.value > first.value;
  const delta = last.value - first.value;
  const deltaPercentage = first.value !== 0 ? ((delta / first.value) * 100).toFixed(1) : "0.0";

  const localFormat = (num) =>
    num >= 1_000_000
      ? `${(num / 1_000_000).toFixed(1)}M`
      : num >= 1_000
        ? `${(num / 1_000).toFixed(1)}k`
        : num;

  return (
    <Box sx={{ width: 120, height: 70, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Box sx={{ width: "100%", height: 45, mb: 0.5 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={recentData}>
            <XAxis dataKey="date" hide />
            <YAxis hide domain={["auto", "auto"]} />
            <Line
              type="natural"
              dataKey="value"
              stroke={isPositiveTrend ? "#4caf50" : "#f44336"}
              strokeWidth={2}
              dot={{ r: 2 }}
            />
            <RechartsTooltip
              content={({ payload, label }) => {
                if (!payload?.length) return null;
                const current = payload[0].value;
                return (
                  <Box
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.95)",
                      border: "1px solid #ccc",
                      borderRadius: 1,
                      p: 1,
                      boxShadow: 1,
                    }}
                  >
                    <Typography variant="caption" fontWeight="bold">
                      📅 {new Date(label).toLocaleDateString("es-ES", {
                      day: "2-digit", month: "2-digit", year: "2-digit",
                    })}
                    </Typography><br />
                    <Typography variant="caption">💰 {localFormat(current)} €</Typography><br />
                    <Typography variant="caption" color={isPositiveTrend ? "success.main" : "error.main"}>
                      {isPositiveTrend ? "📈" : "📉"} {localFormat(Math.abs(delta))} € ({Math.abs(deltaPercentage)}%)
                    </Typography>
                  </Box>
                );
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      <Box sx={{ textAlign: "center", height: 20, display: "flex", flexDirection: "column", justifyContent: "center", lineHeight: 1 }}>
        <Typography
          variant="caption"
          color={isPositiveTrend ? "success.main" : "error.main"}
          fontWeight="bold"
          sx={{ fontSize: "0.7rem", lineHeight: 1 }}
        >
          {isPositiveTrend ? "+" : ""}{localFormat(delta)} € ({deltaPercentage}%)
        </Typography>
      </Box>
    </Box>
  );
};

/** ===== Tabla principal ===== */
function PlayersTable() {
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
  });

  const [sortConfig, setSortConfig] = useState({ key: "value", direction: "desc" });

  // Debounce suave del search para no recalcular en cada tecla
  const deferredSearch = useDeferredValue(filters.search);

  useEffect(() => {
    let canceled = false;
    const API_DIRECT = "http://mister.escuriola.com:8844/web/api/misteria/players";

    async function load() {
      setLoading(true);

      // 1) Visibilidad total en consola
      console.log("🔧 PlayersTable mounted. fetchClient =", typeof fetchClient);

      // 2) Intento con fetchClient (como antes)
      try {
        console.info("🔎 [fetchClient] GET /api/misteria/players");
        const data = await fetchClient("/api/misteria/players");
        console.info("✅ [fetchClient] ok");

        const list = Array.isArray(data) ? data : (data?.players ?? []);
        if (!Array.isArray(list)) throw new Error("Respuesta no es array");

        if (!canceled) setPlayers(list);
        if (!canceled) setLoading(false);
        return;
      } catch (err) {
        console.warn("⚠️ [fetchClient] falló o no devolvió array:", err);
      }

      // 3) Fallback para asegurar Network visible
      try {
        console.info("🔎 [fallback fetch] GET", API_DIRECT);
        const res = await fetch(API_DIRECT, { headers: { Accept: "application/json" }, mode: "cors", credentials: "omit" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data?.players ?? []);
        if (!Array.isArray(list)) throw new Error("Respuesta no es array");

        if (!canceled) setPlayers(list);
      } catch (err2) {
        console.error("❌ [fallback fetch] también falló:", err2);
        if (!canceled) setPlayers([]);
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    load();
    return () => { canceled = true; };
  }, []);

  const uniqueOwners = useMemo(() => {
    const owners = [...new Set(players.map((p) => p.owner).filter(Boolean))];
    return owners.sort((a, b) => a.localeCompare(b));
  }, [players]);

  const positionOptions = ["PT", "DF", "DL", "MC"];

  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const filteredPlayers = useMemo(() => {
    const searchVal = (deferredSearch || "").toLowerCase().trim();

    return players.filter((player) => {
      const matchesSearch =
        !searchVal ||
        player.name?.toLowerCase().includes(searchVal) ||
        player.mister_slug?.toLowerCase().includes(searchVal);

      let matchesOwner = true;
      if (filters.owner) {
        if (filters.owner === "NO_LIBRES") {
          matchesOwner = player.owner && player.owner.toLowerCase() !== "mister";
        } else {
          matchesOwner = player.owner === filters.owner;
        }
      }

      const matchesPosition = !filters.position || player.main_position === filters.position;

      const matchesMinValue =
        !filters.minValue || Number(player.value) >= Number(filters.minValue) * 1_000_000;

      const matchesMaxValue =
        !filters.maxValue || Number(player.value) <= Number(filters.maxValue) * 1_000_000;

      const matchesForSale = !filters.onlyForSale || player.is_for_sale;

      const matchesTopRanking = !filters.onlyTopRanking || (player.top_ranking && player.top_ranking > 0);

      return (
        matchesSearch &&
        matchesOwner &&
        matchesPosition &&
        matchesMinValue &&
        matchesMaxValue &&
        matchesForSale &&
        matchesTopRanking
      );
    });
  }, [players, filters.owner, filters.position, filters.minValue, filters.maxValue, filters.onlyForSale, filters.onlyTopRanking, deferredSearch]);

  const sortedPlayers = useMemo(() => {
    const items = [...filteredPlayers];

    if (filters.onlyTopRanking && sortConfig.key === "value" && sortConfig.direction === "desc") {
      items.sort((a, b) => (a.top_ranking ?? Infinity) - (b.top_ranking ?? Infinity));
    } else {
      items.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (typeof aValue === "string" && !Number.isNaN(Number(aValue))) {
          aValue = Number(aValue);
          bValue = Number(bValue);
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [filteredPlayers, sortConfig, filters.onlyTopRanking]);

  const getClauseStatus = (player) => {
    const hasClause = player.clause && player.clause > 0;
    const hasExpirationDate = player.clause_expires_on;
    const isAvailable = player.clause_is_available;

    if (!hasClause) {
      return { color: "default", label: "Sin cláusula", showRed: false, tooltipText: null };
    }

    if (!isAvailable) {
      return {
        color: "error",
        label: "Bloqueada",
        showRed: true,
        tooltipText: hasExpirationDate ? `Bloqueada hasta: ${hasExpirationDate}` : "Cláusula bloqueada",
      };
    }

    if (hasExpirationDate) {
      const formattedDate = formatDate(hasExpirationDate);
      return {
        color: "error",
        label: `${formatCompactNumber(player.clause)} €`,
        showRed: true,
        tooltipText: formattedDate ? `Expira el: ${formattedDate}` : `Expira el: ${hasExpirationDate}`,
      };
    }

    return {
      color: "success",
      label: `${formatCompactNumber(player.clause)} €`,
      showRed: false,
      tooltipText: "Cláusula disponible sin fecha de expiración",
    };
  };

  /** ===== Loading ===== */
  if (loading) {
    return (
      <Box>
        {/* Filtros skeleton sticky */}
        <Paper
          sx={{
            p: 2,
            mb: 2,
            position: "sticky",
            top: 0,
            zIndex: (t) => t.zIndex.appBar,
            backgroundColor: "background.paper",
            boxShadow: 3,
            borderRadius: 1,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            {[...Array(6)].map((_, i) => (
              <Grid key={i} item xs={12} sm={6} md={2}>
                <Skeleton variant="rounded" height={40} />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Skeleton width={180} />
            </Grid>
          </Grid>
        </Paper>

        <TableSkeleton rows={14} />
      </Box>
    );
  }

  return (
    <Box>
      {/* ===== FILTROS (sticky) - mobile first ===== */}
      <Paper
        sx={{
          p: 2,
          mb: 2,
          position: "sticky",
          top: 0,
          zIndex: (t) => t.zIndex.appBar,
          backgroundColor: "background.paper",
          boxShadow: 3,
          borderRadius: 1,
        }}
      >
        <Grid container spacing={1.5} alignItems="center">
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Buscar jugador"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Propietario</InputLabel>
              <Select
                value={filters.owner}
                label="Propietario"
                onChange={(e) => handleFilterChange("owner", e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="NO_LIBRES">No Libres</MenuItem>
                {uniqueOwners.map((owner) => (
                  <MenuItem key={owner} value={owner}>{owner}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Posición</InputLabel>
              <Select
                value={filters.position}
                label="Posición"
                onChange={(e) => handleFilterChange("position", e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {positionOptions.map((pos) => (
                  <MenuItem key={pos} value={pos}>{pos}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Valor mín (M€)"
              type="number"
              value={filters.minValue}
              onChange={(e) => handleFilterChange("minValue", e.target.value)}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Valor máx (M€)"
              type="number"
              value={filters.maxValue}
              onChange={(e) => handleFilterChange("maxValue", e.target.value)}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.onlyForSale}
                  onChange={(e) => handleFilterChange("onlyForSale", e.target.checked)}
                  size="small"
                />
              }
              label="Solo en venta"
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.onlyTopRanking}
                  onChange={(e) => handleFilterChange("onlyTopRanking", e.target.checked)}
                  size="small"
                />
              }
              label="Solo Top Ranking"
            />
          </Grid>

          <Grid item xs={12} md="auto">
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
              {sortedPlayers.length} de {players.length} jugadores
              {filters.onlyTopRanking && " • Top Ranking activo"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* ===== TABLA (sticky header + mobile-first con scroll horizontal) ===== */}
      <TableContainer
        component={Paper}
        sx={{
          overflowX: "auto",
          // Para móviles, permitir scroll horizontal cómodo
          "& .MuiTableCell-root": { py: 1, px: 1 },
        }}
      >
        <Table stickyHeader size="small" aria-label="players table">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  minWidth: 200,
                  position: { xs: "sticky", md: "static" },
                  left: { xs: 0, md: "auto" },
                  zIndex: (t) => t.zIndex.appBar + 1, // mantener sobre el scroll horizontal
                  backgroundColor: "background.paper",
                }}
              >
                <TableSortLabel
                  active={sortConfig.key === "name"}
                  direction={sortConfig.key === "name" ? sortConfig.direction : "asc"}
                  onClick={() => handleSort("name")}
                >
                  Jugador
                </TableSortLabel>
              </TableCell>

              <TableCell sx={{ minWidth: 90 }}>
                <TableSortLabel
                  active={sortConfig.key === "main_position"}
                  direction={sortConfig.key === "main_position" ? sortConfig.direction : "asc"}
                  onClick={() => handleSort("main_position")}
                >
                  Posición
                </TableSortLabel>
              </TableCell>

              <TableCell sx={{ minWidth: 140 }}>
                <TableSortLabel
                  active={sortConfig.key === "owner"}
                  direction={sortConfig.key === "owner" ? sortConfig.direction : "asc"}
                  onClick={() => handleSort("owner")}
                >
                  Propietario
                </TableSortLabel>
              </TableCell>

              <TableCell align="right" sx={{ minWidth: 140 }}>
                <TableSortLabel
                  active={sortConfig.key === "value"}
                  direction={sortConfig.key === "value" ? sortConfig.direction : "asc"}
                  onClick={() => handleSort("value")}
                >
                  Valor Actual
                </TableSortLabel>
              </TableCell>

              <TableCell align="right" sx={{ minWidth: 140 }}>
                <TableSortLabel
                  active={sortConfig.key === "max_sale_value"}
                  direction={sortConfig.key === "max_sale_value" ? sortConfig.direction : "asc"}
                  onClick={() => handleSort("max_sale_value")}
                >
                  Valor Máximo
                </TableSortLabel>
              </TableCell>

              <TableCell align="right" sx={{ minWidth: 130 }}>
                <TableSortLabel
                  active={sortConfig.key === "points_last_season"}
                  direction={sortConfig.key === "points_last_season" ? sortConfig.direction : "asc"}
                  onClick={() => handleSort("points_last_season")}
                >
                  Puntos 24/25
                </TableSortLabel>
              </TableCell>

              <TableCell sx={{ minWidth: 140 }}>Cláusula</TableCell>
              <TableCell sx={{ minWidth: 170 }}>Evolución</TableCell>
              <TableCell align="center" sx={{ minWidth: 160 }}>Últimos 5 días</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedPlayers.map((player) => {
              const clauseStatus = getClauseStatus(player);

              return (
                <TableRow
                  key={player.id}
                  hover
                  sx={{
                    backgroundColor:
                      player.owner === "escuriola" ? "primary.50" :
                        player.is_for_sale ? "warning.50" : "inherit",
                    border: player.is_for_sale ? "1px solid" : "none",
                    borderColor: player.is_for_sale ? "warning.main" : "transparent",
                    minHeight: 70,
                  }}
                >
                  {/* Columna sticky en móvil para que el nombre no se pierda al hacer scroll */}
                  <TableCell
                    sx={{
                      position: { xs: "sticky", md: "static" },
                      left: { xs: 0, md: "auto" },
                      backgroundColor: "background.paper",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {player.owner === "escuriola" && "⭐ "}{player.name}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {player.mister_slug}
                        </Typography>
                      </Box>

                      {/* Chips */}
                      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {player.is_for_sale && (
                          <Tooltip title={`En venta por ${formatCompactNumber(player.sale_price)} €`} arrow placement="top">
                            <Chip
                              icon={<SellIcon />}
                              label="EN VENTA"
                              size="small"
                              color="warning"
                              variant="filled"
                              sx={{
                                fontWeight: "bold",
                                fontSize: "0.7rem",
                                "& .MuiChip-icon": { fontSize: "0.8rem" },
                              }}
                            />
                          </Tooltip>
                        )}

                        {player.top_ranking && player.top_ranking > 0 && (
                          <Tooltip title={`Top ${player.top_ranking} más robado por cláusula`} arrow placement="top">
                            <Chip
                              label={`💥 TOP ${player.top_ranking}`}
                              size="small"
                              color="error"
                              variant="filled"
                              sx={{
                                fontWeight: "bold",
                                fontSize: "0.7rem",
                                backgroundColor: "#ff5722",
                                color: "white",
                                "&:hover": { backgroundColor: "#e64919" },
                              }}
                            />
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">{player.main_position}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      color={player.owner === "escuriola" ? "primary.main" : "text.primary"}
                      fontWeight={player.owner === "escuriola" ? "bold" : "normal"}
                    >
                      {player.owner || "Sin propietario"}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="medium">
                      {formatCompactNumber(player.value)} €
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      {Number(player.value).toLocaleString()} €
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Typography variant="body2" color="success.main">
                      {formatCompactNumber(player.max_sale_value)} €
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Typography variant="body2">
                      {player.points_last_season ?? "-"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {clauseStatus.tooltipText ? (
                      <Tooltip title={clauseStatus.tooltipText} arrow placement="top">
                        <Chip
                          label={clauseStatus.label}
                          size="small"
                          color={clauseStatus.showRed ? "error" : "success"}
                          variant="outlined"
                          sx={{
                            cursor: "help",
                            "&:hover": {
                              backgroundColor: clauseStatus.showRed ? "error.50" : "success.50",
                            },
                          }}
                        />
                      </Tooltip>
                    ) : (
                      <Chip
                        label={clauseStatus.label}
                        size="small"
                        color={clauseStatus.color}
                        variant="outlined"
                      />
                    )}
                  </TableCell>

                  <TableCell>
                    <MiniChart economics={player.economics} />
                  </TableCell>

                  <TableCell align="center" sx={{ py: 1 }}>
                    <Last5DaysChart economics={player.economics} />
                  </TableCell>
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