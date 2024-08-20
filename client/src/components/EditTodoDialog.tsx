// @ts-nocheck
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Checkbox,
} from '@mui/material';
import { patchTodo } from '../api/todos-api';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';

const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

export function EditTodoDialog({ open, onClose, todo, onSave }) {
  const { getAccessTokenSilently } = useAuth0();
  const [newName, setNewName] = useState(todo.name);
  const [newDueDate, setNewDueDate] = useState(todo.dueDate);
  const [isDone, setIsDone] = useState(todo.done);

  useEffect(() => {
    setNewName(todo.name);
    setNewDueDate(todo.dueDate);
    setIsDone(todo.done);
  }, [todo]);

  const handleSave = async () => {
    if (!newName.trim()) {
      toast.error('Todo name cannot be empty');
      return;
    }

    try {
      const accessToken = await getAccessTokenSilently({
        audience,
        scope: 'write:todo',
      });

      await patchTodo(accessToken, todo.todoId, {
        name: newName,
        dueDate: newDueDate,
        done: isDone,
      });

      toast.success('Todo updated successfully');
      onSave(newName, newDueDate, isDone);
    } catch (error) {
      console.error('Failed to update TODO', error);
      toast.error('Failed to update TODO');
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>Edit Todo</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin='dense'
          label='Name'
          type='text'
          fullWidth
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <TextField
          margin='dense'
          label='Due Date'
          type='date'
          fullWidth
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
        />
        <Checkbox
          checked={isDone}
          onChange={(e) => setIsDone(e.target.checked)}
        />
        Done
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color='secondary'>
          Cancel
        </Button>
        <Button onClick={handleSave} color='primary'>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
