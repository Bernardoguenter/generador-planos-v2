import { Line, Text } from "react-konva";
import { Secciones } from "../../utils/types";

interface Props {
  secciones: Secciones[];
  ubicacionPorton: number;
  altoPorton: number | undefined;
  scaleFactor: number;
}

export const Porton = ({
  secciones,
  ubicacionPorton,
  altoPorton = 0,
  scaleFactor,
}: Props) => {
  // Calcular el índice de la sección del portón
  const seccionPortonIndex = ubicacionPorton - 1;
  const seccionPorton = secciones[seccionPortonIndex];

  if (!seccionPorton) return null;

  return (
    <>
      {/* Dibujar la sección del portón */}
      <Line
        points={[
          seccionPorton.xInicio,
          seccionPorton.yInicio, // Punto inferior izquierdo
          seccionPorton.xInicio,
          seccionPorton.yFin, // Punto superior izquierdo
          seccionPorton.xFin,
          seccionPorton.yFin, // Punto superior derecho
          seccionPorton.xFin,
          seccionPorton.yInicio, // Punto inferior derecho
          seccionPorton.xInicio,
          seccionPorton.yInicio, // Cerrar el rectángulo
        ]}
        stroke="black"
        strokeWidth={1}
        closed={true}
      />
      {/* Texto con el ancho de la sección */}
      <Text
        text={`Portón de\n${altoPorton}\nx ${Math.ceil(
          (seccionPorton.xFin - seccionPorton.xInicio) / scaleFactor
        )}`}
        x={(seccionPorton.xInicio + seccionPorton.xFin) / 2 - 40}
        y={(seccionPorton.yInicio + seccionPorton.yFin) / 2 - 30}
        fontSize={20}
        fill="black"
        align="center"
      />
    </>
  );
};
