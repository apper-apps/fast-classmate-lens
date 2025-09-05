import React from "react";
import { cn } from "@/utils/cn";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const FormField = ({ 
  label, 
  error, 
  type = "text",
  options = [],
  className,
  children,
  ...props 
}) => {
  const id = props.id || props.name;

  const renderInput = () => {
    if (type === "select") {
      return (
        <Select {...props} className={cn("w-full", error && "border-red-500")}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      );
    }

    if (type === "textarea") {
      return (
        <textarea
          {...props}
          className={cn(
            "form-input flex min-h-[80px] w-full rounded-md border-2 border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
            error && "border-red-500",
            props.className
          )}
        />
      );
    }

    return (
      <Input 
        type={type} 
        {...props} 
        className={cn("w-full", error && "border-red-500", props.className)}
      />
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      {children || renderInput()}
      {error && (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default FormField;