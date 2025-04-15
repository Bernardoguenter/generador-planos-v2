import { ReactNode, useRef, useState } from "react";
import { DrawContext } from ".";

export function DrawProvider({ children }: { children: ReactNode }) {
  const [draw, setDraw] = useState<boolean>(false);
  const [scaleFactor, setScaleFactor] = useState<number>(0.4);
  const stageRef = useRef(null);

  return (
    <DrawContext.Provider
      value={{ draw, setDraw, stageRef, scaleFactor, setScaleFactor }}>
      {children}
    </DrawContext.Provider>
  );
}
