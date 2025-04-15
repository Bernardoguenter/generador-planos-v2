import { Line, Text } from "react-konva";
import { calcularPuntosColumna } from "../../utils/calculos";
import { Secciones } from "../../utils/types";
import { useValuesContext } from "../../context/valuesContext";
import { xAxis, yAxis } from "../../utils/constants";
import { useDrawContext } from "../../context/drawContext";

interface Props {
  secciones: Secciones[];
  finalColsValues: number[];
  catetoAdyacente: number;
  verticeIzquierdoX: number;
  verticeIzquierdoY: number;
  verticeDerechoX: number;
  verticeDerechoY: number;
}

export const PerfilSobrePorton = ({
  secciones,
  finalColsValues,
  catetoAdyacente,
  verticeIzquierdoX,
  verticeIzquierdoY,
  verticeDerechoX,
  verticeDerechoY,
}: Props) => {
  const { values, alturaTotal } = useValuesContext();
  const {
    ubicacionPorton,
    ancho,
    anchoColumna,
    pico,
    lineaPico,
    cantidadPerfilesSobrePorton,
  } = values;
  const { scaleFactor } = useDrawContext();

  // Calcular el índice de la sección del portón
  const seccionPortonIndex = (ubicacionPorton ?? 1) - 1;
  const seccionPorton = secciones[seccionPortonIndex];

  if (!seccionPorton) return null;

  // Calcular el punto donde termina la columna en la línea del pico
  const columnaPorton = finalColsValues[seccionPortonIndex];
  const { puntos } = calcularPuntosColumna(
    columnaPorton,
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

  const limiteSuperiorY = puntos[1]; // Coordenada Y del punto superior de la columna

  // Calcular la distancia vertical entre el techo del portón y el límite superior
  const alturaDisponible = limiteSuperiorY - seccionPorton.yFin;

  // Calcular el alto de cada perfil
  const altoPerfil =
    alturaDisponible / ((cantidadPerfilesSobrePorton ?? 0) + 1);

  // Crear array de perfiles
  const perfilesSobrePorton = Array.from(
    { length: cantidadPerfilesSobrePorton ?? 0 },
    (_, i) => seccionPorton.yFin + altoPerfil * (i + 1)
  );

  // Dibujar los perfiles sobre el portón
  return perfilesSobrePorton.map((yPerfil, i) => (
    <>
      <Line
        key={`perfil-sobre-porton-${i}`}
        points={[
          seccionPorton.xInicio,
          yPerfil, // Punto izquierdo del perfil
          seccionPorton.xFin,
          yPerfil, // Punto derecho del perfil
        ]}
        stroke="black"
        strokeWidth={1}
      />
      <Text
        rotation={90}
        text={`${Math.ceil(Math.abs(altoPerfil))}`}
        x={(seccionPorton.xInicio + seccionPorton.xFin) / 2}
        y={seccionPorton.yFin + altoPerfil * scaleFactor}
        fontSize={12}
        fill="black"
        align="center"
        draggable
      />
    </>
  ));
};
