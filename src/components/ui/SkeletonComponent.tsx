import { FieldLayout } from "@/types";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./SkeletonComponentStyle.css";

export type SkeletonComponentType =
  | "text"
  | "checkbox"
  | "radio"
  | "textarea"
  | "select"
  | "grid";

interface SkeletonComponentProps {
  type?: SkeletonComponentType;
  itemsCount?: number;
  layout?: FieldLayout;
  height?: number;
  width?: string | number;
  baseOpacity?: number;
  containerClassName?: string;
}

const SkeletonComponent: React.FC<SkeletonComponentProps> = ({
  type = "text",
  itemsCount = 1,
  layout = "column",
  height,
  width,
  baseOpacity = 0.2,
  containerClassName = "",
}) => {
  // Render skeleton items based on type
  const renderSkeletonItems = () => {
    if (type === "checkbox" || type === "radio") {
      return (
        <div className={`skeleton-options-container ${layout}`}>
          {Array.from({ length: itemsCount }).map((_, index) => (
            <div key={index} className="skeleton-option-item">
              <Skeleton
                className={`skeleton-option-control ${type === "radio" ? "radio" : ""}`}
                height={height || 16}
                width={width || 16}
                style={{ opacity: baseOpacity + 0.3 }}
              />
              <Skeleton
                className="skeleton-option-label"
                height={10}
                width={80}
                style={{ opacity: baseOpacity }}
              />
            </div>
          ))}
        </div>
      );
    }

    if (type === "grid") {
      return (
        <div className="skeleton-grid-container">
          {Array.from({ length: itemsCount }).map((_, index) => (
            <div key={index} className="skeleton-grid-item">
              <Skeleton
                className="skeleton-grid-image"
                height={height || 120}
                width={width || "100%"}
                style={{ opacity: baseOpacity + 0.3 }}
              />
              <Skeleton
                className="skeleton-grid-title"
                height={16}
                width="80%"
                style={{ opacity: baseOpacity }}
              />
              <Skeleton
                className="skeleton-grid-subtitle"
                height={12}
                width="60%"
                style={{ opacity: baseOpacity }}
              />
            </div>
          ))}
        </div>
      );
    }

    // Default skeleton for text, textarea, select
    return (
      <>
        <Skeleton
          className="skeleton-label"
          height={10}
          width="25%"
          style={{ opacity: baseOpacity }}
        />
        <Skeleton
          className={`skeleton-field ${type === "textarea" ? "skeleton-textarea" : ""}`}
          height={height || (type === "textarea" ? 100 : 40)}
          width={width || "100%"}
          style={{ opacity: baseOpacity + 0.3 }}
        />
        <Skeleton
          className="skeleton-description"
          height={6}
          width="40%"
          style={{ opacity: baseOpacity - 0.1 }}
        />
      </>
    );
  };

  return (
    <div className={`skeleton-container ${containerClassName}`}>
      {renderSkeletonItems()}
    </div>
  );
};

export default React.memo(SkeletonComponent);
