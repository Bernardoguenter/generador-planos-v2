// Calcular la longitud de los lados del triángulo del techo
export const calculoLadoTriangulo = (halfBase: number, pico: number) =>
  Math.sqrt(Math.pow(halfBase, 2) + Math.pow(pico, 2));

// Función para calcular el cateto opuesto en un triángulo rectángulo
export function calcularCatetoOpuesto(hipotenusa: number, angulo: number) {
  const anguloRad = angulo * (Math.PI / 180);
  return hipotenusa * Math.sin(anguloRad);
}

//Función para calcular las secciones
export const calcularSecciones = (
  xAxis: number,
  yAxis: number,
  colValuesArr: number[],
  scaleFactor: number,
  ancho: number,
  anchoColumna: number,
  alto: number,
  alturaTotal: number,
  altoPozo: number,
  altoPorton: number | undefined
) => {
  // Agregar los bordes izquierdo y derecho al array de columnas
  const puntosX = [
    xAxis,
    ...colValuesArr.map((col) => xAxis + col * scaleFactor),
    xAxis + ancho * scaleFactor,
  ];

  // Calcular las secciones
  const secciones = [];
  for (let i = 0; i < puntosX.length - 1; i++) {
    let xInicio = puntosX[i];
    let xFin = puntosX[i + 1];

    // Ajustar la primera sección para que comience después del anchoColumna
    if (i === 0) {
      xInicio += anchoColumna * scaleFactor;
    }

    // Ajustar la última sección para que termine antes del anchoColumna
    if (i === puntosX.length - 2) {
      xFin -= anchoColumna * scaleFactor;
    }

    const yInicio = yAxis + (alturaTotal - altoPozo) * scaleFactor; // Base ajustada al altoPozo
    const yFin = yAxis + (alto - (altoPorton ?? 0)) * scaleFactor; // Altura del portón medida desde yInicio

    secciones.push({
      xInicio,
      xFin,
      yInicio,
      yFin,
    });
  }

  return secciones.filter((_, index) => index % 2 === 0);
};

export const calcularLineasPerfiles = (
  perfilesArr: number[],
  finalColsValues: number[],
  xAxis: number,
  yAxis: number,
  anchoColumna: number,
  cerramiento: number,
  ancho: number,
  alto: number,
  altoPozo: number,
  scaleFactor: number
) => {
  return perfilesArr.map((altura) => {
    return finalColsValues
      .map((columna, index) => {
        const x1 =
          index === 0
            ? xAxis + anchoColumna * scaleFactor
            : xAxis + finalColsValues[index - 1] * scaleFactor;
        const y1 = yAxis + (cerramiento - altura) * scaleFactor;
        const x2 = xAxis + columna * scaleFactor;
        const y2 = y1;

        const longitud =
          Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / scaleFactor;
        return { x1, y1, x2, y2, longitud };
      })
      .filter((_, index) => index % 2 === 0)
      .concat([
        {
          x1: xAxis + finalColsValues[finalColsValues.length - 1] * scaleFactor,
          y1: yAxis + (cerramiento - altura) * scaleFactor,
          x2: xAxis + (ancho - anchoColumna) * scaleFactor,
          y2: yAxis + (cerramiento - altura) * scaleFactor,
          longitud:
            Math.sqrt(
              Math.pow(
                xAxis +
                  (ancho - anchoColumna) * scaleFactor -
                  (xAxis +
                    finalColsValues[finalColsValues.length - 1] * scaleFactor),
                2
              ) +
                Math.pow(
                  yAxis +
                    (alto - altoPozo - altura) * scaleFactor -
                    (yAxis + (alto - altoPozo - altura) * scaleFactor),
                  2
                )
            ) / scaleFactor,
        },
      ]);
  });
};

export const calcularPuntoTecho = (
  columna: number,
  xAxis: number,
  yAxis: number,
  ancho: number,
  anchoColumna: number,
  scaleFactor: number,
  catetoAdyacente: number,
  verticeIzquierdoX: number,
  verticeIzquierdoY: number,
  verticeDerechoX: number,
  verticeDerechoY: number
) => {
  // Coordenadas de los puntos del techo interno (límites naranja)
  const xIzquierdoTecho = xAxis + anchoColumna * scaleFactor;
  const yIzquierdoTecho = yAxis + catetoAdyacente * scaleFactor;

  const xDerechoTecho =
    xAxis - anchoColumna * scaleFactor + ancho * scaleFactor;
  const yDerechoTecho = yAxis + catetoAdyacente * scaleFactor;

  // Coordenadas de los puntos de la línea basePico
  const xIzquierdoBasePico = verticeIzquierdoX;
  const yIzquierdoBasePico = verticeIzquierdoY;

  const xDerechoBasePico = verticeDerechoX;
  const yDerechoBasePico = verticeDerechoY;

  // Coordenada X de la columna
  const xColumna = xAxis + columna * scaleFactor;

  // Determinar el rango en el que está la columna
  let xInicio, yInicio, xFin, yFin;

  if (xColumna <= xIzquierdoBasePico) {
    // Lado izquierdo (basePico izquierda)
    xInicio = xIzquierdoBasePico;
    yInicio = yIzquierdoBasePico;
    xFin = xIzquierdoTecho;
    yFin = yIzquierdoTecho;
  } else if (xColumna >= xDerechoBasePico) {
    // Lado derecho (basePico derecha)
    xInicio = xDerechoBasePico;
    yInicio = yDerechoBasePico;
    xFin = xDerechoTecho;
    yFin = yDerechoTecho;
  } else if (xColumna > xIzquierdoTecho && xColumna < xDerechoTecho) {
    // Dentro del techo interno (entre los dos techos)
    xInicio = xIzquierdoTecho;
    yInicio = yIzquierdoTecho;
    xFin = xDerechoTecho;
    yFin = yDerechoTecho;
  } else {
    // Si la columna no entra en ningún rango válido, devolvemos null
    console.error("Columna fuera de rango válido:", xColumna);
    return null;
  }

  // Calcular pendiente (m) y desplazamiento (b)
  const m = (yFin - yInicio) / (xFin - xInicio);
  const b = yInicio - m * xInicio;

  // Calcular el punto en el techo interno
  const yTecho = m * xColumna + b;

  return { xColumna, yTecho };
};

