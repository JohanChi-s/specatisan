import * as React from "react";

type Props = {
  children?: React.ReactNode;
  label: React.ReactNode;
  description?: React.ReactNode;
  name: string;
  visible?: boolean;
  border?: boolean;
};

const SettingRow: React.FC<Props> = ({
  visible,
  description,
  name,
  label,
  border,
  children,
}: Props) => {
  if (visible === false) {
    return null;
  }
  return (
    <div
      className={`flex flex-col border-b ${border ? "border-gray-300" : ""}`}
    >
      <div className="py-5 md:flex md:items-center md:justify-between">
        <div className="md:flex-1">
          <label
            htmlFor={name}
            className="block text-lg font-medium text-gray-700"
          >
            {label}
          </label>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        <div className="mt-4 md:mt-0 md:ml-6 md:flex md:items-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SettingRow;
