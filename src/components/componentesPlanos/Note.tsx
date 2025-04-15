import { useDrawContext } from "../../context/drawContext";
import { useValuesContext } from "../../context/valuesContext";
import { Text } from "react-konva";

export const Note = () => {
  const { note } = useValuesContext();
  const { scaleFactor } = useDrawContext();
  return (
    <>
      {note && (
        <Text
          text={note}
          x={innerWidth / 5}
          y={25 + scaleFactor}
          fontSize={12}
        />
      )}
    </>
  );
};
