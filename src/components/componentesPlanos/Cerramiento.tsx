import { Line, Text } from "react-konva";
import { xAxis, yAxis } from "../../utils/constants";
import { useValuesContext } from "../../context/valuesContext";
import { useDrawContext } from "../../context/drawContext";

export const Cerramiento = () => {
  const { values } = useValuesContext();
  const { ancho, cerramiento, alto } = values;
  const { scaleFactor } = useDrawContext();

  return (
    <>
      {cerramiento > 0 && alto > 0 && (
        <>
          <Line
            points={[
              xAxis + (ancho + 40) * scaleFactor,
              yAxis,
              xAxis + (ancho + 40) * scaleFactor,
              yAxis + cerramiento * scaleFactor,
            ]}
            strokeWidth={1}
            stroke={"black"}
          />
          <Text
            text={`Cerramiento: ${Math.ceil(cerramiento)}`}
            rotation={90}
            x={xAxis + (ancho + 70) * scaleFactor}
            y={yAxis + (alto - cerramiento) * scaleFactor}
            draggable
          />
        </>
      )}
    </>
  );
};
