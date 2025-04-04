import { ReactNode, useEffect, useState } from "react";
import { ValuesInterface } from "../../schema/valuesSchema";
import { ValuesContext } from ".";

const initialValues = {
  alto: 0,
  ancho: 0,
  largo: 0,
  pico: 0,
  anchoColumna: 30,
  largoCaja: 60,
  lineaPico: 0,
  altoPozo: 0,
  cantidadColumnas: 0,
  columnValues: [],
  separacionLineas: 22,
  fijaCorreas: 0,
  perfiles: 0,
  cerramiento: 0,
  esFrente: false,
  tienePorton: false,
  altoPorton: 0,
  tienePerfilesSobrePorton: false,
  cantidadPerfilesSobrePorton: 0,
  tienePerfilesSobreTecho: false,
  cantidadPerfilesSobreTecho: 0,
};

export function ValuesProvider({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<ValuesInterface>(initialValues);
  const [alturaTotal, setAlturaTotal] = useState<number>(0);
  const [note, setNote] = useState<string | undefined>("");

  useEffect(() => {
    setAlturaTotal(values.alto + values.altoPozo);
  }, [values.alto, values.altoPozo]);

  return (
    <ValuesContext.Provider
      value={{ values, setValues, alturaTotal, note, setNote }}>
      {children}
    </ValuesContext.Provider>
  );
}
