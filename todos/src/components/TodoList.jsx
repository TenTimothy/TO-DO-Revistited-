// src/components/TodoList.jsx
const TodoList = ({ todos, wallet, contract, refreshTodos, refreshWallet }) => {
    const handleToggleTodo = async (id) => {
      try {
        const tx = await contract.toggleTodo(id);
        await tx.wait();
        refreshTodos();
        refreshWallet(wallet.accounts);
      } catch (error) {
        console.error('Failed to toggle todo:', error);
      }
    };
  
    const handleDeleteTodo = async (id) => {
      try {
        const tx = await contract.removeTodo(id);
        await tx.wait();
        refreshTodos();
        refreshWallet(wallet.accounts);
      } catch (error) {
        console.error('Failed to delete todo:', error);
      }
    };
  
    return (
      <ul className="todo-list">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                {todo.text}
              </span>
              <button onClick={() => handleToggleTodo(todo.id)} className="toggle-todo-button">
                {todo.completed ? 'Undo' : 'Complete'}
              </button>
              <button onClick={() => handleDeleteTodo(todo.id)} className="delete-todo-button">
                Delete
              </button>
            </li>
          ))
        ) : (
          <li>No todos available</li>
        )}
      </ul>
    );
  };
  
  export default TodoList;
  