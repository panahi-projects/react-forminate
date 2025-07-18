// src/components/Skeleton/Skeleton.tsx
import React from "react";
import styled, { keyframes } from "styled-components";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  count?: number;
  className?: string;
  style?: React.CSSProperties;
}

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

const SkeletonBase = styled.div<{
  $width: string | number;
  $height: string | number;
  $circle: boolean;
}>`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${pulse} 1.5s ease-in-out infinite;
  border-radius: ${({ $circle }) => ($circle ? "50%" : "4px")};
  width: ${({ $width }) =>
    typeof $width === "number" ? `${$width}px` : $width};
  height: ${({ $height }) =>
    typeof $height === "number" ? `${$height}px` : $height};
  margin-bottom: 0.75rem; // Added consistent bottom margin
`;

export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "1rem",
  circle = false,
  count = 1,
  className = "",
  style,
}) => {
  const skeletons = Array.from({ length: count }).map((_, i) => (
    <SkeletonBase
      key={i}
      $width={width}
      $height={height}
      $circle={circle}
      className={className}
      style={{
        ...style,
        marginBottom: i < count - 1 ? "0.75rem" : "0.5rem", // Adjusted margins
      }}
    />
  ));

  return <>{skeletons}</>;
};
