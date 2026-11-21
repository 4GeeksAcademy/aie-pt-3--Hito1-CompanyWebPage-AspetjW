"""
Rutas FastAPI para análisis de incidentes.
Endpoints: POST /api/incidents/analyze, GET /api/incidents/results/export
"""

from io import StringIO
import csv
from typing import List

from fastapi import APIRouter, UploadFile, File, HTTPException, Response
from pydantic import BaseModel

from services.incident_analyzer import AnalizadorIncidentes, EstadisticasIncidentes


router = APIRouter(prefix="/api/incidents", tags=["incidents"])


# Esquemas Pydantic
class ErrorDetalle(BaseModel):
    """Detalle de error en registro inválido."""
    numeroReclamacion: str
    errores: List[str]


class AnalisisResponse(BaseModel):
    """Respuesta del análisis de incidentes."""
    total_registros: int
    registros_validos: int
    registros_invalidos: int
    tasa_validez: float
    por_estado: dict
    por_region: dict
    monto_por_estado: dict
    errores_frecuentes: dict
    registros_invalidos_detallados: List[ErrorDetalle]


@router.post("/analyze")
async def analizar_incidentes(file: UploadFile = File(...)) -> AnalisisResponse:
    """
    Analiza un archivo CSV de incidentes.
    
    - Valida campos obligatorios y valores permitidos
    - Clasifica registros válidos e inválidos
    - Calcula estadísticas y métricas
    
    Retorna análisis completo con desglose de errores.
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="El archivo debe ser CSV")
    
    try:
        # Leer contenido del archivo
        contenido = await file.read()
        contenido_str = contenido.decode('utf-8')
        
        # Parsear CSV
        lector = csv.DictReader(StringIO(contenido_str))
        if lector.fieldnames is None:
            raise HTTPException(status_code=400, detail="CSV vacío o malformado")
        
        registros = list(lector)
        
        # Procesar con analizador
        analizador = AnalizadorIncidentes()
        analizador.procesar_registros(registros)
        stats = analizador.calcular_estadisticas()
        
        # Preparar respuesta
        registros_invalidos = analizador.obtener_registros_invalidos_detallados()
        
        return AnalisisResponse(
            total_registros=stats.total_registros,
            registros_validos=stats.registros_validos,
            registros_invalidos=stats.registros_invalidos,
            tasa_validez=stats.tasa_validez,
            por_estado=stats.por_estado,
            por_region=stats.por_region,
            monto_por_estado=stats.monto_por_estado,
            errores_frecuentes=stats.errores_frecuentes,
            registros_invalidos_detallados=registros_invalidos
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando archivo: {str(e)}")


@router.get("/results/export")
async def exportar_resultados() -> Response:
    """
    Exporta los últimos resultados analizados en formato CSV.
    
    Retorna un archivo descargable con métricas agregadas.
    """
    # Nota: En producción, guardaríamos los últimos resultados en caché o BD
    # Por ahora retornamos plantilla de ejemplo
    
    csv_buffer = StringIO()
    writer = csv.writer(csv_buffer)
    
    # Escribir encabezados y datos de ejemplo
    writer.writerow(["MÉTRICA", "VALOR"])
    writer.writerow(["Total de Registros", "100"])
    writer.writerow(["Registros Válidos", "95"])
    writer.writerow(["Registros Inválidos", "5"])
    writer.writerow(["Tasa de Validez (%)", "95.00"])
    
    csv_content = csv_buffer.getvalue()
    
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=incident_results.csv"}
    )
