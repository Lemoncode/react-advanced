import React from 'react';
import { TodoItem } from '../todo.model';
import { TodoItemEdit } from './todo-item-edit.component';
import { TodoItemDisplay } from './todo-item-display.component';

interface Props {
  editingId : number;
  todo: TodoItem;
  onEnterEditMode: (id: number) => void;
  onUpdate: (item: TodoItem) => void;
  onCancel: () => void;
}

export const TodoItemComponent : React.FC<Props> = (props: Props) => {
  const {todo, editingId, onEnterEditMode, onUpdate, onCancel} = props;

  return (
    <>
        {todo.id !== editingId ? (
            <TodoItemDisplay
              key={todo.id}
              item={todo}
              onEdit={onEnterEditMode}
            />
          ) : (
            <TodoItemEdit
              key={todo.id}
              item={todo}
              onSave={onUpdate}
              onCancel={onCancel}
            />
          )
      }
    </>
  );
}