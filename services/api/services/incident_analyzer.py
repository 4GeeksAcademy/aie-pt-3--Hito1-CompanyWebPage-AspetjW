"""
Servicio compartido de análisis de incidentes.
Lógica de validación, clasificación y cálculo de métricas.
"""

import re
from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Dict, Optional, Tuple
from enum import Enum


class EstadoIncidente(str, Enum):
    """Estados permitidos para incidentes."""
    ENVIADA = "ENVIADA"
    EN_REVISION = "EN_REVISION"
    APROBADA = "APROBADA"
    PARCIALMENTE_APROBADA = "PARCIALMENTE_APROBADA"
    DENEGADA = "DENEGADA"
    APELADA = "APELADA"


class RegionIncidente(str, Enum):
    """Regiones permitidas."""
    US = "US"
    UK = "UK"


class RazonRechazo(str, Enum):
    """Razones de rechazo permitidas."""
    SERVICIOS_NO_AUTORIZADOS = "SERVICIOS_NO_AUTORIZADOS"
    MONTO_EXCEDE_LIMITE = "MONTO_EXCEDE_LIMITE"
    DOCUMENTACION_INCOMPLETA = "DOCUMENTACION_INCOMPLETA"
    FUERA_DE_COBERTURA = "FUERA_DE_COBERTURA"
    DEDUCIBLE_NO_CUMPLIDO = "DEDUCIBLE_NO_CUMPLIDO"
    COPAGO_REQUERIDO = "COPAGO_REQUERIDO"


@dataclass
class RegistroIncidente:
    """Registro de incidente con validación."""
    
    numero_reclamacion: str
    id_paciente: str
    id_proveedor: str
    fecha_envio: str
    monto_reclamacion: float
    estado: str
    region: str
    razones_rechazo: Optional[str] = None
    diagnosticos: Optional[str] = None
    medicamentos: Optional[str] = None
    
    # Metadatos
    es_valido: bool = True
    errores: List[str] = field(default_factory=list)


class ValidadorIncidente:
    """Valida registros de incidentes contra reglas de negocio."""
    
    ESTADOS_PERMITIDOS = {e.value for e in EstadoIncidente}
    REGIONES_PERMITIDAS = {r.value for r in RegionIncidente}
    RAZONES_PERMITIDAS = {r.value for r in RazonRechazo}
    
    @staticmethod
    def validar_fecha(fecha_str: str) -> Tuple[bool, Optional[str]]:
        """Valida fecha en formato YYYY-MM-DD."""
        if not fecha_str or not fecha_str.strip():
            return False, None
        
        try:
            datetime.strptime(fecha_str.strip(), "%Y-%m-%d")
            return True, fecha_str.strip()
        except ValueError:
            return False, None
    
    @staticmethod
    def validar_monto(monto_str: str) -> Tuple[bool, Optional[float]]:
        """Valida que monto sea número positivo."""
        if not monto_str or not str(monto_str).strip():
            return False, None
        
        try:
            monto = float(monto_str)
            if monto <= 0:
                return False, None
            return True, monto
        except (ValueError, TypeError):
            return False, None
    
    @classmethod
    def validar_registro(cls, record: RegistroIncidente) -> RegistroIncidente:
        """
        Valida un registro completo.
        Retorna el registro marcado como válido/inválido con errores.
        """
        errores = []
        
        # Campos obligatorios
        if not record.numero_reclamacion or not record.numero_reclamacion.strip():
            errores.append("numeroReclamacion: campo vacío")
        
        if not record.id_paciente or not record.id_paciente.strip():
            errores.append("idPaciente: campo vacío")
        
        if not record.id_proveedor or not record.id_proveedor.strip():
            errores.append("idProveedor: campo vacío")
        
        # Validar fecha
        if not record.fecha_envio or not record.fecha_envio.strip():
            errores.append("fechaEnvio: campo vacío")
        else:
            es_valida, _ = cls.validar_fecha(record.fecha_envio)
            if not es_valida:
                errores.append(f"fechaEnvio: formato inválido '{record.fecha_envio}'")
        
        # Validar monto
        if not record.monto_reclamacion or str(record.monto_reclamacion).strip() == "":
            errores.append("montoReclamacion: campo vacío")
        else:
            es_valida, _ = cls.validar_monto(str(record.monto_reclamacion))
            if not es_valida:
                errores.append(f"montoReclamacion: debe ser positivo (recibido: {record.monto_reclamacion})")
        
        # Validar estado
        if not record.estado or record.estado.strip() not in cls.ESTADOS_PERMITIDOS:
            errores.append(f"estado: inválido '{record.estado}'")
        
        # Validar región
        if not record.region or record.region.strip() not in cls.REGIONES_PERMITIDAS:
            errores.append(f"region: inválida '{record.region}'")
        
        # Validar razones rechazo si DENEGADA
        if record.estado and record.estado.strip() == "DENEGADA":
            if not record.razones_rechazo or not record.razones_rechazo.strip():
                errores.append("razonesRechazo: obligatorio si estado=DENEGADA")
        
        # Validar diagnósticos
        if not record.diagnosticos or not record.diagnosticos.strip():
            errores.append("diagnosticos: campo vacío (obligatorio)")
        
        record.errores = errores
        record.es_valido = len(errores) == 0
        return record


