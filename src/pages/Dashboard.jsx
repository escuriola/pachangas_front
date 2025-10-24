import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";

import NewsList from "../layouts/dashboard/components/Misteria/NewsList";
import OpponentsBalance from "../layouts/dashboard/components/Misteria/OpponentsBalance";
import PlayersTable from "../layouts/dashboard/components/Misteria/PlayersTable";

// Componente estilizado para las tarjetas principales - ultra compacto
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5), // Más reducido aún
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
  borderRadius: 8, // Más reducido
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)', // Muy sutil
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    transform: 'translateY(-0.5px)', // Muy sutil
  },
}));

// Componente para el header estilizado - ultra compacto
const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1), // Ultra reducido
  padding: theme.spacing(1, 1.5), // Muy compacto
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  borderRadius: 6, // Más pequeño
  color: 'white',
  boxShadow: '0 1px 6px rgba(0, 0, 0, 0.06)', // Muy sutil
}));

// Container principal con gradiente de fondo
const MainContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: `linear-gradient(135deg, ${theme.palette.grey[100]} 0%, ${theme.palette.grey[50]} 50%, ${theme.palette.background.default} 100%)`,
  padding: theme.spacing(2), // Reducido de 3 a 2
}));

export default function Dashboard() {
  return (
    <MainContainer>
      {/* Header principal del dashboard - más compacto */}
      <Box sx={{ mb: 3 }}> {/* Reducido de 4 a 3 */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%)',
            borderRadius: 2, // Reducido de 3 a 2
            p: 3, // Reducido de 4 a 3
            color: 'white',
            boxShadow: '0 6px 24px rgba(25, 118, 210, 0.25)', // Reducido
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}> {/* Reducido */}
              <Typography variant="h4" fontWeight="bold" sx={{ // Reducido de h3 a h4
                background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                🏆 Dashboard Misteria
              </Typography>
              <Chip
                label="Live"
                color="success"
                variant="filled"
                size="small" // Añadido para hacerlo más pequeño
                sx={{
                  fontWeight: 'bold',
                  fontSize: '0.8rem', // Reducido
                  px: 1.5, // Reducido
                  boxShadow: '0 1px 4px rgba(0,0,0,0.15)' // Reducido
                }}
              />
            </Box>
            <Typography variant="subtitle1" sx={{ opacity: 0.9, fontWeight: 400 }}> {/* Reducido de h6 a subtitle1 */}
              Gestiona tu equipo para no pagar este año las Turia
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Layout optimizado - estructura compacta */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>

        {/* PRIMERO: Layout horizontal: Jugadores (izq) y Noticias (der) */}
        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          {/* Jugadores - Lado izquierdo */}
          <StyledPaper sx={{ flex: 2 }}>
            <SectionHeader sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem'
                  }}
                >
                  ⚽
                </Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Mercado de Jugadores
                </Typography>
              </Box>
              <Chip
                label="Actualizado"
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 'medium',
                  fontSize: '0.7rem',
                  height: 20
                }}
              />
            </SectionHeader>

            <Box sx={{
              maxHeight: '50vh',
              overflow: 'auto',
              borderRadius: 1,
              border: `1px solid rgba(0,0,0,0.1)`,
              '&::-webkit-scrollbar': { width: 4 },
              '&::-webkit-scrollbar-track': { background: '#f1f1f1' },
              '&::-webkit-scrollbar-thumb': { background: '#1976d2', borderRadius: 2 }
            }}>
              <PlayersTable />
            </Box>
          </StyledPaper>

          {/* Noticias - Lado derecho */}
          <StyledPaper sx={{ flex: 1 }}>
            <SectionHeader sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem'
                  }}
                >
                  📰
                </Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Últimas Noticias
                </Typography>
              </Box>
              <Chip
                label="Hoy"
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 'medium',
                  fontSize: '0.7rem',
                  height: 20
                }}
              />
            </SectionHeader>

            <Box sx={{
              maxHeight: '50vh',
              overflow: 'auto',
              '&::-webkit-scrollbar': { width: 4 },
              '&::-webkit-scrollbar-track': { background: '#f1f1f1' },
              '&::-webkit-scrollbar-thumb': { background: '#1976d2', borderRadius: 2 }
            }}>
              <NewsList />
            </Box>
          </StyledPaper>
        </Box>

        {/* SEGUNDO: Saldo y Rivales - Todos juntos en una sola caja */}
        <StyledPaper sx={{ width: '100%' }}>
          <SectionHeader sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem'
                }}
              >
                💰
              </Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Saldo y Rivales
              </Typography>
            </Box>
            <Chip
              label="Live"
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 'medium',
                fontSize: '0.7rem',
                height: 20
              }}
            />
          </SectionHeader>
          <Box>
            <OpponentsBalance />
          </Box>
        </StyledPaper>

      </Box>
    </MainContainer>
  );
}