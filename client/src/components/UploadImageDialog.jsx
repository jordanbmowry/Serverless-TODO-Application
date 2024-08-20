import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from '@mui/material';
import { uploadFile, getUploadUrl } from '../api/todos-api';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';

export function UploadImageDialog({ open, onClose, todoId }) {
  const [file, setFile] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.size > 5000000) {
      toast.error('File size exceeds the limit of 5MB');
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('No file selected');
      return;
    }

    try {
      const accessToken = await getAccessTokenSilently();
      const uploadUrl = await getUploadUrl(accessToken, todoId);
      await uploadFile(uploadUrl, file);
      toast.success('File uploaded successfully');
      setFile(null); // Reset file input after successful upload
      onClose(true);
    } catch (e) {
      console.error('Failed to upload image', e);
      toast.error('Failed to upload image');
      onClose(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>Upload Image</DialogTitle>
      <DialogContent>
        <TextField
          type='file'
          fullWidth
          onChange={handleFileChange}
          inputProps={{ accept: 'image/*' }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onClose(false)}
          color='secondary'
          aria-label='Cancel Upload'
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          color='primary'
          disabled={!file}
          aria-label='Upload File'
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}
