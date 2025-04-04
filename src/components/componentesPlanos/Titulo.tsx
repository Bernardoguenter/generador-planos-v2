import { Text } from "react-konva";
import { useValuesContext } from "../../context/valuesContext";

interface Props {
  scaleFactor: number;
}

export const Titulo = ({ scaleFactor }: Props) => {
  const { values } = useValuesContext();
  const { ancho, largo, alto, esFrente } = values;
  return (
    <Text
      text={`Galpón de ${ancho / 100}mts de ancho x ${
        largo / 100
      }mts de largo x ${alto / 100}mts de alto  - ${
        esFrente ? "Frente" : "Fondo"
      }`}
      x={0 + innerWidth / 5}
      y={5 + scaleFactor}
      fontSize={16}
      fontStyle="bold"
    />
  );
};
