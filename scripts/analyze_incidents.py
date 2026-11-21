#!/usr/bin/env python3
"""
Script CLI para análisis de incidentes médicos desde CSV.
Valida campos obligatorios, clasifica registros corruptos y calcula métricas.

Uso:
  python scripts/analyze_incidents.py <ruta_csv>
  
  Ejemplo:
  python scripts/analyze_incidents.py data/incidents.csv
"""

import sys
import csv
import re
from pathlib import Path
from dataclasses import dataclass
from typing import List, Dict, Optional, Tuple
from datetime import datetime


@dataclass
class IncidentRecord:
    """Representa un registro de incidente."""
    
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
    
    # Metadatos de validación
    es_valido: bool = True
    errores: List[str] = None
    
    def __post_init__(self):
        if self.errores is None:
            self.errores = []


class IncidentValidator:
    """Valida registros de incidentes contra reglas de negocio."""
    
    # Estados permitidos según BRIEFING.md
    ESTADOS_PERMITIDOS = {
        "ENVIADA", "EN_REVISION", "APROBADA", 
        "PARCIALMENTE_APROBADA", "DENEGADA", "APELADA"
    }
    
    # Regiones permitidas
    REGIONES_PERMITIDAS = {"US", "UK"}
    
    # Razones de rechazo permitidas
    RAZONES_PERMITIDAS = {
        "SERVICIOS_NO_AUTORIZADOS",
        "MONTO_EXCEDE_LIMITE",
        "DOCUMENTACION_INCOMPLETA",
        "FUERA_DE_COBERTURA",
        "DEDUCIBLE_NO_CUMPLIDO",
        "COPAGO_REQUERIDO"
    }
    
    @staticmethod
    def validar_email(email: str) -> bool:
        """Valida formato de email."""
        patron = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        return re.match(patron, email) is not None if email else False
    
    @staticmethod
    def validar_fecha(fecha_str: str) -> Tuple[bool, Optional[str]]:
        """Valida y parsea fecha en formato YYYY-MM-DD."""
        try:
            datetime.strptime(fecha_str, "%Y-%m-%d")
            return True, fecha_str
        except ValueError:
            return False, None
    
    @staticmethod
    def validar_monto(monto_str: str) -> Tuple[bool, Optional[float]]:
        """Valida que monto sea número positivo."""
        try:
            monto = float(monto_str)
            if monto <= 0:
                return False, None
            return True, monto
        except (ValueError, TypeError):
            return False, None
    
    @classmethod
    def validar_registro(cls, record: IncidentRecord) -> IncidentRecord:
        """
        Valida un registro completo según reglas de negocio.
        Retorna el registro marcado como válido/inválido con errores detallados.
        """
        errores = []
        
        # Validar campos obligatorios no vacíos
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
            errores.append(f"estado: inválido '{record.estado}' (permitidos: {', '.join(cls.ESTADOS_PERMITIDOS)})")
        
        # Validar región
        if not record.region or record.region.strip() not in cls.REGIONES_PERMITIDAS:
            errores.append(f"region: inválida '{record.region}' (permitidas: {', '.join(cls.REGIONES_PERMITIDAS)})")
        
        # Validar razones rechazo si estado = DENEGADA
        if record.estado and record.estado.strip() == "DENEGADA":
            if not record.razones_rechazo or not record.razones_rechazo.strip():
                errores.append("razonesRechazo: obligatorio si estado=DENEGADA")
        
        # Validar diagnósticos (no deben estar vacíos)
        if not record.diagnosticos or not record.diagnosticos.strip():
            errores.append("diagnosticos: campo vacío (obligatorio)")
        
        # Validar medicamentos
        if not record.medicamentos or not record.medicamentos.strip():
            errores.append("medicamentos: campo vacío (opcional, pero recomendado)")
        
        record.errores = errores
        record.es_valido = len(errores) == 0
        return record


