import { Text } from "react-konva";
import { xAxis, yAxis } from "../../utils/constants";
import { useValuesContext } from "../../context/valuesContext";

interface Props {
  scaleFactor: number;
  diferenciaEntreTechos: number;
}

export const DiferenciasText = ({
  scaleFactor,
  diferenciaEntreTechos,
}: Props) => {
  const { alturaTotal } = useValuesContext();
  return (
    <Text
      text={`Diferencia entre largo de techos:${Math.floor(
        diferenciaEntreTechos
      )}`}
      x={xAxis}
      y={yAxis + alturaTotal * scaleFactor + 20}
    />
  );
};
