const TaskListView = ({ tasks, wallet, contract, refreshTasks, refreshWallet }) => {
  const handleToggleTask = async (id) => {
    try {
      const tx = await contract.toggleTodo(id);
      await tx.wait();
      await refreshTasks();
      await refreshWallet(wallet.addresses);
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const tx = await contract.removeTodo(id);
      await tx.wait();
      await refreshTasks();
      await refreshWallet(wallet.addresses);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <ul className="task-list">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <li key={task.id} className="task-item">
            <span className={`task-text ${task.completed ? 'completed' : ''}`}>
              {task.text}
            </span>
            <button onClick={() => handleToggleTask(task.id)} className="toggle-task-button">
              {task.completed ? 'Undo' : 'Complete'}
            </button>
            <button onClick={() => handleDeleteTask(task.id)} className="delete-task-button">
              Delete
            </button>
          </li>
        ))
      ) : (
        <li>No tasks available</li>
      )}
    </ul>
  );
};

export default TaskListView;
