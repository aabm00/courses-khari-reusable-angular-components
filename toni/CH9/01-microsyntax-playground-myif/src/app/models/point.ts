/**
 * INTERFAZ ESTRUCTURAL DE CONTROL:
 * Define de forma inmutable la forma del objeto geométrico que utilizaremos para
 * validar el flujo estricto de tipos e inferencias en las directivas condicionales.
 */
export interface Point {
    readonly x: number;
    readonly y: number;
}
