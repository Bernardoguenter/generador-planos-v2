import { Line, Text } from "react-konva";
import { useValuesContext } from "../../context/valuesContext";

interface FijaCorreaLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface Props {
  fijaCorreasLines: FijaCorreaLine[];
  fijaCorreasArr: number[];
  fijaCorreasDist: number;
  verticeDerTechoX: number;
  verticeDerTechoY: number;
  pendienteTecho: number;
  scaleFactor: number;
}

export const FijaCorreas = ({
  fijaCorreasLines,
  fijaCorreasArr,
  fijaCorreasDist,
  verticeDerTechoX,
  verticeDerTechoY,
  pendienteTecho,
  scaleFactor,
}: Props) => {
  const { values } = useValuesContext();
  const { anchoColumna } = values;
  return (
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
      />
    </>
  );
};
