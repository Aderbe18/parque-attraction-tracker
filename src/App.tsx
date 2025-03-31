
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import InspeccionesPage from "./pages/InspeccionesPage";
import NuevaInspeccionPage from "./pages/NuevaInspeccionPage";
import SolicitudesPage from "./pages/SolicitudesPage";
import NuevaSolicitudPage from "./pages/NuevaSolicitudPage";
import RegistradoraPage from "./pages/RegistradoraPage";
import ReportesPage from "./pages/ReportesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/inspecciones" element={<InspeccionesPage />} />
            <Route path="/inspecciones/nueva" element={<NuevaInspeccionPage />} />
            <Route path="/solicitudes" element={<SolicitudesPage />} />
            <Route path="/solicitudes/nueva" element={<NuevaSolicitudPage />} />
            <Route path="/registradora" element={<RegistradoraPage />} />
            <Route path="/reportes" element={<ReportesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
