import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
// import Sidebar from './components/Sidebar'; // Comentado para remover
import DashboardNavbar from './components/DashboardNavbar';
import Box from '@mui/material/Box';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', width: '100vw', height: '100vh' }}>
          {/* <Sidebar /> */} {/* Sidebar removido */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: '100%',
              height: '100%',
              p: 3,
              overflow: 'auto' // Para scroll si el contenido es muy grande
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;