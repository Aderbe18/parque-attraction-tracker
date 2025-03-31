
import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AttractionSelector from '@/components/AttractionSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
import { InspeccionPreoperativa, ItemVerificado } from '@/types';
import { saveInspeccion } from '@/services/dataService';

// Lista de items de verificación por defecto
const defaultItemsVerificacion = [
  "Sistemas de seguridad",
  "Sistemas de frenado",
  "Anclajes y sujeciones",
  "Sistemas hidráulicos",
  "Sistemas eléctricos",
  "Sistemas neumáticos",
  "Dispositivos de emergencia",
  "Asientos y arneses",
  "Puntos de lubricación",
  "Estructura general",
];

const NuevaInspeccionPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    atraccion: '',
    realizada_por: '',
    limpieza: false,
    estado_general: 'Bueno' as 'Bueno' | 'Regular' | 'Malo',
    observaciones: '',
  });
  
  const [itemsVerificados, setItemsVerificados] = useState<ItemVerificado[]>(
    defaultItemsVerificacion.map(item => ({
      nombre: item,
      estado: 'OK' as 'OK' | 'No OK' | 'N/A',
      observaciones: '',
    }))
  );
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAtraccionChange = (value: string) => {
    setFormData(prev => ({ ...prev, atraccion: value }));
  };
  
  const handleItemEstadoChange = (index: number, estado: 'OK' | 'No OK' | 'N/A') => {
    const newItems = [...itemsVerificados];
    newItems[index].estado = estado;
    setItemsVerificados(newItems);
  };
  
  const handleItemObservacionChange = (index: number, observacion: string) => {
    const newItems = [...itemsVerificados];
    newItems[index].observaciones = observacion;
    setItemsVerificados(newItems);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.atraccion || !formData.realizada_por) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }
    
    const nuevaInspeccion: InspeccionPreoperativa = {
      id: uuidv4(),
      fecha: new Date().toISOString().split('T')[0],
      ...formData,
      items_verificados: itemsVerificados,
    };
    
    try {
      saveInspeccion(nuevaInspeccion);
      alert('Inspección guardada correctamente.');
      navigate('/inspecciones');
    } catch (error) {
      console.error('Error al guardar la inspección:', error);
      alert('Ocurrió un error al guardar la inspección.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-coffee-dark">Nueva Inspección Preoperativa</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información General</CardTitle>
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
                  <Label htmlFor="realizada_por">Realizada por</Label>
                  <Input
                    id="realizada_por"
                    name="realizada_por"
                    value={formData.realizada_por}
                    onChange={handleInputChange}
                    placeholder="Nombre del inspector"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="limpieza" 
                    checked={formData.limpieza}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, limpieza: !!checked }))}
                  />
                  <Label htmlFor="limpieza" className="cursor-pointer">Limpieza realizada</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estado_general">Estado General</Label>
                  <Select 
                    value={formData.estado_general} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, estado_general: value as any }))}
                  >
                    <SelectTrigger id="estado_general">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bueno">Bueno</SelectItem>
                      <SelectItem value="Regular">Regular</SelectItem>
                      <SelectItem value="Malo">Malo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="observaciones">Observaciones Generales</Label>
                  <Textarea
                    id="observaciones"
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleInputChange}
                    placeholder="Observaciones adicionales..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Items a Verificar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {itemsVerificados.map((item, index) => (
                    <div key={index} className="border p-4 rounded-md">
                      <div className="flex flex-wrap items-center gap-4 mb-2">
                        <span className="font-medium min-w-[200px]">{item.nombre}</span>
                        
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`item-${index}-ok`}
                              checked={item.estado === 'OK'}
                              onCheckedChange={(checked) => {
                                if (checked) handleItemEstadoChange(index, 'OK');
                              }}
                            />
                            <Label htmlFor={`item-${index}-ok`}>OK</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`item-${index}-nook`}
                              checked={item.estado === 'No OK'}
                              onCheckedChange={(checked) => {
                                if (checked) handleItemEstadoChange(index, 'No OK');
                              }}
                            />
                            <Label htmlFor={`item-${index}-nook`}>No OK</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`item-${index}-na`}
                              checked={item.estado === 'N/A'}
                              onCheckedChange={(checked) => {
                                if (checked) handleItemEstadoChange(index, 'N/A');
                              }}
                            />
                            <Label htmlFor={`item-${index}-na`}>N/A</Label>
                          </div>
                        </div>
                      </div>
                      
                      {item.estado === 'No OK' && (
                        <div className="mt-2">
                          <Input
                            placeholder="Observaciones"
                            value={item.observaciones || ''}
                            onChange={(e) => handleItemObservacionChange(index, e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/inspecciones')}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-coffee hover:bg-coffee-dark"
              >
                Guardar Inspección
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

export default NuevaInspeccionPage;
