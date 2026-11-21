/**
 * Utilidades de Validación
 * Funciones para validar modelos de datos según reglas de negocio
 */
import type { Reclamacion, Paciente, Proveedor, NotaClinica, Cita, ResultadoValidacion } from "../types/models";
/**
 * Valida una reclamación completa según reglas de negocio
 * Complejidad temporal: O(n) donde n es cantidad de razones de rechazo
 *
 * @param reclamacion - Reclamación a validar
 * @returns Resultado de validación con lista de errores
 */
export declare function validarReclamacion(reclamacion: Reclamacion): ResultadoValidacion;
/**
 * Valida un paciente completo según reglas de negocio
 * Complejidad temporal: O(1)
 *
 * @param paciente - Paciente a validar
 * @returns Resultado de validación
 */
export declare function validarPaciente(paciente: Paciente): ResultadoValidacion;
/**
 * Valida un proveedor completo según reglas de negocio
 * Complejidad temporal: O(1)
 *
 * @param proveedor - Proveedor a validar
 * @returns Resultado de validación
 */
export declare function validarProveedor(proveedor: Proveedor): ResultadoValidacion;
/**
 * Valida una nota clínica completa según reglas de negocio
 * Complejidad temporal: O(n) donde n es cantidad de arrays
 *
 * @param nota - Nota clínica a validar
 * @returns Resultado de validación
 */
export declare function validarNotaClinica(nota: NotaClinica): ResultadoValidacion;
/**
 * Valida una cita completa según reglas de negocio
 * Complejidad temporal: O(1)
 *
 * @param cita - Cita a validar
 * @returns Resultado de validación
 */
export declare function validarCita(cita: Cita): ResultadoValidacion;
//# sourceMappingURL=validations.d.ts.map