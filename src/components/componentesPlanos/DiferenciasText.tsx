import { Text } from "react-konva";
import { xAxis, yAxis } from "../../utils/constants";
import { useValuesContext } from "../../context/valuesContext";
import { useDrawContext } from "../../context/drawContext";

interface Props {
  diferenciaEntreTechos: number;
}

export const DiferenciasText = ({ diferenciaEntreTechos }: Props) => {
  const { alturaTotal } = useValuesContext();
  const { scaleFactor } = useDrawContext();

  return (
    <Text
      text={`Diferencia entre largo de techos:${Math.floor(
        diferenciaEntreTechos
      )}`}
      x={xAxis}
      y={yAxis + alturaTotal * scaleFactor + 20}
      draggable
    />
  );
};
