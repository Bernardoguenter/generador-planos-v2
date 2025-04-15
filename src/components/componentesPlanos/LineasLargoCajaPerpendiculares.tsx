import { Line, Text } from "react-konva";

interface Props {
  limiteInternoIzqX: number;
  interseccionIzqY: number;
  puntoFinPerpendicularIzqX: number;
  puntoFinPerpendicularIzqY: number;
  limiteInternoDerX: number;
  interseccionDerY: number;
  puntoFinPerpendicularDerX: number;
  puntoFinPerpendicularDerY: number;
  largoTotalLineaPerpendicular: number;
  anguloMedioTecho: number;
}

export const LineasLargoCajaPerpendiculares = ({
  limiteInternoIzqX,
  interseccionIzqY,
  puntoFinPerpendicularIzqX,
  puntoFinPerpendicularIzqY,
  limiteInternoDerX,
  interseccionDerY,
  puntoFinPerpendicularDerX,
  puntoFinPerpendicularDerY,
  largoTotalLineaPerpendicular,
  anguloMedioTecho,
}: Props) => {
  return (
    <>
      <Line
        points={[
          limiteInternoIzqX,
          interseccionIzqY,
          puntoFinPerpendicularIzqX,
          puntoFinPerpendicularIzqY,
        ]}
        strokeWidth={1}
        stroke={"black"}
      />
      <Line
        points={[
          limiteInternoDerX,
          interseccionDerY,
          puntoFinPerpendicularDerX,
          puntoFinPerpendicularDerY,
        ]}
        strokeWidth={1}
        stroke={"black"}
      />
      <Text
        text={`${Math.ceil(largoTotalLineaPerpendicular)}`}
        rotation={-anguloMedioTecho}
        x={puntoFinPerpendicularIzqX - 10}
        y={puntoFinPerpendicularIzqY + 30}
        fill={"black"}
        draggable
      />
    </>
  );
};
