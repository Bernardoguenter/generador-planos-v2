import React from "react";
import { useValuesContext } from "../../context/valuesContext";
import { xAxis, yAxis } from "../../utils/constants";
import { Line, Text } from "react-konva";
import { useDrawContext } from "../../context/drawContext";

interface Props {
  pendienteTecho: number;
}

export const PerfilSobreTecho = ({ pendienteTecho }: Props) => {
  const { values } = useValuesContext();
  const { cantidadPerfilesSobreTecho, pico, ancho, anchoColumna, lineaPico } =
    values;
  const { scaleFactor } = useDrawContext();

  if (!cantidadPerfilesSobreTecho || cantidadPerfilesSobreTecho <= 0)
    return null;

  const alturaDisponible = pico - lineaPico;
  const altoPerfil = alturaDisponible / (cantidadPerfilesSobreTecho + 1);

  const baseTrianguloX = xAxis + (ancho * scaleFactor) / 2;
  const baseTrianguloY = yAxis - (pico - anchoColumna) * scaleFactor;

  const anguloTriangulo = pendienteTecho * (Math.PI / 180);

  return (
    <>
      {Array.from({ length: cantidadPerfilesSobreTecho }).map((_, index) => {
        const alturaTriangulo =
          (lineaPico - anchoColumna + altoPerfil * (index + 1)) * scaleFactor;
        const baseAdyacente = alturaTriangulo / Math.tan(anguloTriangulo);

        const verticeDerechoX = baseTrianguloX + baseAdyacente;
        const verticeDerechoY = baseTrianguloY + alturaTriangulo;

        const verticeIzquierdoX = baseTrianguloX - baseAdyacente;
        const verticeIzquierdoY = verticeDerechoY;

        const largoLinea = Math.sqrt(
          Math.pow(verticeDerechoX - verticeIzquierdoX, 2) +
            Math.pow(verticeDerechoY - verticeIzquierdoY, 2)
        );

        return (
          <React.Fragment key={`perfil-sobre-techo-${index}`}>
            <Line
              points={[
                verticeIzquierdoX,
                verticeIzquierdoY,
                verticeDerechoX,
                verticeDerechoY,
              ]}
              stroke="black"
              strokeWidth={1}
            />
            <Text
              rotation={90}
              text={`${Math.ceil(altoPerfil)}`}
              x={baseTrianguloX}
              y={verticeIzquierdoY}
              fontSize={12}
              fill="black"
              align="center"
              draggable
            />
            <Text
              text={`${Math.ceil(largoLinea)}`}
              x={(verticeIzquierdoX + verticeDerechoX) / 2}
              y={(verticeIzquierdoY + verticeDerechoY) / 2 - 10}
              fontSize={12}
              fill="black"
              align="center"
              draggable
            />
          </React.Fragment>
        );
      })}
    </>
  );
};