export const calcularPuntosColumna = (
  columna: number,
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
  lineaPico: number
) => {
  const techo = calcularPuntoTecho(
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
    verticeDerechoY
  );

  // Coordenada X de la columna
  const xColumna = xAxis + columna * scaleFactor;

  let yBasePico, alturaColumna;

  // Caso 1: Columna dentro del rango basePico
  if (xColumna >= verticeIzquierdoX && xColumna <= verticeDerechoX) {
    // Calculamos la altura directamente en la basePico
    const mPico =
      (verticeDerechoY - verticeIzquierdoY) /
      (verticeDerechoX - verticeIzquierdoX);
    const bPico = verticeIzquierdoY - mPico * verticeIzquierdoX;

    yBasePico = mPico * xColumna + bPico;

    // Altura de la columna (diferencia entre el punto superior y la base)
    alturaColumna =
      (yAxis + alturaTotal * scaleFactor - yBasePico) / scaleFactor;

    return {
      puntos: [
        xColumna,
        yBasePico, // Punto superior (basePico)
        xColumna,
        yAxis + alturaTotal * scaleFactor, // Punto inferior (base)
      ],
      alturaColumna,
    };
  }

  // Caso 2: Columna fuera del rango basePico (usar cálculo de techo interno)
  if (techo) {
    const { xColumna, yTecho } = techo;

    // Altura de la columna (diferencia entre el punto superior y la base)
    alturaColumna = (yAxis + alturaTotal * scaleFactor - yTecho) / scaleFactor;

    return {
      puntos: [
        xColumna,
        yTecho, // Punto superior (techo interno)
        xColumna,
        yAxis + alturaTotal * scaleFactor, // Punto inferior (base)
      ],
      alturaColumna,
    };
  }

  // Caso 3: Columna sin techo válido (fallo en el cálculo)
  alturaColumna = (pico - lineaPico) / scaleFactor;

  return {
    puntos: [
      xAxis + columna * scaleFactor,
      yAxis - (pico - lineaPico) * scaleFactor, // Punto superior (borde superior)
      xAxis + columna * scaleFactor,
      yAxis + alturaTotal * scaleFactor, // Punto inferior (base)
    ],
    alturaColumna,
  };
};

// Calcular distancia entre fijaCorreas
export const calcularFijaCorreas = (
  ladoTecho: number,
  fijaCorreaInicial: number,
  fijaCorreaFinal: number,
  fijaCorreas: number,
  pendienteTecho: number,
  scaleFactor: number,
  verticeDerTechoX: number,
  verticeDerTechoY: number,
  altoFijaCorrea: number
) => {
  const fijaCorreasDist =
    (ladoTecho - fijaCorreaFinal - fijaCorreaInicial) / (fijaCorreas - 1);

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

  return { fijaCorreasDist, fijaCorreasArr, fijaCorreasLines };
};

// Calcular ángulos del techo
export const calcularAngulosTecho = (pendienteTecho: number) => {
  const anguloTecho = 90 + pendienteTecho;
  const anguloMedioTecho = anguloTecho / 2;
  const anguloBase = anguloTecho - anguloMedioTecho - pendienteTecho;
  const anguloBaseRad = anguloBase * (Math.PI / 180);

  return { anguloTecho, anguloMedioTecho, anguloBase, anguloBaseRad };
};

// Calcular desplazamientos
export const calcularDesplazamientos = (
  largoCaja: number,
  anguloBaseRad: number
) => {
  const desplazamiento_x = largoCaja * Math.cos(anguloBaseRad);
  const desplazamiento_y = largoCaja * Math.sin(anguloBaseRad);

  return { desplazamiento_x, desplazamiento_y };
};

// Calcular intersecciones y líneas perpendiculares
export const calcularIntersecciones = (
  desplazamiento_x: number,
  desplazamiento_y: number,
  verticeIzqTechoX: number,
  verticeIzqTechoY: number,
  verticeDerTechoX: number,
  verticeDerTechoY: number,
  anchoColumna: number,
  scaleFactor: number
) => {
  const pendienteIzq = desplazamiento_y / desplazamiento_x;
  const pendienteDer = -desplazamiento_y / desplazamiento_x;

  const pendientePerpendicularIzq = -1 / pendienteIzq;
  const pendientePerpendicularDer = -1 / pendienteDer;

  const limiteInternoIzqX = verticeIzqTechoX + anchoColumna * scaleFactor;
  const limiteInternoDerX = verticeDerTechoX - anchoColumna * scaleFactor;

  const interseccionIzqY =
    verticeIzqTechoY +
    (limiteInternoIzqX - verticeIzqTechoX) * pendientePerpendicularIzq;
  const interseccionDerY =
    verticeDerTechoY +
    (limiteInternoDerX - verticeDerTechoX) * pendientePerpendicularDer;

  return {
    pendienteIzq,
    pendienteDer,
    pendientePerpendicularIzq,
    pendientePerpendicularDer,
    limiteInternoIzqX,
    limiteInternoDerX,
    interseccionIzqY,
    interseccionDerY,
  };
};
