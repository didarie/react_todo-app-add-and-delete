import classNames from 'classnames';
import React from 'react';
import { Todo } from './types/Todo';

interface Props {
  todos: Todo[];
  onCompleted: (todo: Omit<Todo, 'userId'>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  tempTodo: Todo | null;
  loading: boolean;
  loadingId: number | number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  onCompleted,
  onDelete,
  tempTodo,
  loading,
  loadingId,
}) => {
  const handleTodoCompleted = ({ title, id, completed }: Todo) => {
    const updatedTodo =
      completed === false
        ? { title, id, completed: true }
        : { title, id, completed: false };

    onCompleted(updatedTodo);
  };

  const isLoading = (id: number) => {
    return (
      loading &&
      (typeof loadingId === 'number'
        ? loadingId === id
        : loadingId.includes(id))
    );
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
          key={todo.id}
        >
          <label
            className="todo__status-label"
            htmlFor={`todo-status-${todo.id}`}
          >
            <input
              id={`todo-status-${todo.id}`}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => handleTodoCompleted(todo)}
            />
            {/* accessible text for the label */}
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>

          {/*<form>
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value="Todo is being edited now"
                  />
            </form>*/}

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': isLoading(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: tempTodo.completed })}
          key={tempTodo.id}
        >
          <label
            className="todo__status-label"
            htmlFor={`todo-status-${tempTodo.id}`}
          >
            <input
              id={`todo-status-${tempTodo.id}`}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
              onChange={() => {
                onCompleted(tempTodo);
              }}
            />
            {/* accessible text for the label */}
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>
          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', { 'is-active': loading })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
