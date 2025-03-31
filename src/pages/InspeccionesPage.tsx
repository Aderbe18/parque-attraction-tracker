
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
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  FileIcon, 
  TrashIcon,
  SearchIcon
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { InspeccionPreoperativa } from '@/types';
import { getInspecciones, deleteInspeccion } from '@/services/dataService';

const InspeccionesPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [inspecciones, setInspecciones] = useState<InspeccionPreoperativa[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const loadInspecciones = () => {
      const data = getInspecciones();
      setInspecciones(data);
    };
    
    loadInspecciones();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de querer eliminar esta inspección?')) {
      deleteInspeccion(id);
      setInspecciones(inspecciones.filter(item => item.id !== id));
    }
  };

  const filteredInspecciones = inspecciones.filter(inspeccion => 
    inspeccion.atraccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inspeccion.fecha.includes(searchTerm) ||
    inspeccion.realizada_por.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-coffee-dark">Inspecciones Preoperativas</h1>
          
          <Link to="/inspecciones/nueva">
            <Button className="bg-coffee hover:bg-coffee-dark">
              <PlusIcon className="h-4 w-4 mr-2" />
              Nueva Inspección
            </Button>
          </Link>
        </div>
        
        <div className="relative mb-6">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Buscar inspección..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableCaption>Registro de inspecciones preoperativas</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Atracción</TableHead>
                <TableHead>Realizada por</TableHead>
                <TableHead>Estado General</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInspecciones.length > 0 ? (
                filteredInspecciones.map((inspeccion) => (
                  <TableRow key={inspeccion.id}>
                    <TableCell>{new Date(inspeccion.fecha).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{inspeccion.atraccion}</TableCell>
                    <TableCell>{inspeccion.realizada_por}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        inspeccion.estado_general === 'Bueno' 
                          ? 'bg-green-100 text-green-800' 
                          : inspeccion.estado_general === 'Regular'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {inspeccion.estado_general}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/inspecciones/${inspeccion.id}`}>
                          <Button variant="ghost" size="sm">
                            <FileIcon className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(inspeccion.id)}
                        >
                          <TrashIcon className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    {searchTerm ? 'No se encontraron inspecciones que coincidan con la búsqueda' : 'No hay inspecciones registradas'}
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

export default InspeccionesPage;
