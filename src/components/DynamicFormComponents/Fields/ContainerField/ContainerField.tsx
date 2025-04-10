import React from "react";
import { ContainerField as ContainerFieldType } from "../../types";
import { DynamicFormField } from "../../DynamicFormField";

const ContainerField: React.FC<ContainerFieldType> = ({
  as: Component = "div",
  fieldId: id,
  columns = 1,
  gap = 16,
  fields,
  containerStyles,
  containerClassName,
  styles,
  className,
  itemsStyles,
  itemsClassName,
  children,
  header,
  footer,
  ...rest
}) => {
  return (
    <div style={containerStyles} className={containerClassName}>
      {header}
      <Component
        className={className}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: gap,
          ...styles,
        }}
        {...rest}
      >
        {fields.map((field) => (
          <div
            key={field.fieldId}
            className={itemsClassName}
            style={itemsStyles}
          >
            <DynamicFormField {...field} />
          </div>
        ))}
        {children}
      </Component>
      {footer}
    </div>
  );
};

export default ContainerField;
