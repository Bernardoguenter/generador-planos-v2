import { z } from "zod";

export const valuesSchema = z.object({
  alto: z.coerce
    .number({
      required_error: "Alto es requerido",
      invalid_type_error: "Alto debe ser un número",
    })
    .nonnegative("El valor debe ser mayor a 0"),
  ancho: z.coerce
    .number({
      required_error: "Ancho es requerido",
      invalid_type_error: "Ancho debe ser un número",
    })
    .nonnegative("El valor debe ser mayor a 0"),
  largo: z.coerce
    .number({
      required_error: "Largo es requerido",
      invalid_type_error: "Largo debe ser un número",
    })
    .nonnegative("El valor debe ser mayor a 0"),
  pico: z.coerce
    .number({
      invalid_type_error: "Pico debe ser un número",
    })
    .nonnegative("El valor debe ser mayor a 0"),
  anchoColumna: z.coerce
    .number({
      invalid_type_error: "Alto debe ser un número",
    })
    .nonnegative("El valor debe ser mayor a 0"),
  largoCaja: z.coerce
    .number({
      required_error: "Largo Caja es requerido",
      invalid_type_error: "Largo Caja debe ser un número",
    })
    .nonnegative("El valor debe ser mayor a 0"),
  lineaPico: z.coerce
    .number({
      invalid_type_error: "Línea Pico debe ser un número",
    })
    .nonnegative("El valor debe ser mayor a 0"),
  altoPozo: z.coerce
    .number({
      required_error: "Alto pozo es requerido",
      invalid_type_error: "Alto pozo debe ser un número",
    })
    .nonnegative("El valor debe ser mayor a 0"),
  cantidadColumnas: z.coerce
    .number({
      invalid_type_error: "Cantidad de columnas debe ser un número",
    })
    .nonnegative("El valor debe ser mayor a 0"),
  columnValues: z
    .array(
      z.coerce
        .number({
          invalid_type_error: "Cantidad de columnas debe ser un número",
        })
        .nonnegative("El valor debe ser mayor a 0")
    )
    .optional(),
  separacionLineas: z.coerce
    .number({
      invalid_type_error: "Separación de líneas debe ser un número",
    })
    .nonnegative("El valor debe ser mayor a 0"),
  fijaCorreas: z.coerce
    .number({
      invalid_type_error: "Separación de líneas debe ser un número",
    })
    .nonnegative("El valor debe ser mayor a 0"),
  perfiles: z.coerce
    .number({
      invalid_type_error: "Separación de líneas debe ser un número",
    })
    .nonnegative("El valor debe ser mayor a 0"),
  cerramiento: z.coerce
    .number({
      invalid_type_error: "Separación de líneas debe ser un número",
    })
    .nonnegative("El valor debe ser mayor a 0"),
  esFrente: z.boolean(),
  tienePorton: z.boolean(),
  altoPorton: z.coerce
    .number({
      invalid_type_error: "Alto Portón debe ser un número",
    })
    .nonnegative("El valor debe ser mayor a 0")
    .optional(),
  ubicacionPorton: z.coerce
    .number({
      invalid_type_error: "La ubicación del portón debe ser un número",
    })
    .optional(),
  tienePerfilesSobrePorton: z.boolean(),
  cantidadPerfilesSobrePorton: z.coerce
    .number({
      invalid_type_error:
        "La cantidad de perfiles sobre portón debe ser un número",
    })
    .nonnegative("El valor debe ser mayor a 0")
    .optional(),
  tienePerfilesSobreTecho: z.boolean(),
  cantidadPerfilesSobreTecho: z.coerce
    .number({
      invalid_type_error:
        "La cantidad de perfiles sobre techo debe ser un número",
    })
    .nonnegative("El valor debe ser mayor a 0")
    .optional(),
});

export type ValuesInterface = z.infer<typeof valuesSchema>;
