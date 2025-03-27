import jsPDF from "jspdf";
import Konva from "konva";
import { RefObject } from "react";

export function convertPDF(
  stageRef: RefObject<Konva.Stage | null>,
  alto: number,
  ancho: number
) {
  // Generar la imagen del canvas de Konva como PNG
  const dataURL =
    stageRef.current && stageRef.current.toDataURL({ pixelRatio: 2 }); // Ajusta pixelRatio para mayor calidad

  // Crear un nuevo documento PDF en orientación landscape
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [1000, 560], // Ajusta el tamaño de acuerdo al canvas
  });

  // Agregar la imagen PNG al PDF
  if (dataURL) {
    pdf.addImage(dataURL, "PNG", 10, 10, 1000, 560); // Ajusta tamaño y posición de la imagen en el PDF
  }

  // Guardar el PDF
  pdf.save(`Plano galpón ${alto}x${ancho}.pdf`);
}
