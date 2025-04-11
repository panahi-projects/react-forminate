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
  itemsParentAttributes,
  ...rest
}) => {
  const getMergedGridItemStyle = (
    colSpan?: number,
    baseStyle?: React.CSSProperties,
    extraStyle?: React.CSSProperties
  ): React.CSSProperties => ({
    ...baseStyle,
    ...extraStyle,
    ...(colSpan && {
      gridColumn: `span ${colSpan} / span ${colSpan}`,
    }),
  });

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
        {fields.map((field) => {
          const {
            colSpan,
            style: customStyle,
            ...restAttrs
          } = itemsParentAttributes?.[field.fieldId] || {};

          return (
            <div
              key={field.fieldId}
              className={itemsClassName}
              style={getMergedGridItemStyle(colSpan, itemsStyles, customStyle)}
              {...restAttrs}
            >
              <DynamicFormField {...field} />
            </div>
          );
        })}

        {children}
      </Component>
      {footer}
    </div>
  );
};

export default ContainerField;
