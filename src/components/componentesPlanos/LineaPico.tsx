import { Line, Text } from "react-konva";
import { xAxis, yAxis } from "../../utils/constants";
import { useValuesContext } from "../../context/valuesContext";

interface Props {
  scaleFactor: number;
}

export const LineaPico = ({ scaleFactor }: Props) => {
  const { values } = useValuesContext();
  const { ancho, pico, lineaPico, anchoColumna } = values;

  return (
    <>
      <Line
        points={[
          xAxis + (ancho * scaleFactor) / 2,
          yAxis - pico * scaleFactor, // Pico interno central
          xAxis + (ancho * scaleFactor) / 2,
          yAxis - (pico - lineaPico) * scaleFactor, // Pico interno central
        ]}
        stroke="black"
        strokeWidth={1}
      />
      <Text
        text={`${Math.ceil(lineaPico)}`}
        x={xAxis + (ancho * scaleFactor) / 2}
        y={yAxis - pico * scaleFactor + anchoColumna * scaleFactor}
        fontSize={12}
      />
    </>
  );
};
