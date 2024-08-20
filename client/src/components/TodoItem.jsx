import React, { useState } from 'react';
import { Checkbox, Typography, Box, Divider } from '@mui/material';
import { format } from 'date-fns';
import { UploadImageDialog } from './UploadImageDialog';
import { EditTodoDialog } from './EditTodoDialog';
import { TodoActions } from './TodoActions';

export function TodoItem({
  todo,
  pos,
  onTodoCheck,
  onTodoDelete,
  refreshTodos,
}) {
  const [dialogState, setDialogState] = useState({
    isImageDialogOpen: false,
    isEditDialogOpen: false,
  });

  const handleDialogOpen = (type) => {
    setDialogState((prevState) => ({ ...prevState, [type]: true }));
  };

  const handleDialogClose = (type, success = false) => {
    setDialogState((prevState) => ({ ...prevState, [type]: false }));
    if (success) refreshTodos();
  };

  const handleDeleteClick = () => {
    onTodoDelete(todo.todoId);
  };

  return (
    <Box mt={2}>
      <Box
        display='flex'
        alignItems='center'
        flexGrow={1}
        sx={{
          textDecoration: todo.done ? 'line-through' : 'none',
          opacity: todo.done ? 0.6 : 1,
        }}
      >
        <Checkbox
          checked={todo.done}
          onChange={() => onTodoCheck(pos)}
          aria-label='Mark as done'
        />
        <Box flexGrow={1}>
          <Typography variant='body1'>{todo.name}</Typography>
          <Typography variant='body2' color='textSecondary'>
            Due: {format(new Date(todo.dueDate), 'PPPP')}
          </Typography>
        </Box>
        <TodoActions
          onEditClick={() => handleDialogOpen('isEditDialogOpen')}
          onImageUploadClick={() => handleDialogOpen('isImageDialogOpen')}
          onDeleteClick={handleDeleteClick}
        />
      </Box>

      {todo.attachmentUrl && (
        <Box mt={2}>
          <img
            src={todo.attachmentUrl}
            alt='Attachment'
            style={{ maxWidth: '100%' }}
          />
        </Box>
      )}

      <Divider sx={{ mt: 2 }} />

      <EditTodoDialog
        open={dialogState.isEditDialogOpen}
        onClose={(success) => handleDialogClose('isEditDialogOpen', success)}
        todo={todo}
      />

      <UploadImageDialog
        open={dialogState.isImageDialogOpen}
        onClose={(success) => handleDialogClose('isImageDialogOpen', success)}
        todoId={todo.todoId}
      />
    </Box>
  );
}
