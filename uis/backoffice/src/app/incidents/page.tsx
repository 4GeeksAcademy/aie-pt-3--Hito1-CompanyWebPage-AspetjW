'use client';

import React, { useState, useRef } from 'react';

interface AnalisisResult {
  total_registros: number;
  registros_validos: number;
  registros_invalidos: number;
  tasa_validez: number;
  por_estado: Record<string, number>;
  por_region: Record<string, number>;
  monto_por_estado: Record<string, number>;
  errores_frecuentes: Record<string, number>;
  registros_invalidos_detallados: Array<{
    numeroReclamacion: string;
    errores: string[];
  }>;
}

export default function IncidentsPage() {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState<AnalisisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [dragActivo, setDragActivo] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const manejarArchivoSeleccionado = (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Por favor selecciona un archivo CSV válido');
      return;
    }
    setArchivo(file);
    setError('');
  };

  const manejarDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActivo(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      manejarArchivoSeleccionado(files[0]);
    }
  };

  const manejarArrastrar = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActivo(true);
  };

  const manejarArrastrarSalir = () => {
    setDragActivo(false);
  };

  const analizarArchivo = async () => {
    if (!archivo) {
      setError('Selecciona un archivo primero');
      return;
    }

    setCargando(true);
    setError('');
    setResultado(null);

    try {
      const formData = new FormData();
      formData.append('file', archivo);

      const response = await fetch('/api/incidents/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al analizar archivo');
      }

      const datos = await response.json();
      setResultado(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setCargando(false);
    }
  };

  const descargarResultados = async () => {
    try {
      const response = await fetch('/api/incidents/results/export');
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const enlace = document.createElement('a');
      enlace.href = url;
      enlace.download = 'incident_results.csv';
      document.body.appendChild(enlace);
      enlace.click();
      document.body.removeChild(enlace);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Error al descargar resultados');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📊 Analizador de Incidentes
          </h1>
          <p className="text-gray-600">
            Carga un archivo CSV de incidentes para validar, clasificar y analizar registros
          </p>
        </div>

        {/* Área de carga */}
        <div className="mb-8">
          <div
            className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all ${
              dragActivo
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
            onDrop={manejarDrop}
            onDragOver={manejarArrastrar}
            onDragLeave={manejarArrastrarSalir}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                inputRef.current?.click();
              }
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  manejarArchivoSeleccionado(e.target.files[0]);
                }
              }}
              className="hidden"
              aria-label="Seleccionar archivo CSV"
            />
            
            <div className="text-5xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Arrastra tu archivo CSV aquí
            </h3>
            <p className="text-gray-600 mb-4">o haz clic para seleccionar un archivo</p>
            
            {archivo && (
              <p className="text-green-600 font-medium">
                ✅ Archivo seleccionado: {archivo.name}
              </p>
            )}
          </div>
        </div>

        {/* Botón analizar */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={analizarArchivo}
            disabled={!archivo || cargando}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            aria-busy={cargando}
          >
            {cargando ? '⏳ Analizando...' : '🔍 Analizar Archivo'}
          </button>
          
          {resultado && (
            <button
              onClick={descargarResultados}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              📥 Descargar Resultados CSV
            </button>
          )}
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            ❌ {error}
          </div>
        )}

        {/* Resultados */}
        {resultado && (
          <div className="space-y-8">
            {/* Tarjetas KPI */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <p className="text-gray-600 text-sm font-medium">Total Registros</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {resultado.total_registros}
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6 shadow-sm border border-green-200">
                <p className="text-green-700 text-sm font-medium">Válidos</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {resultado.registros_validos}
                </p>
              </div>
              
              <div className="bg-red-50 rounded-lg p-6 shadow-sm border border-red-200">
                <p className="text-red-700 text-sm font-medium">Inválidos</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {resultado.registros_invalidos}
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6 shadow-sm border border-blue-200">
                <p className="text-blue-700 text-sm font-medium">Tasa Validez</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {resultado.tasa_validez.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Distribuciones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Por Estado */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  📊 Distribución por Estado
                </h3>
                <div className="space-y-3">
                  {Object.entries(resultado.por_estado).map(([estado, cantidad]) => (
                    <div key={estado}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{estado}</span>
                        <span className="text-gray-600">{cantidad}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${
                              (cantidad / resultado.registros_validos) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Por Región */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  🌍 Distribución por Región
                </h3>
                <div className="space-y-3">
                  {Object.entries(resultado.por_region).map(([region, cantidad]) => (
                    <div key={region}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{region}</span>
                        <span className="text-gray-600">{cantidad}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${
                              (cantidad / resultado.registros_validos) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Montos */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                💰 Montos Totales por Estado (USD)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(resultado.monto_por_estado)
                  .sort((a, b) => b[1] - a[1])
                  .map(([estado, monto]) => (
                    <div
                      key={estado}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium text-gray-700">{estado}</span>
                      <span className="text-xl font-bold text-gray-900">
                        ${monto.toLocaleString('es-ES', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Errores Frecuentes */}
            {Object.keys(resultado.errores_frecuentes).length > 0 && (
              <div className="bg-red-50 rounded-lg p-6 shadow-sm border border-red-200">
                <h3 className="text-lg font-bold text-red-900 mb-4">
                  ⚠️ Errores Más Frecuentes
                </h3>
                <div className="space-y-2">
                  {Object.entries(resultado.errores_frecuentes)
                    .slice(0, 10)
                    .map(([error, conteo]) => (
                      <div
                        key={error}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-red-800">{error}</span>
                        <span className="font-semibold text-red-600">{conteo}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Registros Inválidos Detallados */}
            {resultado.registros_invalidos_detallados.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  📋 Registros Inválidos (Primeros 20)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 font-semibold text-gray-700">
                          Número Reclamación
                        </th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700">
                          Errores
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultado.registros_invalidos_detallados
                        .slice(0, 20)
                        .map((registro, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-2 px-3 text-gray-900 font-medium">
                              {registro.numeroReclamacion}
                            </td>
                            <td className="py-2 px-3 text-red-600">
                              {registro.errores.join('; ')}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                {resultado.registros_invalidos_detallados.length > 20 && (
                  <p className="text-sm text-gray-600 mt-4">
                    ... y {resultado.registros_invalidos_detallados.length - 20} más
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
