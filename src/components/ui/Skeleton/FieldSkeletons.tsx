// src/components/Skeleton/FieldSkeletons.tsx
import styled from "styled-components";
import { Skeleton } from "./Skeleton";

const FieldContainer = styled.div`
  margin-bottom: 1.25rem; // Added container margin for better spacing
  margin-top: 0.5rem;
`;

export const InputSkeleton = () => (
  <FieldContainer className="field-skeleton">
    <Skeleton height={16} width="25%" />
    <Skeleton height={40} />
  </FieldContainer>
);

export const SelectSkeleton = () => (
  <FieldContainer className="field-skeleton">
    <Skeleton height={16} width="25%" />
    <Skeleton height={45} />
  </FieldContainer>
);

export const CheckboxSkeleton = () => (
  <FieldContainer
    className="field-skeleton"
    style={{ display: "flex", alignItems: "center" }}
  >
    <Skeleton height={20} width={20} circle />
    <Skeleton height={16} width="25%" style={{ marginLeft: "8px" }} />
  </FieldContainer>
);

export const RadioSkeleton = () => (
  <FieldContainer
    className="field-skeleton"
    style={{ display: "flex", alignItems: "center" }}
  >
    <Skeleton height={20} width={20} circle />
    <Skeleton height={16} width="25%" style={{ marginLeft: "8px" }} />
  </FieldContainer>
);

export const TextareaSkeleton = () => (
  <FieldContainer className="field-skeleton">
    <Skeleton height={16} width="25%" />
    <Skeleton height={100} /> {/* Taller for textarea */}
  </FieldContainer>
);

export const FileInputSkeleton = () => (
  <FieldContainer className="field-skeleton">
    <Skeleton height={16} width="25%" />
    <div style={{ display: "flex", gap: "8px" }}>
      <Skeleton height={36} width={120} /> {/* Button */}
      <Skeleton height={36} width="70%" /> {/* Filename */}
    </div>
  </FieldContainer>
);

export const GroupSkeleton = () => (
  <FieldContainer className="field-skeleton">
    <Skeleton height={16} width="30%" style={{ marginBottom: "1rem" }} />{" "}
    {/* Group title */}
    <div style={{ paddingLeft: "1rem", borderLeft: "2px solid #f0f0f0" }}>
      <InputSkeleton />
      <SelectSkeleton />
      {/* Include any nested fields your group might contain */}
    </div>
  </FieldContainer>
);
