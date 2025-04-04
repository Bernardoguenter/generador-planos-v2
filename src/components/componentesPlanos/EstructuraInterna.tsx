import { Line, Text } from "react-konva";
import { xAxis, yAxis } from "../../utils/constants";
import { useValuesContext } from "../../context/valuesContext";

interface Props {
  scaleFactor: number;
  catetoAdyacente: number;
  altoInterno: number;
  ladoTechoInterno: number;
  pendienteTecho: number;
  puntoMedioIzqX: number;
  puntoMedioIzqY: number;
}

export const EstructuraInterna = ({
  scaleFactor,
  catetoAdyacente,
  altoInterno,
  ladoTechoInterno,
  pendienteTecho,
  puntoMedioIzqX,
  puntoMedioIzqY,
}: Props) => {
  const { values, alturaTotal } = useValuesContext();
  const { anchoColumna, ancho } = values;
  return (
    <>
      <Line
        points={[
          xAxis + anchoColumna * scaleFactor,
          yAxis + catetoAdyacente * scaleFactor, // Esquina superior izquierda
          xAxis + anchoColumna * scaleFactor,
          yAxis + alturaTotal * scaleFactor, // Esquina inferior izquierda
          xAxis - anchoColumna * scaleFactor + ancho * scaleFactor,
          yAxis + alturaTotal * scaleFactor, // Esquina inferior derecha
          xAxis - anchoColumna * scaleFactor + ancho * scaleFactor,
          yAxis + catetoAdyacente * scaleFactor, // Esquina superior derecha
        ]}
        strokeWidth={1}
        stroke={"black"}
      />
      <Text
        text={`${Math.ceil(altoInterno)}`}
        rotation={90}
        x={xAxis + anchoColumna * scaleFactor}
        y={yAxis + (altoInterno / 2) * scaleFactor}
      />
      <Text
        text={`${Math.ceil(ladoTechoInterno)}`}
        x={puntoMedioIzqX}
        y={puntoMedioIzqY + anchoColumna * scaleFactor - 15}
        rotation={-pendienteTecho}
      />
    </>
  );
};
