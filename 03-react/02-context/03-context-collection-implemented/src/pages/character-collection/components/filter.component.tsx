import React from "react";

interface Props {
  filter: string;
  onFilterChange: (filter: string) => void;
}

export const FilterComponent: React.FC<Props> = (props) => {
  const { filter, onFilterChange } = props;

  return (
    <>
      <label htmlFor="filter">filter</label>
      <input
        id="filter"
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
      />
    </>
  );
};
