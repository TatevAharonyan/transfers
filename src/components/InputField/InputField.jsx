import React, { useMemo } from "react";
import InputMask from "react-input-mask";
import "./styles.css";

const InputField = ({
  label,
  value,
  onChange,
  placeholder = "",
  error,
  mask,
  type = "text",
  onKeyPress,
  style,
}) => {
  const styleInput = {
    display: "block",
    width: "100%",
    padding: "8px",
    marginTop: "4px",
    borderRadius: "12px",
    height: "52px",
    borderWidth: "1px",
  };

  const inputType = useMemo(() => {
    switch (mask) {
      case "9999 9999 9999 9999":
      case "99/99":
      case "999":
        return (
          <InputMask
            mask={mask}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
          >
            {(inputProps) => (
              <input
                {...inputProps}
                type={type}
                style={{
                  ...styleInput,
                  borderColor: error ? "#C24100" : "#22252B",
                }}
              />
            )}
          </InputMask>
        );
      case undefined:
        return (
          <input
            type={type}
            value={value}
            onChange={onChange}
            onKeyPress={onKeyPress}
            style={{
              ...styleInput,
              borderColor: error ? "#C24100" : "#22252B",
            }}
          />
        );
    }
  }, [mask, error, value]);

  return (
    <div className="inputWrapper" style={style}>
      <label>{label}</label>
      {inputType}
      {error && <span style={{ color: "red", marginTop: "4px" }}>{error}</span>}
    </div>
  );
};

export default InputField;
