// src/components/ui/skeletons/DefaultSkeleton.tsx
import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${pulse} 1.5s ease-in-out infinite;
  border-radius: 4px;
`;

const LabelSkeleton = styled(SkeletonBase)`
  height: 16px;
  width: 25%;
  margin-bottom: 8px;
`;

const FieldSkeleton = styled(SkeletonBase)`
  height: 40px;
  width: 100%;
`;

export const DefaultSkeleton = () => (
  <div className="default-skeleton">
    <LabelSkeleton />
    <FieldSkeleton />
  </div>
);
