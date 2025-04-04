import { Line, Text } from "react-konva";
import { calcularPuntosColumna } from "../../utils/calculos";
import { xAxis, yAxis } from "../../utils/constants";
import { useValuesContext } from "../../context/valuesContext";

interface Props {
  finalColsValues: number[];
  scaleFactor: number;
  catetoAdyacente: number;
  verticeIzquierdoX: number;
  verticeIzquierdoY: number;
  verticeDerechoX: number;
  verticeDerechoY: number;
  altoInterno: number;
}

export const Columnas = ({
  finalColsValues,
  scaleFactor,
  catetoAdyacente,
  verticeIzquierdoX,
  verticeIzquierdoY,
  verticeDerechoX,
  verticeDerechoY,
  altoInterno,
}: Props) => {
  const { values, alturaTotal } = useValuesContext();
  const { ancho, anchoColumna, pico, lineaPico } = values;
  return (
    <>
      {finalColsValues.map((columna: number, index: number) => {
        const { puntos, alturaColumna } = calcularPuntosColumna(
          columna,
          xAxis,
          yAxis,
          ancho,
          anchoColumna,
          scaleFactor,
          catetoAdyacente,
          verticeIzquierdoX,
          verticeIzquierdoY,
          verticeDerechoX,
          verticeDerechoY,
          alturaTotal,
          pico,
          lineaPico
        );
        return (
          <>
            <Line
              key={`line-${index}`}
              points={puntos}
              stroke="black"
              strokeWidth={1}
            />

            {index % 2 === 0 ? (
              <Text
                key={`col-text-even-${index}`}
                text={`${Math.ceil(alturaColumna)}`}
                rotation={90}
                x={xAxis + columna * scaleFactor}
                y={yAxis + (altoInterno / 2) * scaleFactor}
                fontSize={12}
                fill="black"
              />
            ) : (
              <Text
                key={`col-text-odd-${index}`}
                text={`${Math.ceil(alturaColumna)}`}
                rotation={90}
                x={xAxis + columna * scaleFactor + 10}
                y={yAxis + (altoInterno / 2) * scaleFactor}
                fontSize={12}
                fill="black"
              />
            )}
          </>
        );
      })}
    </>
  );
};
