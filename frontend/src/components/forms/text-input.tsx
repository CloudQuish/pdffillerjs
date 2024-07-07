import React from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { IInput } from "@/interfaces";
import { Textarea } from "../ui/textarea";

const TextInput = ({
  control,
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  input_box_type = "normal",
}: IInput) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
            <FormControl>
              {input_box_type === "normal" ? (
                <Input
                  placeholder={placeholder}
                  disabled={disabled}
                  {...field}
                />
              ) : (
                <Textarea
                  placeholder={placeholder}
                  disabled={disabled}
                  {...field}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default TextInput;
