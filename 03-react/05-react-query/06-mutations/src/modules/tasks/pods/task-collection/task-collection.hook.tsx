import React from "react";
import { useTaskCollectionQuery, useTaskMutation } from "./queries";
import { Mode } from "./task-collection.vm";

export const usePodQuery = () => {
  const [mode, setMode] = React.useState<Mode>("Readonly");
  // TODO: Mover ese -1 a una constante
  const [editingId, setEditingId] = React.useState(-1);
  const [connectionLost, setConnectionLost] = React.useState(false);
  const { taskCollection, isError } = useTaskCollectionQuery(!connectionLost);
  const { insertTaskMutation, updateTaskMutation } = useTaskMutation();

  React.useEffect(() => {
    if (isError) {
      setConnectionLost(true);
    }
  }, [isError]);

  return {
    mode,
    setMode,
    editingId,
    setEditingId,
    connectionLost,
    setConnectionLost,
    taskCollection,
    insertTaskMutation,
    updateTaskMutation,
    isError,
  };
};
