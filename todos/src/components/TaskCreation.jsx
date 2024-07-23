const CreateTodo = ({ input, setInput, wallet, contract, refreshTasks, refreshWallet }) => {
  const handleAddTask = async (event) => {
    event.preventDefault();
    try {
      const tx = await contract.createTodo(input);
      await tx.wait();
      setInput('');  
      await refreshTasks();  
      await refreshWallet(wallet.addresses);  
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  return (
    <form onSubmit={handleAddTask} className="create-task-form">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter new task"
        className="task-input"
      />
      <button type="submit" className="create-task-button">Add Task</button>
    </form>
  );
};

export default CreateTodo;
