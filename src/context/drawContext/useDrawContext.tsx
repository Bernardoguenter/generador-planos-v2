import { ReactNode, useRef, useState } from "react";
import { DrawContext } from ".";

export function DrawProvider({ children }: { children: ReactNode }) {
  const [draw, setDraw] = useState<boolean>(false);
  const stageRef = useRef(null);

  return (
    <DrawContext.Provider value={{ draw, setDraw, stageRef }}>
      {children}
    </DrawContext.Provider>
  );
}
