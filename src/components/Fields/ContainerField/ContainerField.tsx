import { DynamicFormField } from "@/components/DynamicFormField";
import { ContainerFieldType, FieldAsHTMLContainerTagType } from "@/types";
import React, { createElement } from "react";

interface ContainerFieldProps extends Omit<ContainerFieldType, "as"> {
  as: FieldAsHTMLContainerTagType | React.ComponentType<any>;
}

const ContainerField: React.FC<ContainerFieldProps> = ({
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

  // Determine if Component is a string (HTML tag) or React component
  const isHtmlTag = typeof Component === "string";

  return (
    <div style={containerStyles} className={containerClassName}>
      {header}
      {isHtmlTag ? (
        // Render as HTML tag
        createElement(
          Component as string,
          {
            className,
            style: {
              display: "grid",
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: gap,
              ...styles,
            },
            ...rest,
          },
          <>
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
                  style={getMergedGridItemStyle(
                    colSpan,
                    itemsStyles,
                    customStyle
                  )}
                  {...restAttrs}
                >
                  <DynamicFormField {...field} />
                </div>
              );
            })}
            {children}
          </>
        )
      ) : (
        // Render as React component
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
                style={getMergedGridItemStyle(
                  colSpan,
                  itemsStyles,
                  customStyle
                )}
                {...restAttrs}
              >
                <DynamicFormField {...field} />
              </div>
            );
          })}
          {children}
        </Component>
      )}
      {footer}
    </div>
  );
};

export default React.memo(ContainerField);
