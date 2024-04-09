"use client";

import ReactSelect from "react-select";

interface Props {
  label?: string;
  value?: Record<string, any>;
  onChange?: (value: Record<string, any>) => void;
  options: Record<string, any>[];
  disabled?: boolean;
}

const Select: React.FC<Props> = ({
  label,
  value,
  disabled,
  onChange,
  options,
}) => {
  return (
    <div className="z-[100]">
      <div className="block text-sm font-medium leading-6 text-gray-600">
        {label}
      </div>
      <div className="mt-2">
        <ReactSelect
          isDisabled={disabled}
          value={value}
          onChange={onChange}
          isMulti
          options={options}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,
            }),
          }}
          classNames={{
            control: () => "text-sm",
          }}
        />
      </div>
    </div>
  );
};

export default Select;
