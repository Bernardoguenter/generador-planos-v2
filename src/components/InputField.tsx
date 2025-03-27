import { Control, Controller, FieldError } from "react-hook-form";
import { ValuesInterface } from "../schema/valuesSchema";

interface Props {
  name: keyof ValuesInterface | `columnValues.${number}`;
  control: Control<ValuesInterface>;
  label: string;
  type?: string;
  error?: FieldError;
}

const InputField = ({ name, control, label, type, error }: Props) => {
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
            <input
              id={name}
              type={type}
              min={0}
              {...field}
              value={
                typeof field.value === "boolean"
                  ? field.value.toString()
                  : Array.isArray(field.value)
                  ? field.value.join(", ")
                  : field.value
              }
              className={`w-1/3 border border-gray-600 rounded px-2 py-1 focus:outline-none focus:border-black ${
                error ? "is-invalid" : ""
              }`}
            />
          )}
        />
      </div>
      {error && (
        <p className="text-[60%] text-red-600 w-full text-right">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default InputField;
