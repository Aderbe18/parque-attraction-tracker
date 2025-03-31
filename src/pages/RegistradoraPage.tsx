
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import AttractionSelector from '@/components/AttractionSelector';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { RegistroVisitantes, HorarioVisitantes } from '@/types';
import { saveRegistroVisitantes, actualizarContadorDiario } from '@/services/dataService';

const RegistradoraPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [atraccion, setAtraccion] = useState<string>('');
  const [cantidadActual, setCantidadActual] = useState<string>('');
  const [registroHorarios, setRegistroHorarios] = useState<HorarioVisitantes[]>([]);
  const [totalDia, setTotalDia] = useState<number>(0);
  
  useEffect(() => {
    // Actualizar el total del día cuando cambian los registros
    const nuevoTotal = registroHorarios.reduce(
      (suma, registro) => suma + registro.cantidad, 
      0
    );
    setTotalDia(nuevoTotal);
  }, [registroHorarios]);
  
  const agregarRegistro = () => {
    if (!atraccion) {
      toast.error('Debe seleccionar una atracción');
      return;
    }
    
    const cantidad = parseInt(cantidadActual);
    if (isNaN(cantidad) || cantidad <= 0) {
      toast.error('La cantidad debe ser un número positivo');
      return;
    }
    
    const ahora = new Date();
    const horaInicio = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`;
    
    // Añadir 15 minutos a la hora actual para obtener la hora de fin por defecto
    const horaFinDate = new Date(ahora.getTime() + 15 * 60000);
    const horaFin = `${horaFinDate.getHours().toString().padStart(2, '0')}:${horaFinDate.getMinutes().toString().padStart(2, '0')}`;
    
    const nuevoRegistro: HorarioVisitantes = {
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      cantidad,
    };
    
    setRegistroHorarios([...registroHorarios, nuevoRegistro]);
    setCantidadActual('');
    toast.success('Registro agregado correctamente');
  };
  
  const guardarRegistroCompleto = () => {
    if (!atraccion) {
      toast.error('Debe seleccionar una atracción');
      return;
    }
    
    if (registroHorarios.length === 0) {
      toast.error('Debe agregar al menos un registro');
      return;
    }
    
    const fechaActual = new Date().toISOString().split('T')[0];
    
    const nuevoRegistro: RegistroVisitantes = {
      id: uuidv4(),
      atraccion,
      fecha: fechaActual,
      total_visitantes: totalDia,
      horarios: registroHorarios,
    };
    
    try {
      // Guardar el registro de visitantes
      saveRegistroVisitantes(nuevoRegistro);
      
      // Actualizar el contador diario
      actualizarContadorDiario(atraccion, fechaActual, totalDia);
      
      // Limpiar el formulario
      setAtraccion('');
      setRegistroHorarios([]);
      setCantidadActual('');
      
      toast.success('Registro guardado correctamente');
    } catch (error) {
      console.error('Error al guardar el registro:', error);
      toast.error('Error al guardar el registro');
    }
  };
  
  const eliminarRegistro = (index: number) => {
    const nuevosRegistros = [...registroHorarios];
    nuevosRegistros.splice(index, 1);
    setRegistroHorarios(nuevosRegistros);
    toast.info('Registro eliminado');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6 text-coffee-dark">Registradora de Visitantes</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Entradas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="atraccion">Atracción</Label>
                <AttractionSelector
                  value={atraccion}
                  onChange={setAtraccion}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cantidad">Cantidad de Visitantes</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="cantidad"
                    type="number"
                    value={cantidadActual}
                    onChange={(e) => setCantidadActual(e.target.value)}
                    placeholder="Número de visitantes"
                    className="flex-grow"
                  />
                  <Button onClick={agregarRegistro} className="bg-coffee hover:bg-coffee-dark">
                    Agregar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Resumen del Día</CardTitle>
              <div className="text-2xl font-bold">
                Total: {totalDia}
              </div>
            </CardHeader>
            <CardContent>
              {registroHorarios.length > 0 ? (
                <div className="space-y-4">
                  {registroHorarios.map((registro, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50"
                    >
                      <div>
                        <span className="font-medium">
                          {registro.hora_inicio} - {registro.hora_fin}
                        </span>
                        <span className="ml-4 text-muted-foreground">
                          {registro.cantidad} visitantes
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => eliminarRegistro(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                      >
                        Eliminar
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No hay registros agregados
                </p>
              )}
              
              <div className="mt-6 flex justify-center">
                <Button 
                  onClick={guardarRegistroCompleto} 
                  className="bg-nature hover:bg-nature-dark"
                  disabled={registroHorarios.length === 0}
                >
                  Guardar Registro del Día
                </Button>
              </div>
            </CardContent>
          </Card>
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

export default RegistradoraPage;
