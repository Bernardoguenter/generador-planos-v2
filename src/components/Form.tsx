import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import InputField from "./InputField";
import { ValuesInterface, valuesSchema } from "../schema/valuesSchema";
import { useValuesContext } from "../context/valuesContext";
import { useEffect } from "react";
import { convertPDF } from "../utils/jsToPdf";
import { useDrawContext } from "../context/drawContext";
import CheckboxField from "./CheckboxField";
import SelectField from "./SelectInput";

export const Form = () => {
  const { values, setValues, setNote } = useValuesContext();
  const { draw, setDraw, stageRef } = useDrawContext();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ValuesInterface>({
    resolver: zodResolver(valuesSchema),
    mode: "onChange",
    defaultValues: values,
  });

  const cantidadColumnas = watch("cantidadColumnas", values.cantidadColumnas);
  const columnValues = watch("columnValues", values.columnValues || []);
  const esFrente = watch("esFrente", values.esFrente);
  const tienePorton = watch("tienePorton", values.tienePorton);
  const tienePerfilesSobrePorton = watch(
    "tienePerfilesSobrePorton",
    values.tienePerfilesSobrePorton
  );

  useEffect(() => {
    let newColumnValues = [...(columnValues || [])];
    if (columnValues && cantidadColumnas > columnValues.length) {
      newColumnValues = [
        ...columnValues,
        ...Array(cantidadColumnas - columnValues.length).fill(0),
      ];
    } else {
      newColumnValues = newColumnValues.slice(0, cantidadColumnas);
    }
    setValue("columnValues", newColumnValues);
  }, [cantidadColumnas, setValue]);

  useEffect(() => {
    setValue("tienePorton", tienePorton);
  }, [tienePorton, setValue]);

  useEffect(() => {
    setValue("tienePerfilesSobrePorton", tienePerfilesSobrePorton);
  }, [tienePerfilesSobrePorton, setValue]);

  const onSubmit: SubmitHandler<ValuesInterface> = (data) => {
    setValues(data);
    setDraw(true);
  };

  const resetValues = () => {
    reset();
    setDraw(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 w-full md:w-1/4 justify-start items-center py-8 px-8  bg-slate-200 md:min-h-screen ">
      <h2 className="text-2xl font-bold text-center mb-8">
        Generador de Planos
      </h2>
      <InputField
        name="ancho"
        control={control}
        label="Ancho  (cms)"
        type="number"
        error={errors.ancho}
      />
      <InputField
        name="largo"
        control={control}
        label="Largo  (cms)"
        type="number"
        error={errors.largo}
      />
      <InputField
        name="alto"
        control={control}
        label="Alto  (cms)"
        type="number"
        error={errors.alto}
      />
      <InputField
        name="cerramiento"
        control={control}
        label="Cerramiento (cms)"
        type="number"
        error={errors.cerramiento}
      />

      <InputField
        name="pico"
        control={control}
        label="Pico  (cms)"
        type="number"
        error={errors.pico}
      />
      <InputField
        name="anchoColumna"
        control={control}
        label="Ancho Columna  (cms)"
        type="number"
        error={errors.anchoColumna}
      />
      <InputField
        name="largoCaja"
        control={control}
        label="Largo Caja  (cms)"
        type="number"
        error={errors.largoCaja}
      />
      <InputField
        name="lineaPico"
        control={control}
        label="Linea Pico  (cms)"
        type="number"
        error={errors.lineaPico}
      />
      <InputField
        name="altoPozo"
        control={control}
        label="Alto Pozo  (cms)"
        type="number"
        error={errors.altoPozo}
      />
      <InputField
        name="separacionLineas"
        control={control}
        label="Separación Líneas  (cms)"
        type="number"
        error={errors.separacionLineas}
      />
      <InputField
        name="fijaCorreas"
        control={control}
        label="Fija Correas (cantidad)"
        type="number"
        error={errors.fijaCorreas}
      />
      <InputField
        name="perfiles"
        control={control}
        label="Perfiles (cantidad)"
        type="number"
        error={errors.perfiles}
      />

      <InputField
        name="cantidadColumnas"
        control={control}
        label="Cantidad de Columnas (cantidad)"
        type="number"
        error={errors.cantidadColumnas}
      />
      {columnValues &&
        columnValues.map((_, index) => (
          <div
            key={`Col-${index + 1}`}
            className="flex items-center justify-start w-full ">
            <label className="w-1/2">{`Col-${index + 1}`}</label>
            <Controller
              name={`columnValues.${index}` as const}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  className={`w-1/2 border border-gray-600 rounded px-2 py-1 focus:outline-none focus:border-black ${
                    errors.columnValues ? "is-invalid" : ""
                  }`}
                />
              )}
            />
            {errors.columnValues && (
              <p className="error">{errors.columnValues.message}</p>
            )}
          </div>
        ))}
      <CheckboxField
        name="esFrente"
        label="Es Frente?"
        control={control}
        error={errors.esFrente}
      />
      {esFrente && (
        <CheckboxField
          name="tienePorton"
          label="Tiene Portón?"
          control={control}
          error={errors.tienePorton}
        />
      )}

      {esFrente && tienePorton && (
        <InputField
          name="altoPorton"
          control={control}
          label="Alto Portón (cms)"
          type="number"
          error={errors.altoPorton}
        />
      )}
      {esFrente && tienePorton && (
        <SelectField
          name="ubicacionPorton"
          control={control}
          label="Ubicación Portón(Sección)"
          error={errors.ubicacionPorton}>
          {columnValues &&
            columnValues.map((col, index) => (
              <option
                value={index + 1}
                key={`select-seccion-${index}-${col}`}>
                {index + 1}
              </option>
            ))}
          <option value={Number(cantidadColumnas) + 1}>
            {Number(cantidadColumnas) + 1}
          </option>
        </SelectField>
      )}
      {esFrente && tienePorton && (
        <CheckboxField
          name="tienePerfilesSobrePorton"
          label="Tiene Perfiles sobre el Portón?"
          control={control}
          error={errors.tienePerfilesSobrePorton}
        />
      )}
      {esFrente && tienePorton && tienePerfilesSobrePorton && (
        <InputField
          name="cantidadPerfilesSobrePorton"
          control={control}
          label="Perfiles sobre el Portón (cantidad)"
          type="number"
          error={errors.cantidadPerfilesSobrePorton}
        />
      )}
      <div className="flex items-start justify-start w-full flex-col ">
        <label htmlFor="note">Agregar Nota (opcional)</label>
        <textarea
          name="note"
          className="w-full border border-gray-600 rounded px-2 py-1 focus:outline-none focus:border-black"
          onChange={(e) => setNote(e.target.value)}></textarea>
      </div>

      <button
        type="submit"
        className="w-full  max-w-full m-auto text-center p-2 rounded text-white font-medium disabled:cursor-not-allowed disabled:bg-blue-200 bg-blue-800 cursor-pointer hover:bg-blue-700">
        Generar Plano
      </button>
      <button
        onClick={() => convertPDF(stageRef, values.alto, values.ancho)}
        disabled={!draw}
        className="w-full  max-w-full m-auto text-center p-2 rounded text-white font-medium disabled:cursor-not-allowed disabled:bg-red-200 bg-red-800 hover:bg-red-700 cursor-pointer">
        Exportar plano a PDF
      </button>
      <button
        onClick={resetValues}
        className=" w-full text-center p-2 rounded text-white font-medium disabled:cursor-not-allowed 
            disabled:bg-gray-400 bg-black hover:bg-gray-900 cursor-pointer">
        Resetear Valores
      </button>
    </form>
  );
};
