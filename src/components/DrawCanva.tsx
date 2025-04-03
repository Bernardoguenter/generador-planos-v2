import { Stage, Layer, Line, Text } from "react-konva";
import {
  calcularCatetoOpuesto,
  calcularLineasPerfiles,
  calcularPuntosColumna,
  calcularSecciones,
  calculoLadoTriangulo,
} from "../utils/calculos.ts";
import React, { useState } from "react";
import { useValuesContext } from "../context/valuesContext/index.tsx";
import { useDrawContext } from "../context/drawContext/index.tsx";
import {
  altoFijaCorrea,
  fijaCorreaFinal,
  fijaCorreaInicial,
  separacionPrimerPerfil,
  separaciónColumnasInternas,
  xAxis,
  yAxis,
} from "../utils/constants.ts";
import { Secciones } from "../utils/types.ts";

export const DrawCanva = () => {
  const { values, alturaTotal, note } = useValuesContext();
  const {
    alto,
    altoPozo,
    ancho,
    anchoColumna,
    cerramiento,
    fijaCorreas,
    largo,
    largoCaja,
    lineaPico,
    perfiles,
    pico,
    separacionLineas,
    columnValues,
    esFrente,
    tienePorton,
    altoPorton,
    ubicacionPorton,
    cantidadPerfilesSobrePorton,
    tienePerfilesSobrePorton,
  } = values;

  const { draw, stageRef } = useDrawContext();
  const [scaleFactor, setScaleFactor] = useState(0.4);

  // Calcular la longitud de los lados del triángulo del techo
  const halfBase = ancho / 2;
  const ladoTecho = calculoLadoTriangulo(halfBase, pico);

  // Vértice izquierdo del techo
  const verticeIzqTechoX = xAxis;
  const verticeIzqTechoY = yAxis;

  // Vértice derecho del techo
  const verticeDerTechoX = xAxis + ancho * scaleFactor;
  const verticeDerTechoY = yAxis;

  // Calcular los grados de pendiente del techo interno y externo
  const pendienteTecho = Math.atan2(pico, halfBase) * (180 / Math.PI);

  // Calcular distancia entre las fijaCorreas
  const fijaCorreasDist =
    (ladoTecho - fijaCorreaFinal - fijaCorreaInicial) / (fijaCorreas - 1);

  // Crear array de fijaCorreas
  const fijaCorreasArr = Array.from({ length: fijaCorreas }, (_, i) =>
    i === 0 ? fijaCorreaInicial : fijaCorreaInicial + i * fijaCorreasDist
  );

  // Calcular las coordenadas de las líneas de fijaCorreas
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

  //Calcular el ángulo formado por la pendiente del techo techo y el largo de la caja
  const anguloTecho = 90 + pendienteTecho;

  // Calcular el ángulo medio del ángulo del techo
  const anguloMedioTecho = anguloTecho / 2;

  // Calcular el ángulo entre la base del techo y el ángulo medio
  const anguloBase = anguloTecho - anguloMedioTecho - pendienteTecho;
  const anguloBaseRad = anguloBase * (Math.PI / 180);

  // Calcular los desplazamientos en x y y usando largoCaja
  const desplazamiento_x = largoCaja * Math.cos(anguloBaseRad);
  const desplazamiento_y = largoCaja * Math.sin(anguloBaseRad);

  // Calcular la distancia horizontal (cateto adyacente)
  const catetoAdyacente = anchoColumna * Math.tan(anguloBaseRad);
  //Calcular hipotenusa del tríangulo
  const hipotenusa = Math.sqrt(
    Math.pow(catetoAdyacente, 2) + Math.pow(anchoColumna, 2)
  );

  //Calcular diferencia entre largoCaja y catetoAdyacente
  const diferencia = largoCaja - hipotenusa;

  // Punto final anchoCajaIzq izquierda
  const finAnchoCajaIzqX = verticeIzqTechoX + desplazamiento_x * scaleFactor;
  const finAnchoCajaIzqY = verticeIzqTechoY + desplazamiento_y * scaleFactor;

  // Punto final de la línea roja derecha
  const finAnchoCajaDerX = verticeDerTechoX - desplazamiento_x * scaleFactor;
  const finAnchoCajaDerY = verticeDerTechoY + desplazamiento_y * scaleFactor;

  // Calcular pendiente de la línea roja izquierda y derecha
  const pendienteIzq = desplazamiento_y / desplazamiento_x;
  const pendienteDer = -desplazamiento_y / desplazamiento_x; // Para la línea derecha es el mismo valor pero opuesto

  // Calcular pendiente perpendicular
  const pendientePerpendicularIzq = -1 / pendienteIzq;
  const pendientePerpendicularDer = -1 / pendienteDer;

  // Limites de la estructura interna en X
  const limiteInternoIzqX = xAxis + anchoColumna * scaleFactor;
  const limiteInternoDerX = xAxis + (ancho - anchoColumna) * scaleFactor;

  // Calcular la intersección para la nueva línea
  // Intersección en el límite interno izquierdo
  const interseccionIzqY =
    finAnchoCajaIzqY +
    (limiteInternoIzqX - finAnchoCajaIzqX) * pendientePerpendicularIzq;
  const interseccionDerY =
    finAnchoCajaDerY +
    (limiteInternoDerX - finAnchoCajaDerX) * pendientePerpendicularDer;

  // Calcular la longitud de la nueva línea perpendicular
  const longitudNuevaLínea = Math.sqrt(
    Math.pow(limiteInternoIzqX - finAnchoCajaIzqX, 2) +
      Math.pow(interseccionIzqY - finAnchoCajaIzqY, 2)
  );

  // Calcular el ángulo entre el punto final de la largo caja y el techo interno
  const deltaX = limiteInternoIzqX - finAnchoCajaIzqX;
  const deltaY = interseccionIzqY - finAnchoCajaIzqY;
  const lineaLargoCajaHaciaTecho = Math.atan2(deltaY, deltaX);

  // Calcular desplazamientos en X e Y para la nueva línea rosa, manteniendo la misma longitud que la línea púrpura
  const desplazamientoXRosa =
    longitudNuevaLínea * Math.cos(lineaLargoCajaHaciaTecho);
  const desplazamientoYRosa =
    longitudNuevaLínea * Math.sin(lineaLargoCajaHaciaTecho);

  // **Invertimos los desplazamientos para que la línea izquierda vaya hacia arriba y el interior**
  const puntoFinPerpendicularIzqX = finAnchoCajaIzqX - desplazamientoXRosa;
  const puntoFinPerpendicularIzqY = finAnchoCajaIzqY - desplazamientoYRosa;

  // **Invertimos los desplazamientos para que la línea derecha vaya hacia arriba y el interior**
  const puntoFinPerpendicularDerX = finAnchoCajaDerX + desplazamientoXRosa;
  const puntoFinPerpendicularDerY = finAnchoCajaDerY - desplazamientoYRosa;

  //Calcular el largo de la línea que uno el techo interno con el la lado interno.
  const largoTotalLineaPerpendicular = longitudNuevaLínea * 2;

  // Calcular el alto interno entre los puntos de la esquina superior e inferior izquierda
  const altoInterno = Math.abs(alturaTotal - catetoAdyacente);

  // Calcular la longitud entre el Punto izquierdo interno y el Pico interno central
  const ladoTechoInterno = Math.sqrt(
    Math.pow(xAxis + ancho / 2 - (xAxis + anchoColumna), 2) +
      Math.pow(yAxis - (pico - anchoColumna) - (yAxis + catetoAdyacente), 2)
  );

  //Calcular la diferencia de largo entre los dos techos
  const diferenciaLargoCaja = largoCaja - diferencia;
  const angulo = 90 - anguloMedioTecho; // Ángulo en grados
  const diferenciaEntreTechos = calcularCatetoOpuesto(
    diferenciaLargoCaja,
    angulo
  );

  /** ESTO ES PARA CALCULAR EL PUNTO MEDIO DEL TECHO **/
  //Calcular punto medio del vértice del techo al pico
  // Pico del techo
  const xPico = xAxis + (ancho * scaleFactor) / 2;
  const yPico = yAxis - pico * scaleFactor;

  // Punto medio entre el lado izquierdo y el pico
  const puntoMedioIzqX = (verticeIzqTechoX + xPico) / 2;
  const puntoMedioIzqY = (verticeIzqTechoY + yPico) / 2;

  /* Ahora no lo necesito pero lo dejamos calculado */
  /*   // Punto medio entre el lado derecho y el pico
  const puntoMedioDerX = (verticeDerTechoX + xPico) / 2;
  const puntoMedioDerY = (verticeDerTechoY + yPico) / 2; */

  /** ESTO ES PARA CALCULAR EL PUNTO MEDIO DEL TECHO o LÍNEA DE PICO **/

  // Puntos para dibujar el triángulo del pico entero
  const baseTrianguloX = xAxis + (ancho * scaleFactor) / 2; // Centro en X (pico)
  const baseTrianguloY = yAxis - (pico - anchoColumna) * scaleFactor; // Base del triángulo en la línea del techo
  const alturaTriangulo = (lineaPico - anchoColumna) * scaleFactor; // Cateto opuesto
  const anguloTriangulo = pendienteTecho * (Math.PI / 180); // Ángulo en radianes

  // Calcular el cateto adyacente a partir del cateto opuesto y el ángulo
  const baseAdyacente = alturaTriangulo / Math.tan(anguloTriangulo);

  // Coordenadas del vértice derecho
  const verticeDerechoX = baseTrianguloX + baseAdyacente;
  const verticeDerechoY = baseTrianguloY + alturaTriangulo;

  // Coordenadas del vértice izquierdo
  const verticeIzquierdoX = baseTrianguloX - baseAdyacente;
  const verticeIzquierdoY = verticeDerechoY;

  // Puntos para dibujar el triángulo del pico con separación
  const baseTrianguloX1 = xAxis + (ancho * scaleFactor) / 2; // Centro en X (pico)
  const baseTrianguloY1 = yAxis - (pico - anchoColumna) * scaleFactor; // Base del triángulo en la línea del techo
  const alturaTriangulo1 =
    (lineaPico - anchoColumna - separacionLineas) * scaleFactor; // Cateto opuesto
  const anguloTriangulo1 = pendienteTecho * (Math.PI / 180); // Ángulo en radianes

  // Calcular el cateto adyacente a partir del cateto opuesto y el ángulo
  const baseAdyacente1 = alturaTriangulo1 / Math.tan(anguloTriangulo1);

  // Coordenadas del vértice derecho
  const verticeDerechoX1 = baseTrianguloX1 + baseAdyacente1;
  const verticeDerechoY1 = baseTrianguloY1 + alturaTriangulo1;

  // Coordenadas del vértice izquierdo
  const verticeIzquierdoX1 = baseTrianguloX1 - baseAdyacente1;
  const verticeIzquierdoY1 = verticeDerechoY1;

  /* CÁLCULO DE COLUMNAS */
  //Agregar separación entre columnas
  const newColumnValues =
    columnValues &&
    columnValues.map((columna: number) => {
      const newCols = columna + separaciónColumnasInternas;
      return newCols;
    });

  //Obtener todos los valores de las líneas de columnas

  const finalColsValues = (columnValues || [])
    .concat(newColumnValues || [])
    .sort((a, b) => a - b);

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

  //Calcular secciones para ubicar portón
  const secciones = calcularSecciones(
    xAxis,
    yAxis,
    finalColsValues,
    scaleFactor,
    ancho,
    anchoColumna,
    alto,
    alturaTotal,
    altoPozo,
    altoPorton
  );

  const renderPerfilesSobrePorton = (
    secciones: Secciones[],
    finalColsValues: number[],
    ubicacionPorton: number,
    xAxis: number,
    yAxis: number,
    ancho: number,
    anchoColumna: number,
    scaleFactor: number,
    catetoAdyacente: number,
    verticeIzquierdoX: number,
    verticeIzquierdoY: number,
    verticeDerechoX: number,
    verticeDerechoY: number,
    alturaTotal: number,
    pico: number,
    lineaPico: number,
    cantidadPerfilesSobrePorton: number | undefined
  ) => {
    // Calcular el índice de la sección del portón
    const seccionPortonIndex = ubicacionPorton - 1;
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
    ));
  };

  const renderSeccionPorton = (
    secciones: Secciones[],
    ubicacionPorton: number,
    altoPorton: number = 0,
    scaleFactor: number
  ) => {
    // Calcular el índice de la sección del portón
    const seccionPortonIndex = ubicacionPorton - 1;
    const seccionPorton = secciones[seccionPortonIndex];

    if (!seccionPorton) return null;

    return (
      <>
        {/* Dibujar la sección del portón */}
        <Line
          points={[
            seccionPorton.xInicio,
            seccionPorton.yInicio, // Punto inferior izquierdo
            seccionPorton.xInicio,
            seccionPorton.yFin, // Punto superior izquierdo
            seccionPorton.xFin,
            seccionPorton.yFin, // Punto superior derecho
            seccionPorton.xFin,
            seccionPorton.yInicio, // Punto inferior derecho
            seccionPorton.xInicio,
            seccionPorton.yInicio, // Cerrar el rectángulo
          ]}
          stroke="black"
          strokeWidth={2}
          closed={true}
        />
        {/* Texto con el ancho de la sección */}
        <Text
          text={`Portón de\n${altoPorton}cm\nx ${Math.ceil(
            (seccionPorton.xFin - seccionPorton.xInicio) / scaleFactor
          )}cm`}
          x={(seccionPorton.xInicio + seccionPorton.xFin) / 2 - 40} // Centrar horizontalmente
          y={(seccionPorton.yInicio + seccionPorton.yFin) / 2 - 30} // Centrar verticalmente
          fontSize={20}
          fill="black"
          align="center"
        />
      </>
    );
  };

  return (
    <section className="w-full h-screen md:w-3/4 flex flex-col items-center justify-start bg-white min-h-screen">
      <input
        type="range"
        max={1}
        step={0.01}
        value={scaleFactor}
        onChange={(e) => setScaleFactor(e.target.valueAsNumber)}
      />
      {draw && (
        <Stage
          width={1000}
          height={560}
          backgroundColor="white"
          style={{ border: "1px solid black" }}
          ref={stageRef}>
          <Layer>
            {tienePorton &&
              tienePerfilesSobrePorton &&
              ubicacionPorton &&
              renderPerfilesSobrePorton(
                secciones,
                finalColsValues,
                ubicacionPorton,
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
                lineaPico,
                cantidadPerfilesSobrePorton
              )}

            {/* Dibujar solo la sección del portón */}
            {tienePorton &&
              ubicacionPorton &&
              renderSeccionPorton(
                secciones,
                ubicacionPorton,
                altoPorton,
                scaleFactor
              )}
            {/* Perfiles */}
            {perfilesLines.map((lineGroup, groupIndex) =>
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
                      <Text
                        text={`${Math.ceil(line.longitud)}cm`}
                        x={(line.x1 + line.x2) / 2 - 20}
                        y={line.y1 - 10}
                        fontSize={12}
                        fill="black"
                      />
                    )}
                  </React.Fragment>
                ))
            )}
            {/* FijaCorreas */}
            {fijaCorreasLines.map((line, index) => (
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
              text={`${Math.ceil(fijaCorreasDist)}cm`}
              x={verticeDerTechoX - fijaCorreasDist / 2}
              y={verticeDerTechoY - anchoColumna * 2 * scaleFactor}
              rotation={pendienteTecho}
              fill={"black"}
            />
            {/* Columnas */}
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
                      text={`${Math.ceil(alturaColumna)}cm`}
                      rotation={90}
                      x={xAxis + columna * scaleFactor}
                      y={yAxis + (altoInterno / 2) * scaleFactor}
                      fontSize={12}
                      fill="black"
                    />
                  ) : (
                    <Text
                      key={`col-text-odd-${index}`}
                      text={`${Math.ceil(alturaColumna)}cm`}
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

            {/* Base Línea Pico Inferior */}
            <Line
              points={[
                verticeIzquierdoX,
                verticeIzquierdoY, // Vértice izquierdo
                verticeDerechoX,
                verticeDerechoY, // Vértice derecho
              ]}
              stroke="black"
              strokeWidth={1}
              closed={true}
            />
            <Text
              text={`${Math.ceil((2 * baseAdyacente1) / scaleFactor)}cm`}
              x={baseTrianguloX - 35}
              y={baseTrianguloY + separacionLineas * scaleFactor + 10}
              fontSize={12}
              fill="black"
            />
            {/* Base Línea Pico Superior*/}
            <Line
              points={[
                verticeIzquierdoX1,
                verticeIzquierdoY1, // Vértice izquierdo
                verticeDerechoX1,
                verticeDerechoY1, // Vértice derecho
              ]}
              stroke="black"
              strokeWidth={1}
            />
            <Text
              text={`${Math.ceil((2 * baseAdyacente) / scaleFactor)}cm`}
              x={baseTrianguloX - 35}
              y={baseTrianguloY + separacionLineas * scaleFactor + 35}
              fontSize={12}
              fill="black"
            />
            {/* Línea Pico */}
            <Line
              points={[
                xAxis + (ancho * scaleFactor) / 2,
                yAxis - pico * scaleFactor, // Pico interno central
                xAxis + (ancho * scaleFactor) / 2,
                yAxis - (pico - lineaPico) * scaleFactor, // Pico interno central
              ]}
              stroke="black"
              strokeWidth={1}
            />
            <Text
              text={`${Math.ceil(lineaPico)}cm`}
              x={xAxis + (ancho * scaleFactor) / 2}
              y={yAxis - pico * scaleFactor + anchoColumna * scaleFactor}
              fontSize={12}
            />
            {/* Alto Pozo */}
            <Line
              points={[
                xAxis,
                yAxis + (alturaTotal - altoPozo) * scaleFactor, // Esquina inferior izquierda
                xAxis + ancho * scaleFactor,
                yAxis + (alturaTotal - altoPozo) * scaleFactor, // Esquina inferior derecha
              ]}
              strokeWidth={1}
              stroke={"black"}
            />
            <Text
              text={`${Math.ceil(altoPozo)}cm`}
              rotation={90}
              x={xAxis}
              y={yAxis + (alturaTotal - altoPozo) * scaleFactor}
            />
            {/* Líneas perpendiculares Largo Caja (Entre estructura interana y techo interno) */}
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
            {/* Líneas Largo Caja */}
            <Line
              points={[
                verticeIzqTechoX,
                verticeIzqTechoY, // Vértice izquierdo del techo
                verticeIzqTechoX + desplazamiento_x * scaleFactor,
                verticeIzqTechoY + desplazamiento_y * scaleFactor, // Punto final para la línea izquierda
              ]}
              strokeWidth={1}
              stroke={"black"}
            />
            <Line
              points={[
                verticeDerTechoX,
                verticeDerTechoY, // Vértice derecho del techo
                verticeDerTechoX - desplazamiento_x * scaleFactor,
                verticeDerTechoY + desplazamiento_y * scaleFactor, // Punto final para la línea derecha
              ]}
              strokeWidth={1}
              stroke={"black"}
            />
            {/* Techo externo */}
            <Line
              points={[
                xAxis,
                yAxis, // Punto izquierdo del techo
                xAxis + (ancho * scaleFactor) / 2,
                yAxis - pico * scaleFactor, // Pico central
                xAxis + ancho * scaleFactor,
                yAxis, // Punto derecho del techo
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
            {/* Estructura Externa*/}
            <Line
              points={[
                xAxis,
                yAxis, // Esquina superior izquierda
                xAxis,
                yAxis + alturaTotal * scaleFactor, // Esquina inferior izquierda
                xAxis + ancho * scaleFactor,
                yAxis + alturaTotal * scaleFactor, // Esquina inferior derecha
                xAxis + ancho * scaleFactor,
                yAxis, // Esquina superior derecha
              ]}
              strokeWidth={1}
              stroke={"black"}
            />
            {/* Cerramiento */}
            <Line
              points={[
                xAxis + (ancho + 40) * scaleFactor,
                yAxis,
                xAxis + (ancho + 40) * scaleFactor,
                yAxis + cerramiento * scaleFactor,
              ]}
              strokeWidth={1}
              stroke={"black"}
            />
            <Text
              text={`Cerramiento: ${Math.ceil(cerramiento)}cm`}
              rotation={90}
              x={xAxis + (ancho + 70) * scaleFactor}
              y={yAxis + (alto - cerramiento) * scaleFactor}
            />
            {/* Estructura interna */}
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
            {/* Textos */}
            {note && (
              <Text
                text={note}
                x={innerWidth / 5}
                y={25 + scaleFactor}
                fontSize={12}
              />
            )}
            <Text
              text={`Galpón de ${ancho / 100}mts de ancho x ${
                largo / 100
              }mts de largo x ${alto / 100}mts de alto  - ${
                esFrente ? "Frente" : "Fondo"
              }`}
              x={0 + innerWidth / 5}
              y={5 + scaleFactor}
              fontSize={16}
              fontStyle="bold"
            />
            <Text
              text={`${Math.ceil(altoInterno)}cm`}
              rotation={90}
              x={xAxis + anchoColumna * scaleFactor}
              y={yAxis + (altoInterno / 2) * scaleFactor}
            />
            <Text
              text={`Diferencia entre largo de techos:${Math.floor(
                diferenciaEntreTechos
              )}cm`}
              x={xAxis}
              y={yAxis + alturaTotal * scaleFactor + 20}
            />
            <Text
              text={`${Math.ceil(alturaTotal)}cm`}
              rotation={90}
              x={xAxis - (anchoColumna / 10) * scaleFactor}
              y={yAxis + (altoInterno / 2) * scaleFactor}
            />
            <Text
              text={`${Math.ceil(anchoColumna)}` + "\n" + "cm"}
              x={xAxis + (ancho - anchoColumna + 5) * scaleFactor}
              y={yAxis + (alturaTotal - 10) * scaleFactor - 30}
            />
            <Text
              text={`${Math.ceil(pico)}cm`}
              x={xAxis + (ancho * scaleFactor) / 2 - 40}
              y={yAxis - pico * scaleFactor - 10}
            />
            <Text
              text={`${Math.ceil(ladoTecho)}cm`}
              x={puntoMedioIzqX}
              y={puntoMedioIzqY - anchoColumna * scaleFactor}
              rotation={-pendienteTecho}
            />
            <Text
              text={`${Math.ceil(ladoTechoInterno)}cm`}
              x={puntoMedioIzqX}
              y={puntoMedioIzqY + anchoColumna * scaleFactor - 15}
              rotation={-pendienteTecho}
            />
            <Text
              text={`${Math.ceil(largoCaja)}cm`}
              x={xAxis - 10 - anchoColumna * scaleFactor}
              y={yAxis - 10 - anchoColumna * scaleFactor}
              rotation={anguloBase}
              fill={"black"}
            />
            <Text
              text={`${Math.ceil(largoTotalLineaPerpendicular)}cm`}
              rotation={-anguloMedioTecho}
              x={puntoFinPerpendicularIzqX - 10}
              y={puntoFinPerpendicularIzqY + 30}
              fill={"black"}
            />
          </Layer>
        </Stage>
      )}
    </section>
  );
};
