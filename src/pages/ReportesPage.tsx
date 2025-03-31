
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AttractionSelector from '@/components/AttractionSelector';
import { 
  getInspecciones, 
  getSolicitudes,
  getRegistrosVisitantes,
  getRegistrosCombustible,
  getContadorDiario,
  getEstadisticasMensuales
} from '@/services/dataService';
import { exportToExcel, exportToPDF } from '@/utils/exportUtils';

// Obtener meses para el selector
const obtenerMesesDisponibles = () => {
  const fechaActual = new Date();
  const meses = [];
  
  for (let i = 0; i < 12; i++) {
    const fecha = new Date(fechaActual.getFullYear(), fechaActual.getMonth() - i, 1);
    const valor = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
    const etiqueta = fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    meses.push({ valor, etiqueta });
  }
  
  return meses;
};

const ReportesPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [tipoReporte, setTipoReporte] = useState('inspecciones');
  const [atraccionSeleccionada, setAtraccionSeleccionada] = useState('');
  const [mesSeleccionado, setMesSeleccionado] = useState(obtenerMesesDisponibles()[0].valor);
  const [datosReporte, setDatosReporte] = useState<any[]>([]);
  
  const mesesDisponibles = obtenerMesesDisponibles();
  
  useEffect(() => {
    cargarDatosReporte();
  }, [tipoReporte, atraccionSeleccionada, mesSeleccionado]);
  
  const cargarDatosReporte = () => {
    let datos: any[] = [];
    
    switch (tipoReporte) {
      case 'inspecciones':
        datos = getInspecciones();
        if (atraccionSeleccionada) {
          datos = datos.filter(item => item.atraccion === atraccionSeleccionada);
        }
        break;
        
      case 'solicitudes':
        datos = getSolicitudes();
        if (atraccionSeleccionada) {
          datos = datos.filter(item => item.atraccion === atraccionSeleccionada);
        }
        break;
        
      case 'visitantes':
        datos = getRegistrosVisitantes();
        if (atraccionSeleccionada) {
          datos = datos.filter(item => item.atraccion === atraccionSeleccionada);
        }
        if (mesSeleccionado) {
          datos = datos.filter(item => item.fecha.startsWith(mesSeleccionado));
        }
        break;
        
      case 'combustible':
        datos = getRegistrosCombustible();
        if (atraccionSeleccionada) {
          datos = datos.filter(item => item.atraccion === atraccionSeleccionada);
        }
        if (mesSeleccionado) {
          datos = datos.filter(item => item.fecha.startsWith(mesSeleccionado));
        }
        break;
        
      case 'estadisticas':
        if (atraccionSeleccionada && mesSeleccionado) {
          const estadisticas = getEstadisticasMensuales(atraccionSeleccionada, mesSeleccionado);
          if (estadisticas) {
            const diasDelMes = Object.keys(estadisticas.dias).sort();
            datos = diasDelMes.map(dia => ({
              fecha: dia,
              visitantes: estadisticas.dias[dia],
            }));
          }
        }
        break;
    }
    
    setDatosReporte(datos);
  };
  
  const handleExportExcel = () => {
    let nombreArchivo = `reporte_${tipoReporte}`;
    if (atraccionSeleccionada) {
      nombreArchivo += `_${atraccionSeleccionada.replace(/\s+/g, '_')}`;
    }
    if (mesSeleccionado) {
      nombreArchivo += `_${mesSeleccionado}`;
    }
    
    exportToExcel(datosReporte, nombreArchivo);
  };
  
  const handleExportPDF = () => {
    let nombreArchivo = `reporte_${tipoReporte}`;
    if (atraccionSeleccionada) {
      nombreArchivo += `_${atraccionSeleccionada.replace(/\s+/g, '_')}`;
    }
    if (mesSeleccionado) {
      nombreArchivo += `_${mesSeleccionado}`;
    }
    
    exportToPDF('reporte-container', nombreArchivo)
      .catch(error => console.error('Error al exportar a PDF:', error));
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6 text-coffee-dark">Generación de Reportes</h1>
        
        <Tabs defaultValue="inspecciones" value={tipoReporte} onValueChange={setTipoReporte}>
          <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="inspecciones">Inspecciones</TabsTrigger>
            <TabsTrigger value="solicitudes">Solicitudes</TabsTrigger>
            <TabsTrigger value="visitantes">Visitantes</TabsTrigger>
            <TabsTrigger value="combustible">Combustible</TabsTrigger>
            <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          </TabsList>
          
          <Card>
            <CardHeader>
              <CardTitle>Filtros del Reporte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Atracción</label>
                  <AttractionSelector
                    value={atraccionSeleccionada}
                    onChange={setAtraccionSeleccionada}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Mes</label>
                  <Select 
                    value={mesSeleccionado} 
                    onValueChange={setMesSeleccionado}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar mes" />
                    </SelectTrigger>
                    <SelectContent>
                      {mesesDisponibles.map(mes => (
                        <SelectItem key={mes.valor} value={mes.valor}>
                          {mes.etiqueta}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button 
                  onClick={handleExportExcel}
                  variant="outline"
                  disabled={datosReporte.length === 0}
                >
                  Exportar a Excel
                </Button>
                <Button 
                  onClick={handleExportPDF}
                  className="bg-coffee hover:bg-coffee-dark"
                  disabled={datosReporte.length === 0}
                >
                  Exportar a PDF
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div id="reporte-container" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  Resultados del Reporte
                  {atraccionSeleccionada && ` - ${atraccionSeleccionada}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {datosReporte.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted">
                          {Object.keys(datosReporte[0]).map((key) => (
                            <th key={key} className="p-2 text-left border">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {datosReporte.map((item, index) => (
                          <tr key={index} className={index % 2 === 0 ? '' : 'bg-muted/50'}>
                            {Object.values(item).map((value: any, idx) => (
                              <td key={idx} className="p-2 border">
                                {typeof value === 'object' ? JSON.stringify(value) : value?.toString()}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay datos disponibles para los filtros seleccionados
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </Tabs>
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

export default ReportesPage;
