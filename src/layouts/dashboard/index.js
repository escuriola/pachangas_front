
// Adaptación del dashboard con integración de noticias y cards de saldo
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import NewsList from "components/Misteria/NewsList";
import OpponentsBalance from "components/Misteria/OpponentsBalance";

function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <OpponentsBalance />
          </Grid>
          <Grid item xs={12}>
            <NewsList />
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;