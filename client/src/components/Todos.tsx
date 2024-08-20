// @ts-nocheck
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Grid, CircularProgress, Typography, Box } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { NewTodoInput } from './NewTodoInput';
import { getTodos, deleteTodo, patchTodo } from '../api/todos-api';
import { TodoItem } from './TodoItem';

const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

export function Todos() {
  const { getAccessTokenSilently } = useAuth0();
  const [todos, setTodos] = useState([]);
  const [loadingState, setLoadingState] = useState('loading'); // 'loading', 'success', 'error'

  const refreshTodos = useCallback(async () => {
    setLoadingState('loading');
    try {
      const accessToken = await getAccessTokenSilently({
        audience,
        scope: 'read:todos',
      });
      const todos = await getTodos(accessToken);
      setTodos(todos);
      setLoadingState('success');
    } catch (e) {
      setLoadingState('error');
      toast.error('Failed to fetch todos');
      console.error(e);
    }
  }, [getAccessTokenSilently]);

  useEffect(() => {
    refreshTodos();
  }, [refreshTodos]);

  const onTodoDelete = async (todoId) => {
    const originalTodos = [...todos];
    setTodos(todos.filter((todo) => todo.todoId !== todoId));
    try {
      const accessToken = await getAccessTokenSilently({
        audience,
        scope: 'delete:todo',
      });
      await deleteTodo(accessToken, todoId);
    } catch (e) {
      setTodos(originalTodos); // Revert the state in case of an error
      console.error(e);
      toast.error('Todo deletion failed');
    }
  };

  const onTodoCheck = async (pos) => {
    const originalTodos = [...todos];
    try {
      const todo = todos[pos];
      setTodos((prevTodos) =>
        prevTodos.map((t, index) =>
          index === pos ? { ...t, done: !t.done } : t
        )
      );
      const accessToken = await getAccessTokenSilently({
        audience,
        scope: 'write:todo',
      });
      await patchTodo(accessToken, todo.todoId, {
        name: todo.name,
        dueDate: todo.dueDate,
        done: !todo.done,
      });
    } catch (e) {
      setTodos(originalTodos); // Revert the state in case of an error
      console.log('Failed to update TODO', e);
      toast.error('Todo update failed');
    }
  };

  const renderTodos = () => {
    if (loadingState === 'loading') {
      return (
        <Grid container justifyContent='center'>
          <CircularProgress />
        </Grid>
      );
    }

    if (loadingState === 'error') {
      return (
        <Typography variant='body1' color='error' align='center'>
          Failed to load todos. Please try again later.
        </Typography>
      );
    }

    if (todos.length === 0) {
      return (
        <Typography variant='body1' align='center'>
          No todos found. Start by creating a new one!
        </Typography>
      );
    }

    return (
      <Grid container spacing={2}>
        {todos.map((todo, pos) => (
          <Grid item xs={12} key={todo.todoId}>
            <TodoItem
              todo={todo}
              pos={pos}
              onTodoCheck={onTodoCheck}
              onTodoDelete={onTodoDelete}
              refreshTodos={refreshTodos}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box>
      <Typography variant='h4' gutterBottom>
        TODOs
      </Typography>
      <NewTodoInput onNewTodo={() => refreshTodos()} />
      {renderTodos()}
    </Box>
  );
}
