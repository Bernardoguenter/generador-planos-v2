import { Line, Text } from "react-konva";
import { xAxis, yAxis } from "../../utils/constants";
import { useValuesContext } from "../../context/valuesContext";

interface Props {
  verticeIzqTechoX: number;
  verticeIzqTechoY: number;
  desplazamiento_x: number;
  desplazamiento_y: number;
  scaleFactor: number;
  verticeDerTechoX: number;
  verticeDerTechoY: number;
  anguloBase: number;
}

export const LineasLargoCaja = ({
  verticeIzqTechoX,
  verticeIzqTechoY,
  desplazamiento_x,
  desplazamiento_y,
  scaleFactor,
  verticeDerTechoX,
  verticeDerTechoY,
  anguloBase,
}: Props) => {
  const { values } = useValuesContext();
  const { largoCaja, anchoColumna } = values;
  return (
    <>
      <Line
        points={[
          verticeIzqTechoX,
          verticeIzqTechoY, // Vértice izquierdo del techo
          verticeIzqTechoX + desplazamiento_x * scaleFactor,
          verticeIzqTechoY + desplazamiento_y * scaleFactor, // Punto final para la línea izquierda
        ]}
        strokeWidth={1}
        stroke={"black"}
      />
      <Line
        points={[
          verticeDerTechoX,
          verticeDerTechoY, // Vértice derecho del techo
          verticeDerTechoX - desplazamiento_x * scaleFactor,
          verticeDerTechoY + desplazamiento_y * scaleFactor, // Punto final para la línea derecha
        ]}
        strokeWidth={1}
        stroke={"black"}
      />
      <Text
        text={`${Math.ceil(largoCaja)}`}
        x={xAxis - 10 - anchoColumna * scaleFactor}
        y={yAxis - 10 - anchoColumna * scaleFactor}
        rotation={anguloBase}
        fill={"black"}
      />
    </>
  );
};
