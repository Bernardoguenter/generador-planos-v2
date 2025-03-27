import { Control, Controller, FieldError } from "react-hook-form";
import { ValuesInterface } from "../schema/valuesSchema";
import { ReactNode } from "react";

interface Props {
  name: keyof ValuesInterface;
  control: Control<ValuesInterface>;
  label: string;
  error?: FieldError;
  children: ReactNode;
}

const SelectField = ({ name, control, label, error, children }: Props) => {
  return (
    <div className="flex flex-col items-start justify-start w-full">
      <div className="flex items-center justify-start w-full">
        <label
          htmlFor={name}
          className="w-2/3">
          {label}
        </label>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <select
              id={name}
              onChange={(e) => field.onChange(e.target.value)}
              className={`w-1/3 border border-gray-600 rounded px-2 py-1 focus:outline-none focus:border-black ${
                error ? "border-red-500" : ""
              }`}>
              {children}
            </select>
          )}
        />
      </div>
      {error && (
        <p className="text-[60%] text-red-600 w-full text-right">
          {error.message as string}
        </p>
      )}
    </div>
  );
};

export default SelectField;
