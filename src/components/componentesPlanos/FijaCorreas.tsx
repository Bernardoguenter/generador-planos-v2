import { Line, Text } from "react-konva";
import { useValuesContext } from "../../context/valuesContext";
import {
  altoFijaCorrea,
  fijaCorreaFinal,
  fijaCorreaInicial,
} from "../../utils/constants";
import { useDrawContext } from "../../context/drawContext";

interface Props {
  verticeDerTechoX: number;
  verticeDerTechoY: number;
  pendienteTecho: number;
  ladoTecho: number;
}

export const FijaCorreas = ({
  verticeDerTechoX,
  verticeDerTechoY,
  pendienteTecho,
  ladoTecho,
}: Props) => {
  const { values } = useValuesContext();
  const { anchoColumna, fijaCorreas } = values;
  const { scaleFactor } = useDrawContext();

  // Calcular distancia entre las fijaCorreas
  const fijaCorreasDist =
    (ladoTecho - fijaCorreaFinal - fijaCorreaInicial) / (fijaCorreas - 1);

  // Crear array de fijaCorreas
  const fijaCorreasArr = Array.from({ length: fijaCorreas }, (_, i) =>
    i === 0 ? fijaCorreaInicial : fijaCorreaInicial + i * fijaCorreasDist
  );

  const fijaCorreasLines = fijaCorreasArr.map((distancia) => {
    const x =
      verticeDerTechoX -
      distancia * Math.cos(pendienteTecho * (Math.PI / 180)) * scaleFactor;
    const y =
      verticeDerTechoY -
      distancia * Math.sin(pendienteTecho * (Math.PI / 180)) * scaleFactor;
    return {
      x1: x,
      y1: y,
      x2: x,
      y2: y - altoFijaCorrea * scaleFactor,
    };
  });
  return (
    <>
      {fijaCorreas > 0 && (
        <>
          {fijaCorreasLines.map((line, index: number) => (
            <>
              <Line
                key={`fijaCorrea-${index}`}
                points={[line.x1, line.y1, line.x2, line.y2]}
                stroke="black"
                strokeWidth={1}
              />
              <Text
                key={`col-text-even-${index}`}
                text={`${Math.ceil(fijaCorreasArr[index])}`}
                x={line.x1 - 15}
                y={line.y1 - 20}
                fontSize={12}
                fill="black"
                draggable
              />
            </>
          ))}
          {/* Distancia entre fijaCorreas */}
          <Text
            text={`${Math.ceil(fijaCorreasDist)}`}
            x={verticeDerTechoX - fijaCorreasDist / 2}
            y={verticeDerTechoY - anchoColumna * 2 * scaleFactor}
            rotation={pendienteTecho}
            fill={"black"}
            draggable
          />
        </>
      )}
    </>
  );
};
