import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import Navbar from '@/components/Navbar';
import DashboardCard from '@/components/DashboardCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ClipboardCheckIcon, 
  WrenchIcon, 
  UsersIcon, 
  DropletIcon,
  AlertTriangleIcon,
  CheckCircleIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  getInspecciones, 
  getSolicitudes,
  getRegistrosVisitantes,
  getRegistrosCombustible 
} from '@/services/dataService';

const Index = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [statsLoaded, setStatsLoaded] = useState<boolean>(false);
  
  // Stats para el dashboard
  const [stats, setStats] = useState({
    inspecciones: 0,
    solicitudesPendientes: 0,
    solicitudesCompletadas: 0,
    visitantesHoy: 0,
    visitantesTotal: 0,
    combustibleTotal: 0
  });

  // Cargar estadísticas al montar el componente
  React.useEffect(() => {
    const inspecciones = getInspecciones();
    const solicitudes = getSolicitudes();
    const registrosVisitantes = getRegistrosVisitantes();
    const registrosCombustible = getRegistrosCombustible();
    
    const hoy = new Date().toISOString().split('T')[0];
    const visitantesHoy = registrosVisitantes
      .filter(registro => registro.fecha === hoy)
      .reduce((total, registro) => total + registro.total_visitantes, 0);
    
    const visitantesTotal = registrosVisitantes
      .reduce((total, registro) => total + registro.total_visitantes, 0);
      
    const combustibleTotal = registrosCombustible
      .reduce((total, registro) => total + registro.cantidad_galones, 0);
      
    const solicitudesPendientes = solicitudes
      .filter(s => s.estado === 'Pendiente' || s.estado === 'En Proceso')
      .length;
      
    const solicitudesCompletadas = solicitudes
      .filter(s => s.estado === 'Completada')
      .length;
    
    setStats({
      inspecciones: inspecciones.length,
      solicitudesPendientes,
      solicitudesCompletadas,
      visitantesHoy,
      visitantesTotal,
      combustibleTotal
    });
    
    setStatsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-coffee-dark">
          Sistema de Inspección Preoperativa - Parque del Café
        </h1>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-coffee">Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardCard 
              title="Inspecciones Realizadas"
              value={statsLoaded ? stats.inspecciones : "..."}
              icon={<ClipboardCheckIcon className="h-5 w-5 text-coffee" />}
              description="Total de inspecciones registradas"
            />
            
            <DashboardCard 
              title="Solicitudes Pendientes"
              value={statsLoaded ? stats.solicitudesPendientes : "..."}
              icon={<AlertTriangleIcon className="h-5 w-5 text-amber-500" />}
              description="Solicitudes en estado pendiente o en proceso"
            />
            
            <DashboardCard 
              title="Solicitudes Completadas"
              value={statsLoaded ? stats.solicitudesCompletadas : "..."}
              icon={<CheckCircleIcon className="h-5 w-5 text-nature-dark" />}
              description="Solicitudes completadas con éxito"
            />
            
            <DashboardCard 
              title="Visitantes Hoy"
              value={statsLoaded ? stats.visitantesHoy : "..."}
              icon={<UsersIcon className="h-5 w-5 text-blue-500" />}
              description="Visitantes registrados el día de hoy"
            />
            
            <DashboardCard 
              title="Total Visitantes"
              value={statsLoaded ? stats.visitantesTotal : "..."}
              icon={<UsersIcon className="h-5 w-5 text-blue-700" />}
              description="Visitantes totales registrados"
            />
            
            <DashboardCard 
              title="Combustible (gal)"
              value={statsLoaded ? stats.combustibleTotal.toFixed(2) : "..."}
              icon={<DropletIcon className="h-5 w-5 text-red-500" />}
              description="Galones totales de combustible registrados"
            />
          </div>
        </section>
        
        <section className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-lg">
                Acciones Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-3">
              <Link to="/inspecciones/nueva">
                <Button variant="default" className="w-full bg-coffee hover:bg-coffee-dark">
                  <ClipboardCheckIcon className="h-4 w-4 mr-2" />
                  Nueva Inspección
                </Button>
              </Link>
              
              <Link to="/solicitudes/nueva">
                <Button variant="outline" className="w-full border-coffee text-coffee hover:bg-coffee/10">
                  <WrenchIcon className="h-4 w-4 mr-2" />
                  Nueva Solicitud
                </Button>
              </Link>
              
              <Link to="/registradora">
                <Button variant="outline" className="w-full border-coffee text-coffee hover:bg-coffee/10">
                  <UsersIcon className="h-4 w-4 mr-2" />
                  Registrar Visitantes
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-lg">
                Reportes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground text-sm">
                Genera reportes exportables a Excel y PDF para tener un seguimiento detallado de todas las operaciones.
              </p>
              <Link to="/reportes">
                <Button variant="default" className="w-full bg-nature hover:bg-nature-dark">
                  Ver Reportes
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>
      
      <footer className="bg-coffee text-primary-foreground py-4 text-center">
        <div className="container mx-auto">
          <p className="text-sm">
            Sistema de Inspección Preoperativa - Parque del Café &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
