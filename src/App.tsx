/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoFilter } from './types/TodoFilter';
import classNames from 'classnames';
import { TodoList } from './TodoList';
import { TodoFooter } from './TodoFooter';
import { TodoForm } from './TodoForm';
import * as todoServices from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.All);
  const [completedTodo, setCompletedTodo] = useState<Todo | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  // #region loadTodos
  async function loadTodos() {
    try {
      const loadedTodos = await getTodos();

      setTodos(loadedTodos);
    } catch {
      setError('Unable to load todos');
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (error !== '') {
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  }, [error]);

  // #endregion

  // #region filter
  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case TodoFilter.Active:
        return !todo.completed;
      case TodoFilter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos, completedTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  // #endregion

  function addTodo({ title, userId, id, completed }: Todo) {
    return todoServices
      .addTodo({ title, userId, id, completed })
      .then(() =>
        setTodos(prevTodos => [...prevTodos, { title, userId, id, completed }]),
      );
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <TodoForm
            onError={setError}
            onSubmit={addTodo}
            onTempTodo={setTempTodo}
          />
        </header>

        {/* Hide the footer if there are no todos  */}

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            onCompleted={setCompletedTodo}
            tempTodo={tempTodo}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            filter={filter}
            onChange={setFilter}
            activeItems={todos.length - completedTodos.length}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}

        {/*
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo*/}
      </div>
    </div>
  );
};
