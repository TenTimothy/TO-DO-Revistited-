import React, { useState } from 'react';

const AddTodo = ({ writeContract }) => {
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await writeContract.createTodo(content);
            await result.wait();
            setContent('');
        
        } catch (error) {
            console.error("Error creating todo:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add new todo"
            />
            <button type="submit">Add</button>
        </form>
    );
};

export default AddTodo;
