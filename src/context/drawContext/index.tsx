import { createContext, RefObject, useContext } from "react";
import Konva from "konva";

interface drawContextInterface {
  draw: boolean;
  stageRef: RefObject<Konva.Stage | null>;
  setDraw: React.Dispatch<React.SetStateAction<boolean>>;
  scaleFactor: number;
  setScaleFactor: React.Dispatch<React.SetStateAction<number>>;
}

export const DrawContext = createContext<drawContextInterface | null>(null);

export function useDrawContext() {
  const context = useContext(DrawContext);
  if (!context) {
    throw new Error("useValuesContext must be used within an AuthProvider");
  }
  return context;
}
