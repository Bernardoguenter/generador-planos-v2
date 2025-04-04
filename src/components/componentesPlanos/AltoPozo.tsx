import { Line, Text } from "react-konva";
import { xAxis, yAxis } from "../../utils/constants";
import { useValuesContext } from "../../context/valuesContext";

interface Props {
  scaleFactor: number;
}

export const AltoPozo = ({ scaleFactor }: Props) => {
  const { values, alturaTotal } = useValuesContext();
  const { ancho, altoPozo } = values;
  return (
    <>
      <Line
        points={[
          xAxis,
          yAxis + (alturaTotal - altoPozo) * scaleFactor, // Esquina inferior izquierda
          xAxis + ancho * scaleFactor,
          yAxis + (alturaTotal - altoPozo) * scaleFactor, // Esquina inferior derecha
        ]}
        strokeWidth={1}
        stroke={"black"}
      />
      <Text
        text={`${Math.ceil(altoPozo)}`}
        rotation={90}
        x={xAxis}
        y={yAxis + (alturaTotal - altoPozo) * scaleFactor}
      />
    </>
  );
};
