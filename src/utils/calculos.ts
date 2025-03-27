// Calcular la longitud de los lados del triángulo del techo
export const calculoLadoTriangulo = (halfBase: number, pico: number) =>
  Math.sqrt(Math.pow(halfBase, 2) + Math.pow(pico, 2));

// Función para calcular el cateto opuesto en un triángulo rectángulo
export function calcularCatetoOpuesto(hipotenusa: number, angulo: number) {
  const anguloRad = angulo * (Math.PI / 180);
  return hipotenusa * Math.sin(anguloRad);
}
