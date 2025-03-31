
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  FileTextIcon,
  TrashIcon,
  SearchIcon
} from 'lucide-react';
import { SolicitudMantenimiento } from '@/types';
import { getSolicitudes, deleteSolicitud } from '@/services/dataService';

const SolicitudesPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [solicitudes, setSolicitudes] = useState<SolicitudMantenimiento[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const loadSolicitudes = () => {
      const data = getSolicitudes();
      setSolicitudes(data);
    };
    
    loadSolicitudes();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de querer eliminar esta solicitud?')) {
      deleteSolicitud(id);
      setSolicitudes(solicitudes.filter(item => item.id !== id));
    }
  };

  const filteredSolicitudes = solicitudes.filter(solicitud => 
    solicitud.atraccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    solicitud.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    solicitud.solicitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
    solicitud.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-coffee-dark">Solicitudes de Mantenimiento</h1>
          
          <Link to="/solicitudes/nueva">
            <Button className="bg-coffee hover:bg-coffee-dark">
              <PlusIcon className="h-4 w-4 mr-2" />
              Nueva Solicitud
            </Button>
          </Link>
        </div>
        
        <div className="relative mb-6">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Buscar solicitud..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableCaption>Registro de solicitudes de mantenimiento</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Atracción</TableHead>
                <TableHead>Solicitante</TableHead>
                <TableHead>Urgencia</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSolicitudes.length > 0 ? (
                filteredSolicitudes.map((solicitud) => (
                  <TableRow key={solicitud.id}>
                    <TableCell>{new Date(solicitud.fecha_solicitud).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{solicitud.atraccion}</TableCell>
                    <TableCell>{solicitud.solicitante}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        solicitud.urgencia === 'Baja' 
                          ? 'bg-green-100 text-green-800' 
                          : solicitud.urgencia === 'Media'
                            ? 'bg-yellow-100 text-yellow-800'
                            : solicitud.urgencia === 'Alta'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-red-100 text-red-800'
                      }`}>
                        {solicitud.urgencia}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        solicitud.estado === 'Completada' 
                          ? 'bg-green-100 text-green-800' 
                          : solicitud.estado === 'Pendiente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : solicitud.estado === 'En Proceso'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}>
                        {solicitud.estado}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/solicitudes/${solicitud.id}`}>
                          <Button variant="ghost" size="sm">
                            <FileTextIcon className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(solicitud.id)}
                        >
                          <TrashIcon className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    {searchTerm ? 'No se encontraron solicitudes que coincidan con la búsqueda' : 'No hay solicitudes registradas'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
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

export default SolicitudesPage;
