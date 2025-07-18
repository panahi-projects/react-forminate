export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  count?: number;
  className?: string;
  style?: React.CSSProperties;
}

export type SkeletonFieldType =
  | "input"
  | "select"
  | "checkbox"
  | "radio"
  | "textarea"
  | "file"
  | "group";

export interface FieldSkeletonProps {
  density?: "compact" | "normal" | "spacious";
  showLabel?: boolean;
}
