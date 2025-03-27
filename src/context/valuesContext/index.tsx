import { createContext, useContext } from "react";
import { ValuesInterface } from "../../schema/valuesSchema";

interface valuesContextInterface {
  values: ValuesInterface;
  setValues: React.Dispatch<React.SetStateAction<ValuesInterface>>;
  alturaTotal: number;
  note: string | undefined;
  setNote: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const ValuesContext = createContext<valuesContextInterface | null>(null);

export function useValuesContext() {
  const context = useContext(ValuesContext);
  if (!context) {
    throw new Error("useValuesContext must be used within an AuthProvider");
  }
  return context;
}
