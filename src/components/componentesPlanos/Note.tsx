import { useValuesContext } from "../../context/valuesContext";
import { Text } from "react-konva";

interface Props {
  scaleFactor: number;
}

export const Note = ({ scaleFactor }: Props) => {
  const { note } = useValuesContext();
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
