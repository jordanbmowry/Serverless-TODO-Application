import React from 'react';
import { IconButton } from '@mui/material';
import {
  Edit as EditIcon,
  Image as ImageIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

export function TodoActions({
  onEditClick,
  onImageUploadClick,
  onDeleteClick,
}) {
  return (
    <>
      <IconButton color='primary' onClick={onEditClick} aria-label='Edit Todo'>
        <EditIcon />
      </IconButton>
      <IconButton
        color='primary'
        onClick={onImageUploadClick}
        aria-label='Upload Image'
      >
        <ImageIcon />
      </IconButton>
      <IconButton
        color='error'
        onClick={onDeleteClick}
        aria-label='Delete Todo'
      >
        <DeleteIcon />
      </IconButton>
    </>
  );
}
