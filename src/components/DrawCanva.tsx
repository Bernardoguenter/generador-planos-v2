import { Stage, Layer } from "react-konva";
import {
  calcularCatetoOpuesto,
  calcularSecciones,
  calculoLadoTriangulo,
} from "../utils/calculos.ts";
import { useValuesContext } from "../context/valuesContext/index.tsx";
import { useDrawContext } from "../context/drawContext/index.tsx";
import {
  separaciónColumnasInternas,
  xAxis,
  yAxis,
} from "../utils/constants.ts";
import {
  AltoPozo,
  BaseLineaPico,
  Cerramiento,
  Columnas,
  DiferenciasText,
  EstructuraExterna,
  EstructuraInterna,
  FijaCorreas,
  LineaPico,
  LineasLargoCaja,
  LineasLargoCajaPerpendiculares,
  Note,
  PerfilSobrePorton,
  PerfilSobreTecho,
  Perfiles,
  Porton,
  Titulo,
} from "./componentesPlanos";

export const DrawCanva = () => {
  const { values, alturaTotal } = useValuesContext();
  const {
    alto,
    altoPozo,
    ancho,
    anchoColumna,
    largoCaja,
    lineaPico,
    pico,
    separacionLineas,
    columnValues,
    tienePorton,
    altoPorton,
    ubicacionPorton,
    tienePerfilesSobrePorton,
    tienePerfilesSobreTecho,
  } = values;

  const { draw, stageRef, scaleFactor, setScaleFactor } = useDrawContext();

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
            <Note />
            <Titulo />
            {tienePerfilesSobreTecho && (
              <PerfilSobreTecho pendienteTecho={pendienteTecho} />
            )}
            {tienePorton && tienePerfilesSobrePorton && ubicacionPorton && (
              <PerfilSobrePorton
                catetoAdyacente={catetoAdyacente}
                finalColsValues={finalColsValues}
                secciones={secciones}
                verticeDerechoX={verticeDerechoX}
                verticeDerechoY={verticeDerechoY}
                verticeIzquierdoX={verticeIzquierdoX}
                verticeIzquierdoY={verticeIzquierdoY}
              />
            )}
            {/* Porton */}
            {tienePorton && ubicacionPorton && (
              <Porton
                secciones={secciones}
                ubicacionPorton={ubicacionPorton}
                altoPorton={altoPorton}
              />
            )}
            {/* Perfiles */}
            <Perfiles
              secciones={secciones}
              finalColsValues={finalColsValues}
            />
            {/* FijaCorreas */}
            <FijaCorreas
              ladoTecho={ladoTecho}
              verticeDerTechoX={verticeDerTechoX}
              verticeDerTechoY={verticeDerTechoY}
              pendienteTecho={pendienteTecho}
            />
            {/* Columnas */}
            {alto > 0 && ancho > 0 && (
              <Columnas
                finalColsValues={finalColsValues}
                catetoAdyacente={catetoAdyacente}
                verticeIzquierdoX={verticeIzquierdoX}
                verticeIzquierdoY={verticeIzquierdoY}
                verticeDerechoX={verticeDerechoX}
                verticeDerechoY={verticeDerechoY}
                altoInterno={altoInterno}
              />
            )}

            {/* Base Línea Pico */}

            {baseAdyacente !== -Infinity &&
              verticeDerTechoX !== -Infinity &&
              verticeIzquierdoX !== -Infinity &&
              pico > 0 &&
              lineaPico > 0 && (
                <>
                  <BaseLineaPico
                    verticeIzquierdoX={verticeIzquierdoX}
                    verticeIzquierdoY={verticeIzquierdoY}
                    verticeDerechoX={verticeDerechoX}
                    verticeDerechoY={verticeDerechoY}
                    baseAdyacente1={baseAdyacente1}
                    baseTrianguloX={baseTrianguloX}
                    verticeIzquierdoX1={verticeIzquierdoX1}
                    verticeIzquierdoY1={verticeIzquierdoY1}
                    verticeDerechoX1={verticeDerechoX1}
                    verticeDerechoY1={verticeDerechoY1}
                    baseAdyacente={baseAdyacente}
                    baseTrianguloY={baseTrianguloY}
                    separacionLineas={separacionLineas}
                  />
                  <BaseLineaPico
                    verticeIzquierdoX={verticeIzquierdoX}
                    verticeIzquierdoY={verticeIzquierdoY}
                    verticeDerechoX={verticeDerechoX}
                    verticeDerechoY={verticeDerechoY}
                    baseAdyacente1={baseAdyacente1}
                    baseTrianguloX={baseTrianguloX}
                    verticeIzquierdoX1={verticeIzquierdoX1}
                    verticeIzquierdoY1={verticeIzquierdoY1}
                    verticeDerechoX1={verticeDerechoX1}
                    verticeDerechoY1={verticeDerechoY1}
                    baseAdyacente={baseAdyacente}
                    baseTrianguloY={baseTrianguloY}
                    separacionLineas={separacionLineas}
                  />
                </>
              )}

            {/* Línea Pico */}
            <LineaPico />
            {/* Alto Pozo */}
            <AltoPozo />
            {/* Líneas perpendiculares Largo Caja (Entre estructura interana y techo interno) */}
            {ancho > 0 && alto > 0 && (
              <LineasLargoCajaPerpendiculares
                limiteInternoIzqX={limiteInternoIzqX}
                interseccionIzqY={interseccionIzqY}
                puntoFinPerpendicularIzqX={puntoFinPerpendicularIzqX}
                puntoFinPerpendicularIzqY={puntoFinPerpendicularIzqY}
                limiteInternoDerX={limiteInternoDerX}
                interseccionDerY={interseccionDerY}
                puntoFinPerpendicularDerX={puntoFinPerpendicularDerX}
                puntoFinPerpendicularDerY={puntoFinPerpendicularDerY}
                largoTotalLineaPerpendicular={largoTotalLineaPerpendicular}
                anguloMedioTecho={anguloMedioTecho}
              />
            )}

            {/* Líneas Largo Caja */}
            {ancho > 0 && alto > 0 && (
              <LineasLargoCaja
                verticeIzqTechoX={verticeIzqTechoX}
                verticeIzqTechoY={verticeIzqTechoY}
                desplazamiento_x={desplazamiento_x}
                desplazamiento_y={desplazamiento_y}
                verticeDerTechoX={verticeDerTechoX}
                verticeDerTechoY={verticeDerTechoY}
                anguloBase={anguloBase}
              />
            )}
            {/* Cerramiento */}
            <Cerramiento />
            {/* Estructura Externa*/}
            <EstructuraExterna
              altoInterno={altoInterno}
              pendienteTecho={pendienteTecho}
              puntoMedioIzqX={puntoMedioIzqX}
              puntoMedioIzqY={puntoMedioIzqY}
            />
            {/* Estructura interna */}
            <EstructuraInterna
              catetoAdyacente={catetoAdyacente}
              altoInterno={altoInterno}
              pendienteTecho={pendienteTecho}
              puntoMedioIzqX={puntoMedioIzqX}
              puntoMedioIzqY={puntoMedioIzqY}
            />
            {largoCaja > 0 && alto > 0 && ancho > 0 && (
              <DiferenciasText diferenciaEntreTechos={diferenciaEntreTechos} />
            )}
          </Layer>
        </Stage>
      )}
    </section>
  );
};
