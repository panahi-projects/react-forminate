import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonComponent = () => {
  return (
    <div>
      <Skeleton
        height={15}
        width={"25%"}
        style={{ opacity: 0.2, marginTop: "10px" }}
      />
      <Skeleton
        height={40}
        width={"100%"}
        style={{ opacity: 0.5, marginBottom: "15px" }}
      />
    </div>
  );
};

export default SkeletonComponent;
