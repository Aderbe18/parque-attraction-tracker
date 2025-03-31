
import { 
  InspeccionPreoperativa, 
  SolicitudMantenimiento,
  RegistroCombustible,
  RegistroVisitantes,
  ContadorDiario,
  ContadorMensual
} from '@/types';

// Clave para almacenar los datos en localStorage
const STORAGE_KEYS = {
  INSPECCIONES: 'parque_cafe_inspecciones',
  SOLICITUDES: 'parque_cafe_solicitudes',
  COMBUSTIBLE: 'parque_cafe_combustible',
  VISITANTES: 'parque_cafe_visitantes',
  CONTADOR_DIARIO: 'parque_cafe_contador_diario',
  CONTADOR_MENSUAL: 'parque_cafe_contador_mensual',
};

// Funciones para manejar inspecciones preoperativas
export const getInspecciones = (): InspeccionPreoperativa[] => {
  const data = localStorage.getItem(STORAGE_KEYS.INSPECCIONES);
  return data ? JSON.parse(data) : [];
};

export const saveInspeccion = (inspeccion: InspeccionPreoperativa): void => {
  const inspecciones = getInspecciones();
  inspecciones.push(inspeccion);
  localStorage.setItem(STORAGE_KEYS.INSPECCIONES, JSON.stringify(inspecciones));
};

export const updateInspeccion = (inspeccion: InspeccionPreoperativa): void => {
  const inspecciones = getInspecciones();
  const index = inspecciones.findIndex(item => item.id === inspeccion.id);
  
  if (index !== -1) {
    inspecciones[index] = inspeccion;
    localStorage.setItem(STORAGE_KEYS.INSPECCIONES, JSON.stringify(inspecciones));
  }
};

export const deleteInspeccion = (id: string): void => {
  const inspecciones = getInspecciones();
  const filteredInspecciones = inspecciones.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEYS.INSPECCIONES, JSON.stringify(filteredInspecciones));
};

// Funciones para manejar solicitudes de mantenimiento
export const getSolicitudes = (): SolicitudMantenimiento[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SOLICITUDES);
  return data ? JSON.parse(data) : [];
};

export const saveSolicitud = (solicitud: SolicitudMantenimiento): void => {
  const solicitudes = getSolicitudes();
  solicitudes.push(solicitud);
  localStorage.setItem(STORAGE_KEYS.SOLICITUDES, JSON.stringify(solicitudes));
};

export const updateSolicitud = (solicitud: SolicitudMantenimiento): void => {
  const solicitudes = getSolicitudes();
  const index = solicitudes.findIndex(item => item.id === solicitud.id);
  
  if (index !== -1) {
    solicitudes[index] = solicitud;
    localStorage.setItem(STORAGE_KEYS.SOLICITUDES, JSON.stringify(solicitudes));
  }
};

export const deleteSolicitud = (id: string): void => {
  const solicitudes = getSolicitudes();
  const filteredSolicitudes = solicitudes.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEYS.SOLICITUDES, JSON.stringify(filteredSolicitudes));
};

// Funciones para manejar registros de combustible
export const getRegistrosCombustible = (): RegistroCombustible[] => {
  const data = localStorage.getItem(STORAGE_KEYS.COMBUSTIBLE);
  return data ? JSON.parse(data) : [];
};

export const saveRegistroCombustible = (registro: RegistroCombustible): void => {
  const registros = getRegistrosCombustible();
  registros.push(registro);
  localStorage.setItem(STORAGE_KEYS.COMBUSTIBLE, JSON.stringify(registros));
};

// Funciones para manejar registros de visitantes
export const getRegistrosVisitantes = (): RegistroVisitantes[] => {
  const data = localStorage.getItem(STORAGE_KEYS.VISITANTES);
  return data ? JSON.parse(data) : [];
};

export const saveRegistroVisitantes = (registro: RegistroVisitantes): void => {
  const registros = getRegistrosVisitantes();
  registros.push(registro);
  localStorage.setItem(STORAGE_KEYS.VISITANTES, JSON.stringify(registros));
};

// Actualizar el contador diario
export const actualizarContadorDiario = (atraccion: string, fecha: string, cantidad: number): void => {
  const contadores = getContadorDiario();
  
  const existingIndex = contadores.findIndex(
    c => c.atraccion === atraccion && c.fecha === fecha
  );
  
  if (existingIndex !== -1) {
    contadores[existingIndex].cantidad += cantidad;
  } else {
    contadores.push({ atraccion, fecha, cantidad });
  }
  
  localStorage.setItem(STORAGE_KEYS.CONTADOR_DIARIO, JSON.stringify(contadores));
  
  // Actualizar también el contador mensual
  actualizarContadorMensual(atraccion, fecha, cantidad);
};

// Obtener contador diario
export const getContadorDiario = (): ContadorDiario[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CONTADOR_DIARIO);
  return data ? JSON.parse(data) : [];
};

// Funciones para manejar el contador mensual
const getContadorMensual = (): ContadorMensual[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CONTADOR_MENSUAL);
  return data ? JSON.parse(data) : [];
};

const actualizarContadorMensual = (atraccion: string, fecha: string, cantidad: number): void => {
  const contadores = getContadorMensual();
  const mes = fecha.substring(0, 7); // YYYY-MM
  
  let contadorMensual = contadores.find(c => c.atraccion === atraccion && c.mes === mes);
  
  if (!contadorMensual) {
    contadorMensual = {
      mes,
      atraccion,
      total: 0,
      dias: {}
    };
    contadores.push(contadorMensual);
  }
  
  // Actualizar el conteo para este día específico
  if (contadorMensual.dias[fecha]) {
    contadorMensual.dias[fecha] += cantidad;
  } else {
    contadorMensual.dias[fecha] = cantidad;
  }
  
  // Actualizar el total mensual
  contadorMensual.total += cantidad;
  
  localStorage.setItem(STORAGE_KEYS.CONTADOR_MENSUAL, JSON.stringify(contadores));
};

// Obtener estadísticas mensuales para una atracción
export const getEstadisticasMensuales = (atraccion: string, mes: string): ContadorMensual | undefined => {
  const contadores = getContadorMensual();
  return contadores.find(c => c.atraccion === atraccion && c.mes === mes);
};

// Obtener estadísticas para todas las atracciones en un mes específico
export const getEstadisticasPorMes = (mes: string): ContadorMensual[] => {
  const contadores = getContadorMensual();
  return contadores.filter(c => c.mes === mes);
};
