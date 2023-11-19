import React from "react";
import classes from "./header.css";

export const Header: React.FC = () => {
  const { elementRef, elementHeight } = useElementHeight();
  return (
    <>
      <header ref={elementRef} className={classes.root}>
        This is the header component
      </header>
      <Offset height={elementHeight} />
    </>
  );
};

interface OffsetProps {
  height: number;
}

const Offset: React.FC<OffsetProps> = (props) => {
  const { height } = props;
  return <div style={{ minHeight: height }} />;
};

const useElementHeight = () => {
  const elementRef = React.useRef<HTMLElement>(null);
  const [elementHeight, setElementHeight] = React.useState<number>(null);

  const handleSetHeight = () => {
    if (elementRef.current) {
      setElementHeight(elementRef.current.clientHeight);
    }
  };

  React.useEffect(() => {
    handleSetHeight();
  }, [elementRef.current?.clientHeight]);

  React.useEffect(() => {
    window.addEventListener("resize", handleSetHeight);
    return () => {
      window.removeEventListener("resize", handleSetHeight);
    };
  }, []);

  return {
    elementRef,
    elementHeight,
  };
};
