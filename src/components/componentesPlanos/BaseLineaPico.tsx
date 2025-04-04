import { Line, Text } from "react-konva";

interface Props {
  verticeIzquierdoX: number;
  verticeIzquierdoY: number;
  verticeDerechoX: number;
  verticeDerechoY: number;
  baseAdyacente1: number;
  scaleFactor: number;
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
  scaleFactor,
  baseTrianguloX,
  verticeIzquierdoX1,
  verticeIzquierdoY1,
  verticeDerechoX1,
  verticeDerechoY1,
  baseAdyacente,
  baseTrianguloY,
  separacionLineas,
}: Props) => {
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
        closed={true}
      />
      <Text
        text={`${Math.ceil((2 * baseAdyacente1) / scaleFactor)}`}
        x={baseTrianguloX - 35}
        y={baseTrianguloY + separacionLineas * scaleFactor + 10}
        fontSize={12}
        fill="black"
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
        text={`${Math.ceil((2 * baseAdyacente) / scaleFactor)}`}
        x={baseTrianguloX - 35}
        y={baseTrianguloY + separacionLineas * scaleFactor + 35}
        fontSize={12}
        fill="black"
      />
    </>
  );
};
