import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Permission } from "@/app/types";
import { cn } from "@/lib/utils";

export type Option = {
  label: string | JSX.Element;
  value: string;
};

export type InputSelectProps = {
  permissions: Permission[];
  id?: string;
  name?: string;
  value?: string | null;
  label?: string;
  nude?: boolean;
  ariaLabel: string;
  short?: boolean;
  disabled?: boolean;
  className?: string;
  labelHidden?: boolean;
  icon?: React.ReactNode;
  options: Option[];
  /** @deprecated Removing soon, do not use. */
  note?: React.ReactNode;
  onChange?: (value: string | null) => void;
};

const InputSelect: React.FC<InputSelectProps> = (props) => {
  return (
    <Select onValueChange={props.onChange}>
      <SelectTrigger className={cn(`"w-full"`, props.className)}>
        <SelectValue placeholder={props.label} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{props.label}</SelectLabel>
          {props.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default InputSelect;
