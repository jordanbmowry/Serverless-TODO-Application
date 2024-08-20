import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Divider, Grid, TextField, Button } from '@mui/material';
import { createTodo } from '../api/todos-api';
import { toast } from 'react-toastify';

const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

export function NewTodoInput({ onNewTodo }) {
  const { getAccessTokenSilently } = useAuth0();

  const formik = useFormik({
    initialValues: {
      name: '',
      dueDate: new Date().toISOString().split('T')[0], // Set today's date as default
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Todo name is required')
        .min(3, 'Todo name must be at least 3 characters'),
      dueDate: Yup.date().required('Due date is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const accessToken = await getAccessTokenSilently({
          audience,
          scope: 'write:todos',
        });

        const createdTodo = await createTodo(accessToken, {
          name: values.name,
          dueDate: values.dueDate,
        });

        onNewTodo(createdTodo);
        resetForm();
      } catch (e) {
        console.error('Failed to create a new TODO', e);
        toast.error('Todo creation failed', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} alignItems='center'>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            id='name'
            name='name'
            label='Todo Name'
            variant='outlined'
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            id='dueDate'
            name='dueDate'
            label='Due Date'
            type='date'
            variant='outlined'
            value={formik.values.dueDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            InputLabelProps={{
              shrink: true,
            }}
            error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
            helperText={formik.touched.dueDate && formik.errors.dueDate}
          />
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth variant='contained' color='primary' type='submit'>
            New Task
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Grid>
    </form>
  );
}
