import React from "react";
import { TaskVm } from "../../task-collection.vm";

interface Props {
  item: TaskVm;
  onEdit: (id: number) => void;
}

export const TaskDisplayRowComponent: React.FC<Props> = (props: Props) => {
  const { item, onEdit } = props;

  return (
    <>
      <div>{item.isDone ? "✅" : "⭕️"}</div>
      <div>{item.description}</div>
      <button onClick={() => onEdit(item.id)}>Edit</button>
    </>
  );
};
