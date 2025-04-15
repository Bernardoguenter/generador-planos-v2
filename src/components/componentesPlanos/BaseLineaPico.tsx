import { Line, Text } from "react-konva";
import { useDrawContext } from "../../context/drawContext";

interface Props {
  verticeIzquierdoX: number;
  verticeIzquierdoY: number;
  verticeDerechoX: number;
  verticeDerechoY: number;
  baseAdyacente1: number;
  baseTrianguloX: number;
  verticeIzquierdoX1: number;
  verticeIzquierdoY1: number;
  verticeDerechoX1: number;
  verticeDerechoY1: number;
  baseAdyacente: number;
  baseTrianguloY: number;
  separacionLineas: number;
}

export const BaseLineaPico = ({
  verticeIzquierdoX,
  verticeIzquierdoY,
  verticeDerechoX,
  verticeDerechoY,
  baseAdyacente1,
  baseTrianguloX,
  verticeIzquierdoX1,
  verticeIzquierdoY1,
  verticeDerechoX1,
  verticeDerechoY1,
  baseAdyacente,
  baseTrianguloY,
  separacionLineas,
}: Props) => {
  const { scaleFactor } = useDrawContext();

  console.log({
    verticeIzquierdoX,
    verticeIzquierdoY,
    verticeDerechoX,
    verticeDerechoY,
    baseAdyacente1,
    baseTrianguloX,
    verticeIzquierdoX1,
    verticeIzquierdoY1,
    verticeDerechoX1,
    verticeDerechoY1,
    baseAdyacente,
    baseTrianguloY,
    separacionLineas,
  });

  const baseLineaPicoInferior = (2 * baseAdyacente1) / scaleFactor;
  const baseLineaPicoSuperior = (2 * baseAdyacente) / scaleFactor;

  return (
    <>
      {/* Base Línea Pico Inferior */}
      <Line
        points={[
          verticeIzquierdoX,
          verticeIzquierdoY, // Vértice izquierdo
          verticeDerechoX,
          verticeDerechoY, // Vértice derecho
        ]}
        stroke="black"
        strokeWidth={1}
      />
      <Text
        text={`${Math.ceil(baseLineaPicoInferior)}`}
        x={baseTrianguloX - 35}
        y={baseTrianguloY + separacionLineas * scaleFactor + 10}
        fontSize={12}
        fill="black"
        draggable
      />
      {/* Base Línea Pico Superior*/}
      <Line
        points={[
          verticeIzquierdoX1,
          verticeIzquierdoY1, // Vértice izquierdo
          verticeDerechoX1,
          verticeDerechoY1, // Vértice derecho
        ]}
        stroke="black"
        strokeWidth={1}
      />

      <Text
        text={`${Math.ceil(baseLineaPicoSuperior)}`}
        x={baseTrianguloX - 35}
        y={baseTrianguloY + separacionLineas * scaleFactor + 35}
        fontSize={12}
        fill="black"
        draggable
      />
    </>
  );
};
