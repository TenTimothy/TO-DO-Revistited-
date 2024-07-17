import React, { useEffect, useState } from 'react';

const TodoList = ({ readContract }) => {
    const [todos, setTodos] = useState([]);

    const fetchTodos = async () => {
        try {
            const indexes = await readContract.getIndexList();
            const temp = [];
            for (const i of indexes) {
                const todo = await readContract.todos(i);
                temp.push(todo);
            }
            setTodos(temp);
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, [readContract]);

    return (
        <div>
            <ul>
                {todos.map((todo, index) => (
                    <li key={index}>
                        {todo.text}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
