
import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AttractionSelector from '@/components/AttractionSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { v4 as uuidv4 } from 'uuid';
import { SolicitudMantenimiento } from '@/types';
import { saveSolicitud } from '@/services/dataService';

const NuevaSolicitudPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    atraccion: '',
    solicitante: '',
    urgencia: 'Media' as 'Baja' | 'Media' | 'Alta' | 'Crítica',
    descripcion: '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAtraccionChange = (value: string) => {
    setFormData(prev => ({ ...prev, atraccion: value }));
  };
  
  const handleUrgenciaChange = (value: string) => {
    setFormData(prev => ({ ...prev, urgencia: value as any }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.atraccion || !formData.solicitante || !formData.descripcion) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }
    
    const nuevaSolicitud: SolicitudMantenimiento = {
      id: uuidv4(),
      fecha_solicitud: new Date().toISOString().split('T')[0],
      estado: 'Pendiente',
      ...formData,
    };
    
    try {
      saveSolicitud(nuevaSolicitud);
      alert('Solicitud guardada correctamente.');
      navigate('/solicitudes');
    } catch (error) {
      console.error('Error al guardar la solicitud:', error);
      alert('Ocurrió un error al guardar la solicitud.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-coffee-dark">Nueva Solicitud de Mantenimiento</h1>
          
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información de la Solicitud</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="atraccion">Atracción</Label>
                  <AttractionSelector 
                    value={formData.atraccion} 
                    onChange={handleAtraccionChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="solicitante">Solicitante</Label>
                  <Input
                    id="solicitante"
                    name="solicitante"
                    value={formData.solicitante}
                    onChange={handleInputChange}
                    placeholder="Nombre del solicitante"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="urgencia">Nivel de Urgencia</Label>
                  <Select 
                    value={formData.urgencia} 
                    onValueChange={handleUrgenciaChange}
                  >
                    <SelectTrigger id="urgencia">
                      <SelectValue placeholder="Seleccionar nivel de urgencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baja">Baja</SelectItem>
                      <SelectItem value="Media">Media</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Crítica">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción del Problema</Label>
                  <Textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    placeholder="Describa en detalle el problema o la solicitud de mantenimiento..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end space-x-4 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/solicitudes')}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-coffee hover:bg-coffee-dark"
              >
                Guardar Solicitud
              </Button>
            </div>
          </form>
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

export default NuevaSolicitudPage;
