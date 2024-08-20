import Axios from 'axios';

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

const getAuthHeaders = (idToken) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${idToken}`,
});

export async function getTodos(idToken) {
  try {
    console.log('Fetching todos');
    const response = await Axios.get(`${apiEndpoint}/todos`, {
      headers: getAuthHeaders(idToken),
    });
    console.log('Todos:', response.data);
    return response.data.items;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw new Error('Could not fetch todos');
  }
}

export async function createTodo(idToken, newTodo) {
  try {
    const response = await Axios.post(
      `${apiEndpoint}/todos`,
      JSON.stringify(newTodo),
      {
        headers: getAuthHeaders(idToken),
      }
    );
    return response.data.item;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw new Error('Could not create todo');
  }
}

export async function patchTodo(idToken, todoId, updatedTodo) {
  try {
    await Axios.patch(
      `${apiEndpoint}/todos/${todoId}`,
      JSON.stringify(updatedTodo),
      {
        headers: getAuthHeaders(idToken),
      }
    );
  } catch (error) {
    console.error(`Error updating todo with ID ${todoId}:`, error);
    throw new Error('Could not update todo');
  }
}

export async function deleteTodo(idToken, todoId) {
  try {
    await Axios.delete(`${apiEndpoint}/todos/${todoId}`, {
      headers: getAuthHeaders(idToken),
    });
  } catch (error) {
    console.error(`Error deleting todo with ID ${todoId}:`, error);
    throw new Error('Could not delete todo');
  }
}

export async function getUploadUrl(idToken, todoId) {
  try {
    const response = await Axios.post(
      `${apiEndpoint}/todos/${todoId}/attachment`,
      '',
      {
        headers: getAuthHeaders(idToken),
      }
    );
    return response.data.uploadUrl;
  } catch (error) {
    console.error(
      `Error getting upload URL for todo with ID ${todoId}:`,
      error
    );
    throw new Error('Could not get upload URL');
  }
}

export async function uploadFile(uploadUrl, file) {
  try {
    await Axios.put(uploadUrl, file);
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Could not upload file');
  }
}
