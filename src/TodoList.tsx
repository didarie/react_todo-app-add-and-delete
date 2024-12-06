import classNames from 'classnames';
import React from 'react';
import { Todo } from './types/Todo';

interface Props {
  todos: Todo[];
  onCompleted: (todo: Todo) => void;
  tempTodo: Todo | null;
}

export const TodoList: React.FC<Props> = ({ todos, onCompleted, tempTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(({ title, id, completed }) => (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed })}
          key={id}
        >
          <label className="todo__status-label" htmlFor={`todo-status-${id}`}>
            <input
              id={`todo-status-${id}`}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={completed}
              onChange={() => onCompleted(todos[id])}
            />
            {/* accessible text for the label */}
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>
          <button type="button" className="todo__remove" data-cy="TodoDelete">
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

          <div data-cy="TodoLoader" className="modal overlay">
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
              onChange={() => onCompleted(tempTodo)}
            />
            {/* accessible text for the label */}
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>
          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
