import { usePromiseTracker } from "react-promise-tracker";

export const SpinnerComponent = () => {
  const { promiseInProgress } = usePromiseTracker({
    area: "non-blocking-area",
    delay: 500,
  });

  return (
    promiseInProgress && (
      <div className="spinner">
        <div className="spinner-border text-primary" role="status">
          <span>⏳ Actualizando datos...</span>
        </div>
      </div>
    )
  );
};
