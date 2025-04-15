import { Line, Text } from "react-konva";
import { xAxis, yAxis } from "../../utils/constants";
import { useValuesContext } from "../../context/valuesContext";
import { useDrawContext } from "../../context/drawContext";

export const AltoPozo = () => {
  const { values, alturaTotal } = useValuesContext();
  const { ancho, altoPozo } = values;
  const { scaleFactor } = useDrawContext();
  return (
    <>
      <Line
        points={[
          xAxis,
          yAxis + (alturaTotal - altoPozo) * scaleFactor,
          xAxis + ancho * scaleFactor,
          yAxis + (alturaTotal - altoPozo) * scaleFactor,
        ]}
        strokeWidth={1}
        stroke={"black"}
      />
      <Text
        text={`${Math.ceil(altoPozo)}`}
        rotation={90}
        x={xAxis}
        y={yAxis + (alturaTotal - altoPozo) * scaleFactor}
        draggable
      />
    </>
  );
};
