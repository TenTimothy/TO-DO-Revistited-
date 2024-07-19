// src/components/AddTodo.jsx
const AddTodo = ({ input, setInput, wallet, contract, refreshTodos, refreshWallet }) => {
    const handleAddTodo = async (event) => {
      event.preventDefault();
      try {
        const tx = await contract.createTodo(input);
        await tx.wait();
        refreshTodos();
        refreshWallet(wallet.accounts);
        setInput('');
      } catch (error) {
        console.error('Failed to add todo:', error);
      }
    };
  
    return (
      <form onSubmit={handleAddTodo} className="add-todo-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter new todo"
          className="todo-input"
        />
        <button type="submit" className="add-todo-button">Add Todo</button>
      </form>
    );
  };
  
  export default AddTodo;
  