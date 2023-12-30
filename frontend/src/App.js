import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    axios.get('https://wendor-m30o.onrender.com/todos').then((response) => setTodos(response.data));
  }, []);

  const addTodo = () => {
    axios.post('https://wendor-m30o.onrender.com/todos', { title: newTodo, completed: false }).then((response) => {
      setTodos([...todos, response.data]);
      setNewTodo('');
    });
  };

  const deleteTodo = (id) => {
    axios.delete(`https://wendor-m30o.onrender.com/todos/${id}`).then(() => setTodos(todos.filter((t) => t.id !== id)));
  };

  const toggleTodo = (id) => {
    axios
      .put(`https://wendor-m30o.onrender.com/todos/${id}`, { completed: !todos.find((t) => t.id === id).completed })
      .then((response) => {
        setTodos(
          todos.map((t) => (t.id === id ? { ...t, completed: response.data.completed } : t))
        );
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-left">
        <h1 className="text-3xl font-bold mb-4">Todo App</h1>
        <div className="flex items-center">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="border p-2 m-2"
          />
          <button onClick={addTodo} className="bg-blue-500 text-white px-4 py-2 rounded ml-auto">
            Add Todo
          </button>
        </div>
        {todos.map((todo) => (
          <div key={todo.id} className="mt-2 flex items-center justify-between">
            <span
              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              className="whitespace-normal"
            >
              {todo.title}
            </span>
            <div>
              <button
                onClick={() => toggleTodo(todo.id)}
                className="bg-green-500 text-white px-2 ml-2 rounded"
              >
                Toggle
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="bg-red-500 text-white px-2 ml-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
