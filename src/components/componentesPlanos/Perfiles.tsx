import React from "react";
import { Line, Text } from "react-konva";
import { useValuesContext } from "../../context/valuesContext";
import { Secciones } from "../../utils/types";
import { separacionPrimerPerfil, xAxis, yAxis } from "../../utils/constants";
import { calcularLineasPerfiles } from "../../utils/calculos";
import { useDrawContext } from "../../context/drawContext";

interface LineGroup {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  longitud: number;
}

interface Props {
  finalColsValues: number[];
  secciones: Secciones[];
}

export const Perfiles = ({ finalColsValues, secciones }: Props) => {
  const { values } = useValuesContext();
  const {
    tienePorton,
    ubicacionPorton,
    perfiles,
    cerramiento,
    ancho,
    alto,
    altoPozo,
    anchoColumna,
  } = values;
  const { scaleFactor } = useDrawContext();

  const calcularAltoPerfiles = (perfiles: number) => {
    const alturaDisponible = cerramiento - separacionPrimerPerfil;
    return perfiles > 0 && alturaDisponible > 0
      ? alturaDisponible / perfiles
      : 0;
  };

  // Calcular el alto de cada perfil
  const altoPerfil = calcularAltoPerfiles(perfiles);

  // Crear array de perfiles
  const perfilesArr = Array.from(
    { length: perfiles },
    (_, i) => separacionPrimerPerfil + i * altoPerfil
  );

  // Calcular las coordenadas de los perfiles
  const perfilesLines = calcularLineasPerfiles(
    perfilesArr,
    finalColsValues,
    xAxis,
    yAxis,
    anchoColumna,
    cerramiento,
    ancho,
    alto,
    altoPozo,
    scaleFactor
  );

  return (
    <>
      {perfiles > 0 && finalColsValues.length > 0 && (
        <>
          {perfilesArr.length > 0 &&
            perfilesLines.map((lineGroup: LineGroup[], groupIndex: number) =>
              lineGroup
                .filter((line) => {
                  // Verificar si el portón está definido
                  if (tienePorton && ubicacionPorton) {
                    const seccionPortonIndex = ubicacionPorton - 1; // Índice de la sección del portón
                    const seccionPorton = secciones[seccionPortonIndex];

                    // Si las coordenadas del perfil están dentro de la sección del portón, excluirlo
                    if (
                      seccionPorton &&
                      line.x1 >= seccionPorton.xInicio &&
                      line.x2 <= seccionPorton.xFin
                    ) {
                      return false; // Excluir este perfil
                    }
                  }
                  return true; // Incluir el perfil
                })
                .map((line, index) => (
                  <React.Fragment key={`perfil-${groupIndex}-${index}`}>
                    <Line
                      points={[line.x1, line.y1, line.x2, line.y2]}
                      stroke="black"
                      strokeWidth={1}
                    />
                    {groupIndex === 0 && (
                      <>
                        <Text
                          text={`${Math.ceil(line.longitud)}`}
                          x={(line.x1 + line.x2) / 2 - 20}
                          y={line.y1 - 10}
                          fontSize={12}
                          fill="black"
                          draggable
                        />
                        <Text
                          text={`${Math.ceil(altoPerfil)}`}
                          rotation={90}
                          x={(line.x1 + line.x2) / 2}
                          y={(altoPerfil + line.y1) / 2}
                          fontSize={12}
                          fill="black"
                          draggable
                        />
                      </>
                    )}
                  </React.Fragment>
                ))
            )}
        </>
      )}
    </>
  );
};