@dataclass
class EstadisticasIncidentes:
    """Estadísticas calculadas de incidentes."""
    
    total_registros: int
    registros_validos: int
    registros_invalidos: int
    tasa_validez: float
    por_estado: Dict[str, int]
    por_region: Dict[str, int]
    monto_por_estado: Dict[str, float]
    errores_frecuentes: Dict[str, int]


class AnalizadorIncidentes:
    """Analiza un conjunto de registros de incidentes."""
    
    def __init__(self):
        self.registros_validos: List[RegistroIncidente] = []
        self.registros_invalidos: List[RegistroIncidente] = []
        self.estadisticas: Optional[EstadisticasIncidentes] = None
    
    def procesar_registros(self, registros: List[Dict]) -> None:
        """
        Procesa una lista de registros crudos (diccionarios).
        Valida y clasifica cada uno.
        """
        self.registros_validos.clear()
        self.registros_invalidos.clear()
        
        for fila in registros:
            try:
                record = RegistroIncidente(
                    numero_reclamacion=str(fila.get('numeroReclamacion', '')).strip(),
                    id_paciente=str(fila.get('idPaciente', '')).strip(),
                    id_proveedor=str(fila.get('idProveedor', '')).strip(),
                    fecha_envio=str(fila.get('fechaEnvio', '')).strip(),
                    monto_reclamacion=fila.get('montoReclamacion', ''),
                    estado=str(fila.get('estado', '')).strip(),
                    region=str(fila.get('region', '')).strip(),
                    razones_rechazo=str(fila.get('razonesRechazo', '')).strip() or None,
                    diagnosticos=str(fila.get('diagnosticos', '')).strip() or None,
                    medicamentos=str(fila.get('medicamentos', '')).strip() or None,
                )
                
                # Convertir monto a float
                if isinstance(record.monto_reclamacion, str):
                    es_valida, monto = ValidadorIncidente.validar_monto(record.monto_reclamacion)
                    record.monto_reclamacion = monto if es_valida else 0.0
                
                # Validar
                record = ValidadorIncidente.validar_registro(record)
                
                if record.es_valido:
                    self.registros_validos.append(record)
                else:
                    self.registros_invalidos.append(record)
            
            except Exception:
                # Registrar como inválido sin procesar
                record = RegistroIncidente(
                    numero_reclamacion='',
                    id_paciente='',
                    id_proveedor='',
                    fecha_envio='',
                    monto_reclamacion=0.0,
                    estado='',
                    region='',
                    es_valido=False,
                    errores=['Error al procesar registro']
                )
                self.registros_invalidos.append(record)
    
    def calcular_estadisticas(self) -> EstadisticasIncidentes:
        """Calcula métricas sobre registros procesados."""
        total = len(self.registros_validos) + len(self.registros_invalidos)
        
        # Agrupar por estado
        por_estado = {}
        for record in self.registros_validos:
            estado = record.estado
            por_estado[estado] = por_estado.get(estado, 0) + 1
        
        # Agrupar por región
        por_region = {}
        for record in self.registros_validos:
            region = record.region
            por_region[region] = por_region.get(region, 0) + 1
        
        # Monto por estado
        monto_por_estado = {}
        for record in self.registros_validos:
            estado = record.estado
            monto = float(record.monto_reclamacion) if isinstance(record.monto_reclamacion, (int, float)) else 0.0
            monto_por_estado[estado] = monto_por_estado.get(estado, 0.0) + monto
        
        # Errores frecuentes
        errores_conteo = {}
        for record in self.registros_invalidos:
            for error in record.errores:
                clave = error.split(':')[0] if ':' in error else error
                errores_conteo[clave] = errores_conteo.get(clave, 0) + 1
        
        tasa_validez = (len(self.registros_validos) / total * 100) if total > 0 else 0
        
        self.estadisticas = EstadisticasIncidentes(
            total_registros=total,
            registros_validos=len(self.registros_validos),
            registros_invalidos=len(self.registros_invalidos),
            tasa_validez=tasa_validez,
            por_estado=por_estado,
            por_region=por_region,
            monto_por_estado=monto_por_estado,
            errores_frecuentes=dict(sorted(errores_conteo.items(), key=lambda x: x[1], reverse=True))
        )
        
        return self.estadisticas
    
    def obtener_registros_invalidos_detallados(self) -> List[Dict]:
        """Retorna lista de registros inválidos con sus errores detallados."""
        return [
            {
                "numeroReclamacion": r.numero_reclamacion or "N/A",
                "errores": r.errores
            }
            for r in self.registros_invalidos
        ]
