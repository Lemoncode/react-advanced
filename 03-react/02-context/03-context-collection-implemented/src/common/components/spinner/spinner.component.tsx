import { usePromiseTracker } from "react-promise-tracker";

export const SpinnerComponent = () => {
  const { promiseInProgress } = usePromiseTracker();

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
