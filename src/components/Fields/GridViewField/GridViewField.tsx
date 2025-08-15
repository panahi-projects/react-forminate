import { FieldWrapper } from "@/components/FieldWrapper";
import { useForm } from "@/hooks";
import {
  dynamicOptionsType,
  GridViewFieldType,
  TFieldLabel,
  TFieldRequired,
} from "@/types";
import React, { useEffect, useState } from "react";
import "./GridViewStyle.css";
interface DynamicField {
  dynamicOptions?: dynamicOptionsType;
}

interface GridItem {
  label: string;
  value: any;
  [key: string]: any;
}

const GridViewField: React.FC<GridViewFieldType> = ({
  fieldId,
  label,
  required,
  className = "",
  styles = {},
  containerClassName = "",
  containerStyles = {},
  itemsClassName = "",
  itemsStyles = {},
}) => {
  const { values, setValue, dynamicOptions, fetchDynamicOptions, formSchema } =
    useForm();

  const [page, setPage] = useState(1);
  const [items, setItems] = useState<GridItem[]>([]);
  const [loading, setLoading] = useState(false);

  const field = formSchema.fields.find(
    (f) => f.fieldId === fieldId
  ) as DynamicField;
  const pagination = field?.dynamicOptions?.pagination;
  const limit = pagination?.limit || 10;

  const fetchData = async () => {
    setLoading(true);
    await fetchDynamicOptions(fieldId, values, { page, limit });
    setItems(dynamicOptions[fieldId] || []);
    setLoading(false);
  };

  useEffect(() => {
    if (field?.dynamicOptions?.fetchOnInit !== false) fetchData();
  }, [page]);

  useEffect(() => {
    setItems(dynamicOptions[fieldId] || []);
  }, [dynamicOptions[fieldId]]);

  const handleSelect = (item: GridItem) => {
    setValue(fieldId, item.value);
  };

  const handleNext = () => setPage((p) => p + 1);
  const handlePrev = () => setPage((p) => Math.max(p - 1, 1));

  return (
    <FieldWrapper
      id={fieldId}
      label={label as TFieldLabel}
      required={required as TFieldRequired}
      className={containerClassName}
      styles={containerStyles}
    >
      <div className={`grid-view-container ${className}`} style={styles}>
        {loading ? (
          <div className="grid-view-loading">Loading...</div>
        ) : (
          items.map((item) => (
            <div
              key={item.value}
              className={`grid-item-wrapper ${itemsClassName} ${
                values[fieldId] === item.value ? "selected" : ""
              }`}
              style={itemsStyles}
              onClick={() => handleSelect(item)}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.label}
                  className="grid-view-image"
                />
              )}
              <div className="grid-item-label">{item.label}</div>
              {item.price && (
                <div className="grid-item-price">${item.price}</div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="grid-view-pagination">
        <button
          className="grid-view-button"
          onClick={handlePrev}
          disabled={page <= 1 || loading}
        >
          Previous
        </button>
        <span className="text-sm">Page {page}</span>
        <button
          className="grid-view-button"
          onClick={handleNext}
          disabled={Boolean(
            loading || (pagination?.maxPage && page >= pagination.maxPage)
          )}
        >
          Next
        </button>
      </div>
    </FieldWrapper>
  );
};

export default React.memo(GridViewField);
