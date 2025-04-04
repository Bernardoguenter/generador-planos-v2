import { Line, Text } from "react-konva";
import { xAxis, yAxis } from "../../utils/constants";
import { useValuesContext } from "../../context/valuesContext";
import { calculoLadoTriangulo } from "../../utils/calculos";

interface Props {
  scaleFactor: number;
  altoInterno: number;
  puntoMedioIzqX: number;
  puntoMedioIzqY: number;
  pendienteTecho: number;
}

export const EstructuraExterna = ({
  scaleFactor,
  altoInterno,
  puntoMedioIzqX,
  puntoMedioIzqY,
  pendienteTecho,
}: Props) => {
  const { alturaTotal, values } = useValuesContext();
  const { ancho, anchoColumna, pico } = values;
  const halfBase = ancho / 2;
  const ladoTecho = calculoLadoTriangulo(halfBase, pico);

  return (
    <>
      <Line
        points={[
          xAxis,
          yAxis, // Esquina superior izquierda
          xAxis,
          yAxis + alturaTotal * scaleFactor, // Esquina inferior izquierda
          xAxis + ancho * scaleFactor,
          yAxis + alturaTotal * scaleFactor, // Esquina inferior derecha
          xAxis + ancho * scaleFactor,
          yAxis, // Esquina superior derecha
        ]}
        strokeWidth={1}
        stroke={"black"}
      />
      <Text
        text={`${Math.ceil(alturaTotal)}`}
        rotation={90}
        x={xAxis - (anchoColumna / 10) * scaleFactor}
        y={yAxis + (altoInterno / 2) * scaleFactor}
      />
      <Text
        text={`${Math.ceil(anchoColumna)}`}
        x={xAxis + (ancho - anchoColumna + 5) * scaleFactor}
        y={yAxis + (alturaTotal - 10) * scaleFactor - 30}
      />
      <Text
        text={`${Math.ceil(pico)}`}
        x={xAxis + (ancho * scaleFactor) / 2 - 40}
        y={yAxis - pico * scaleFactor - 10}
      />
      <Text
        text={`${Math.ceil(ladoTecho)}`}
        x={puntoMedioIzqX}
        y={puntoMedioIzqY - anchoColumna * scaleFactor}
        rotation={-pendienteTecho}
      />
      <Text
        text={`${Math.ceil(ladoTecho)}`}
        x={puntoMedioIzqX}
        y={puntoMedioIzqY - anchoColumna * scaleFactor}
        rotation={-pendienteTecho}
      />
    </>
  );
};
