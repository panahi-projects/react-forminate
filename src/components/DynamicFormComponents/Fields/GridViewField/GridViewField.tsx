import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FieldWrapper } from "../../FieldWrapper";
import { useForm } from "../../providers/formContext";
import { dynamicOptionsType, GridViewFieldType } from "../../types";

interface DynamicField {
  dynamicOptions?: dynamicOptionsType;
}

interface GridItem {
  label: string;
  value: any;
  [key: string]: any;
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
`;

const GridItemWrapper = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-align: center;

  &:hover {
    background-color: #f9f9f9;
  }

  &.selected {
    background-color: #e0f2fe;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 0.5rem;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const Button = styled.button`
  background-color: #eee;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

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
      label={label}
      required={required}
      className={containerClassName}
      styles={containerStyles}
    >
      <GridContainer className={className} style={styles}>
        {loading ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center" }}>
            Loading...
          </div>
        ) : (
          items.map((item) => (
            <GridItemWrapper
              key={item.value}
              className={`${itemsClassName} ${
                values[fieldId] === item.value ? "selected" : ""
              }`}
              style={itemsStyles}
              onClick={() => handleSelect(item)}
            >
              {item.image && <Image src={item.image} alt={item.label} />}
              <div className="font-semibold">{item.label}</div>
              {item.price && (
                <div className="text-sm text-gray-500">${item.price}</div>
              )}
            </GridItemWrapper>
          ))
        )}
      </GridContainer>

      <PaginationWrapper>
        <Button onClick={handlePrev} disabled={page <= 1 || loading}>
          Previous
        </Button>
        <span className="text-sm">Page {page}</span>
        <Button
          onClick={handleNext}
          disabled={Boolean(
            loading || (pagination?.maxPage && page >= pagination.maxPage)
          )}
        >
          Next
        </Button>
      </PaginationWrapper>
    </FieldWrapper>
  );
};

export default GridViewField;
