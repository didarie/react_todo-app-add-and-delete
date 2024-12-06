import debounce from 'lodash.debounce';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { USER_ID } from './api/todos';

interface Props {
  onError: (error: string) => void;
  onSubmit: (todo: Todo) => Promise<void>;
  onTempTodo: (todo: Todo | null) => void;
}

export const TodoForm: React.FC<Props> = ({
  onError,
  onSubmit,
  onTempTodo,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [title, setTitle] = useState('');
  const [userId] = useState(USER_ID);
  const [completed] = useState(false);
  const refInput = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (refInput.current) {
      refInput.current.focus();
    }
  }, [title]);

  const reset = () => {
    setInputValue('');
    setTitle('');
    onTempTodo(null);
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      onError('Title should not be empty');

      return;
    }

    setLoading(true);
    onTempTodo({ title, userId, id: 0, completed });

    onSubmit({ title, userId, id: 0, completed })
      .then(reset)
      .catch(error => onError('Unable to add todo: ' + error.message))
      .finally(() => {
        setLoading(false);
        onTempTodo(null);
      });
  };

  const applyTodoInput = useMemo(
    () =>
      debounce((currentTodoTitle: string) => {
        setTitle(currentTodoTitle);
      }, 300),
    [],
  );

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyTodoInput(event.target.value);
    setInputValue(event.target.value);
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={loading}
        ref={refInput}
        value={inputValue}
        onChange={handleTitleChange}
      />
    </form>
  );
};
