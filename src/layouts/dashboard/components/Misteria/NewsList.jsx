import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { fetchClient } from "../../../../lib/fetchClient";

function NewsList() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchClient("/api/misteria/news")
      .then((data) => setNews(data.slice(0, 50)))
      .catch((err) => console.error("Error loading news:", err));
  }, []);

  // Función para formatear tiempo relativo
  const timeAgo = (timestamp) => {
    if (!timestamp) return "Fecha no disponible";

    const now = new Date();
    const date = new Date(Number(timestamp) * 1000);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Hace unos segundos";
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 2592000) return `Hace ${Math.floor(diffInSeconds / 86400)} días`;

    return date.toLocaleDateString();
  };

  // Verificar si afecta al jugador escuriola
  const affectsEscuriola = (item) => {
    const searchTerm = "escuriola";
    return (
      item.player?.toLowerCase().includes(searchTerm) ||
      item.title?.toLowerCase().includes(searchTerm) ||
      item.from?.toLowerCase().includes(searchTerm) ||
      item.to?.toLowerCase().includes(searchTerm)
    );
  };

  // Función para obtener el color del chip según la categoría
  const getChipProps = (category) => {
    const cat = category?.toLowerCase();

    if (cat?.includes('clausula') || cat?.includes('cláusula')) {
      return { color: 'error', variant: 'filled' };
    }
    if (cat?.includes('fichaje')) {
      return { color: 'success', variant: 'outlined' };
    }
    if (cat?.includes('venta')) {
      return { color: 'warning', variant: 'outlined' };
    }

    return { color: 'default', variant: 'outlined' };
  };

  return (
    <Grid container spacing={1.5}>
      {news.map((item) => {
        const isEscuriola = affectsEscuriola(item);
        const chipProps = getChipProps(item.category);

        return (
          <Grid item xs={12} key={item.id}>
            <Card
              sx={{
                boxShadow: 1,
                border: isEscuriola ? 2 : 0,
                borderColor: isEscuriola ? 'primary.main' : 'transparent',
                backgroundColor: isEscuriola ? 'primary.50' : 'background.paper',
                '&:hover': {
                  boxShadow: 2,
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {isEscuriola && (
                      <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                        ⭐
                      </Typography>
                    )}
                    <Typography
                      variant="subtitle1"
                      fontWeight={isEscuriola ? "bold" : "medium"}
                      color={isEscuriola ? "primary.main" : "text.primary"}
                    >
                      {item.player || "⚠️ Jugador desconocido"}
                    </Typography>
                  </Box>

                  {item.category && (
                    <Chip
                      label={item.category}
                      size="small"
                      {...chipProps}
                    />
                  )}
                </Box>

                {/* Título */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1, lineHeight: 1.4 }}
                >
                  {item.title}
                </Typography>

                {/* Info adicional */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" gap={2} flexWrap="wrap">
                    {item.amount && (
                      <Typography variant="body2" color="success.main" fontWeight="medium">
                        💰 {Number(item.amount).toLocaleString()} €
                      </Typography>
                    )}

                    {(item.from || item.to) && (
                      <Typography variant="body2" color="text.secondary">
                        {item.from && `${item.from}`}
                        {item.from && item.to && ` → `}
                        {item.to && `${item.to}`}
                      </Typography>
                    )}
                  </Box>

                  <Typography variant="caption" color="text.disabled" sx={{ minWidth: 'fit-content' }}>
                    {timeAgo(item.datetime)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default NewsList;