declare module '../api/todos-api' {
  const createTodo: any;
  const getTodos: any;
  const deleteTodo: any;
  const patchTodo: any;
  const uploadFile: any;
  const getUploadUrl: any;
  export {
    createTodo,
    getTodos,
    deleteTodo,
    patchTodo,
    uploadFile,
    getUploadUrl,
  };
}