class IncidentAnalyzer:
    """Analiza un conjunto de registros de incidentes."""
    
    def __init__(self):
        self.registros_validos: List[IncidentRecord] = []
        self.registros_invalidos: List[IncidentRecord] = []
        self.estadisticas: Dict = {}
    
    def cargar_csv(self, ruta_archivo: str) -> bool:
        """
        Carga registros desde CSV.
        Retorna True si se cargaron exitosamente, False en caso de error.
        """
        try:
            ruta = Path(ruta_archivo)
            if not ruta.exists():
                print(f"❌ Error: Archivo no encontrado: {ruta_archivo}", file=sys.stderr)
                return False
            
            with open(ruta, 'r', encoding='utf-8') as f:
                lector = csv.DictReader(f)
                if lector.fieldnames is None:
                    print("❌ Error: CSV vacío o malformado", file=sys.stderr)
                    return False
                
                for idx, fila in enumerate(lector, start=2):  # Empezar en 2 (tras header)
                    try:
                        record = IncidentRecord(
                            numero_reclamacion=fila.get('numeroReclamacion', '').strip(),
                            id_paciente=fila.get('idPaciente', '').strip(),
                            id_proveedor=fila.get('idProveedor', '').strip(),
                            fecha_envio=fila.get('fechaEnvio', '').strip(),
                            monto_reclamacion=fila.get('montoReclamacion', '').strip(),
                            estado=fila.get('estado', '').strip(),
                            region=fila.get('region', '').strip(),
                            razones_rechazo=fila.get('razonesRechazo', '').strip() or None,
                            diagnosticos=fila.get('diagnosticos', '').strip() or None,
                            medicamentos=fila.get('medicamentos', '').strip() or None,
                        )
                        
                        # Validar
                        record = IncidentValidator.validar_registro(record)
                        
                        if record.es_valido:
                            self.registros_validos.append(record)
                        else:
                            self.registros_invalidos.append(record)
                    
                    except Exception as e:
                        print(f"⚠️  Fila {idx}: Error al procesar → {str(e)}", file=sys.stderr)
                        continue
            
            return True
        
        except IOError as e:
            print(f"❌ Error de lectura de archivo: {str(e)}", file=sys.stderr)
            return False
        except Exception as e:
            print(f"❌ Error inesperado: {str(e)}", file=sys.stderr)
            return False
    
    def calcular_estadisticas(self) -> Dict:
        """Calcula métricas sobre los registros cargados."""
        total_registros = len(self.registros_validos) + len(self.registros_invalidos)
        
        # Agrupar por estado
        por_estado = {}
        for record in self.registros_validos:
            estado = record.estado
            if estado not in por_estado:
                por_estado[estado] = 0
            por_estado[estado] += 1
        
        # Agrupar por región
        por_region = {}
        for record in self.registros_validos:
            region = record.region
            if region not in por_region:
                por_region[region] = 0
            por_region[region] += 1
        
        # Monto total por estado
        monto_por_estado = {}
        for record in self.registros_validos:
            estado = record.estado
            if estado not in monto_por_estado:
                monto_por_estado[estado] = 0.0
            try:
                monto_por_estado[estado] += float(record.monto_reclamacion) if isinstance(record.monto_reclamacion, (int, float)) else 0
            except (ValueError, TypeError):
                pass
        
        # Errores más frecuentes
        errores_conteo = {}
        for record in self.registros_invalidos:
            for error in record.errores:
                clave_error = error.split(':')[0] if ':' in error else error
                errores_conteo[clave_error] = errores_conteo.get(clave_error, 0) + 1
        
        self.estadisticas = {
            "total_registros": total_registros,
            "registros_validos": len(self.registros_validos),
            "registros_invalidos": len(self.registros_invalidos),
            "tasa_validez": (len(self.registros_validos) / total_registros * 100) if total_registros > 0 else 0,
            "por_estado": por_estado,
            "por_region": por_region,
            "monto_por_estado": monto_por_estado,
            "errores_frecuentes": dict(sorted(errores_conteo.items(), key=lambda x: x[1], reverse=True))
        }
        
        return self.estadisticas
    
    def imprimir_reporte(self):
        """Imprime un reporte formateado en consola."""
        stats = self.estadisticas
        
        print("\n" + "="*80)
        print("📊 REPORTE DE ANÁLISIS DE INCIDENTES".center(80))
        print("="*80)
        
        # Resumen general
        print(f"\n📈 RESUMEN GENERAL")
        print("-" * 80)
        print(f"  Total de registros:     {stats['total_registros']:>10}")
        print(f"  Registros válidos:      {stats['registros_validos']:>10} ({stats['tasa_validez']:.1f}%)")
        print(f"  Registros inválidos:    {stats['registros_invalidos']:>10} ({100-stats['tasa_validez']:.1f}%)")
        
        # Distribución por estado
        print(f"\n🏥 DISTRIBUCIÓN POR ESTADO")
        print("-" * 80)
        for estado, cantidad in sorted(stats['por_estado'].items()):
            porcentaje = (cantidad / stats['registros_validos'] * 100) if stats['registros_validos'] > 0 else 0
            barra = "█" * int(porcentaje / 2)
            print(f"  {estado:<20} {cantidad:>6}  ({porcentaje:>5.1f}%) {barra}")
        
        # Distribución por región
        print(f"\n🌍 DISTRIBUCIÓN POR REGIÓN")
        print("-" * 80)
        for region, cantidad in sorted(stats['por_region'].items()):
            porcentaje = (cantidad / stats['registros_validos'] * 100) if stats['registros_validos'] > 0 else 0
            barra = "█" * int(porcentaje / 2)
            print(f"  {region:<20} {cantidad:>6}  ({porcentaje:>5.1f}%) {barra}")
        
        # Montos por estado
        print(f"\n💰 MONTOS TOTALES POR ESTADO (USD)")
        print("-" * 80)
        for estado, monto in sorted(stats['monto_por_estado'].items(), key=lambda x: x[1], reverse=True):
            print(f"  {estado:<20} ${monto:>15,.2f}")
        
        # Errores más comunes
        if stats['registros_invalidos'] > 0:
            print(f"\n⚠️  ERRORES MÁS FRECUENTES")
            print("-" * 80)
            for error, conteo in list(stats['errores_frecuentes'].items())[:10]:
                porcentaje = (conteo / stats['registros_invalidos'] * 100)
                barra = "█" * int(porcentaje / 5)
                print(f"  {error:<35} {conteo:>5}  ({porcentaje:>5.1f}%) {barra}")
        
        print("\n" + "="*80 + "\n")
    
    def exportar_csv(self, ruta_salida: str = "results.csv") -> bool:
        """Exporta estadísticas a CSV."""
        try:
            with open(ruta_salida, 'w', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                
                # Header
                writer.writerow(["MÉTRICA", "VALOR"])
                
                # Resumen
                writer.writerow(["Total de Registros", self.estadisticas['total_registros']])
                writer.writerow(["Registros Válidos", self.estadisticas['registros_validos']])
                writer.writerow(["Registros Inválidos", self.estadisticas['registros_invalidos']])
                writer.writerow(["Tasa de Validez (%)", f"{self.estadisticas['tasa_validez']:.2f}"])
                
                # Distribución por estado
                writer.writerow([])
                writer.writerow(["DISTRIBUCIÓN POR ESTADO"])
                for estado, cantidad in sorted(self.estadisticas['por_estado'].items()):
                    writer.writerow([f"  {estado}", cantidad])
                
                # Distribución por región
                writer.writerow([])
                writer.writerow(["DISTRIBUCIÓN POR REGIÓN"])
                for region, cantidad in sorted(self.estadisticas['por_region'].items()):
                    writer.writerow([f"  {region}", cantidad])
                
                # Montos
                writer.writerow([])
                writer.writerow(["MONTOS POR ESTADO (USD)"])
                for estado, monto in sorted(self.estadisticas['monto_por_estado'].items(), key=lambda x: x[1], reverse=True):
                    writer.writerow([f"  {estado}", f"{monto:.2f}"])
                
                # Errores
                if self.estadisticas['registros_invalidos'] > 0:
                    writer.writerow([])
                    writer.writerow(["ERRORES FRECUENTES"])
                    for error, conteo in list(self.estadisticas['errores_frecuentes'].items())[:10]:
                        writer.writerow([f"  {error}", conteo])
            
            print(f"✅ Resultados exportados a: {ruta_salida}")
            return True
        
        except IOError as e:
            print(f"❌ Error al exportar CSV: {str(e)}", file=sys.stderr)
            return False
        except Exception as e:
            print(f"❌ Error inesperado al exportar: {str(e)}", file=sys.stderr)
            return False


def main():
    """Punto de entrada del script CLI."""
    if len(sys.argv) < 2:
        print("❌ Uso: python scripts/analyze_incidents.py <ruta_csv>", file=sys.stderr)
        print("   Ejemplo: python scripts/analyze_incidents.py data/incidents.csv", file=sys.stderr)
        sys.exit(1)
    
    ruta_csv = sys.argv[1]
    
    # Crear analizador
    analizador = IncidentAnalyzer()
    
    # Cargar CSV
    print(f"📂 Cargando archivo: {ruta_csv}")
    if not analizador.cargar_csv(ruta_csv):
        sys.exit(1)
    
    # Calcular estadísticas
    print("🔍 Analizando registros...")
    analizador.calcular_estadisticas()
    
    # Imprimir reporte
    analizador.imprimir_reporte()
    
    # Preguntar si exportar
    while True:
        respuesta = input("📥 ¿Exportar resultados a CSV? [y/n]: ").strip().lower()
        if respuesta in ['y', 'yes', 's', 'sí']:
            if analizador.exportar_csv("results.csv"):
                print("✅ Proceso completado exitosamente")
            sys.exit(0)
        elif respuesta in ['n', 'no']:
            print("✅ Proceso completado sin exportar")
            sys.exit(0)
        else:
            print("⚠️  Por favor ingresa 'y' o 'n'")


if __name__ == "__main__":
    main()
