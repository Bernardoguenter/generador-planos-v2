import { Line, Text } from "react-konva";
import { xAxis, yAxis } from "../../utils/constants";
import { useValuesContext } from "../../context/valuesContext";
import { useDrawContext } from "../../context/drawContext";

interface Props {
  catetoAdyacente: number;
  altoInterno: number;
  pendienteTecho: number;
  puntoMedioIzqX: number;
  puntoMedioIzqY: number;
}

export const EstructuraInterna = ({
  catetoAdyacente,
  altoInterno,
  pendienteTecho,
  puntoMedioIzqX,
  puntoMedioIzqY,
}: Props) => {
  const { values, alturaTotal } = useValuesContext();
  const { anchoColumna, ancho, pico } = values;
  const { scaleFactor } = useDrawContext();

  // Calcular la longitud entre el Punto izquierdo interno y el Pico interno central
  const ladoTechoInterno = Math.sqrt(
    Math.pow(xAxis + ancho / 2 - (xAxis + anchoColumna), 2) +
      Math.pow(yAxis - (pico - anchoColumna) - (yAxis + catetoAdyacente), 2)
  );

  return (
    <>
      {alturaTotal > 0 && ancho > 0 && (
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
          {alturaTotal > 0 && (
            <Text
              text={`${Math.ceil(altoInterno)}`}
              rotation={90}
              x={xAxis + anchoColumna * scaleFactor}
              y={yAxis + (altoInterno / 2) * scaleFactor}
              draggable
            />
          )}

          <Text
            text={`${Math.ceil(ladoTechoInterno)}`}
            x={puntoMedioIzqX}
            y={puntoMedioIzqY + anchoColumna * scaleFactor - 15}
            rotation={-pendienteTecho}
            draggable
          />
        </>
      )}
    </>
  );
};
