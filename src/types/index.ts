
// Tipos de datos para la aplicación

// Tipo para la inspección preoperativa
export interface InspeccionPreoperativa {
  id: string;
  atraccion: string;
  fecha: string;
  realizada_por: string;
  limpieza: boolean;
  estado_general: 'Bueno' | 'Regular' | 'Malo';
  observaciones: string;
  items_verificados: ItemVerificado[];
}

// Tipo para item verificado en inspección
export interface ItemVerificado {
  nombre: string;
  estado: 'OK' | 'No OK' | 'N/A';
  observaciones?: string;
}

// Tipo para solicitud de mantenimiento
export interface SolicitudMantenimiento {
  id: string;
  atraccion: string;
  fecha_solicitud: string;
  solicitante: string;
  urgencia: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  descripcion: string;
  estado: 'Pendiente' | 'En Proceso' | 'Completada' | 'Cancelada';
  fecha_resolucion?: string;
}

// Tipo para registro de combustible
export interface RegistroCombustible {
  id: string;
  atraccion: string;
  fecha: string;
  cantidad_galones: number;
  tipo_combustible: string;
  responsable: string;
}

// Tipo para contador de visitantes (registradora)
export interface RegistroVisitantes {
  id: string;
  atraccion: string;
  fecha: string;
  total_visitantes: number;
  horarios: HorarioVisitantes[];
}

// Tipo para horarios de visitantes
export interface HorarioVisitantes {
  hora_inicio: string; // Formato HH:MM
  hora_fin: string; // Formato HH:MM
  cantidad: number;
}

// Tipo para contador diario
export interface ContadorDiario {
  fecha: string; // YYYY-MM-DD
  atraccion: string;
  cantidad: number;
}

// Tipo para contador mensual (acumulado)
export interface ContadorMensual {
  mes: string; // YYYY-MM
  atraccion: string;
  total: number;
  dias: {
    [fecha: string]: number; // YYYY-MM-DD: cantidad
  };
}
