import { Line } from "react-konva";
import { useValuesContext } from "../../context/valuesContext";
import { xAxis, yAxis } from "../../utils/constants";

interface Props {
  scaleFactor: number;
  catetoAdyacente: number;
}

export const TechoExterno = ({ scaleFactor, catetoAdyacente }: Props) => {
  const { values } = useValuesContext();
  const { ancho, pico, anchoColumna } = values;
  return (
    <>
      <Line
        points={[
          xAxis,
          yAxis, // Punto izquierdo del techo
          xAxis + (ancho * scaleFactor) / 2,
          yAxis - pico * scaleFactor, // Pico central
          xAxis + ancho * scaleFactor,
          yAxis, // Punto derecho del techo
        ]}
        strokeWidth={1}
        stroke={"black"}
      />
      <Line
        points={[
          xAxis + anchoColumna * scaleFactor,
          yAxis + catetoAdyacente * scaleFactor, // Punto izquierdo interno
          xAxis + (ancho * scaleFactor) / 2,
          yAxis - (pico - anchoColumna) * scaleFactor, // Pico interno central
          xAxis + (ancho - anchoColumna) * scaleFactor,
          yAxis + catetoAdyacente * scaleFactor, // Punto derecho interno
        ]}
        stroke="black"
        strokeWidth={1}
      />
    </>
  );
};
