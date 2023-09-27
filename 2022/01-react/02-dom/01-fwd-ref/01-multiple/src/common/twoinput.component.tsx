import React from "react";

interface InputProps {
  labelA: string;
  valueA: string;
  onChangeA: (newValue: string) => void;
  labelB: string;
  valueB: string;
  onChangeB: (newValue: string) => void;
  inputRefA?: React.RefObject<HTMLInputElement>;
  inputRefB?: React.RefObject<HTMLInputElement>;
}

export const TwoInput: React.FC<InputProps> = (props) => {
  const {
    labelA,
    valueA,
    onChangeA,
    labelB,
    valueB,
    onChangeB,
    inputRefA,
    inputRefB,
  } = props;

  const handleChangeA = (event: any) => {
    onChangeA(event.target.value);
  };

  const handleChangeB = (event: any) => {
    onChangeB(event.target.value);
  };

  return (
    <>
      <input
        placeholder={labelA}
        value={valueA}
        onChange={handleChangeA}
        ref={inputRefA}
      />
      <input
        placeholder={labelB}
        value={valueB}
        onChange={handleChangeB}
        ref={inputRefB}
      />
    </>
  );
};
