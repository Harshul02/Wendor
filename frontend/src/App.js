import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/todos').then((response) => setTodos(response.data));
  }, []);

  const addTodo = () => {
    axios.post('http://localhost:3001/todos', { title: newTodo, completed: false }).then((response) => {
      setTodos([...todos, response.data]);
      setNewTodo('');
    });
  };

  const deleteTodo = (id) => {
    axios.delete(`http://localhost:3001/todos/${id}`).then(() => setTodos(todos.filter((t) => t.id !== id)));
  };

  const toggleTodo = (id) => {
    axios
      .put(`http://localhost:3001/todos/${id}`, { completed: !todos.find((t) => t.id === id).completed })
      .then((response) => {
        setTodos(
          todos.map((t) => (t.id === id ? { ...t, completed: response.data.completed } : t))
        );
      });
  };

  return (
    <div>
      <h1>Todo App</h1>
      <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
      <button onClick={addTodo}>Add Todo</button>
      {todos.map((todo) => (
        <div key={todo.id}>
          <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.title}</span>
          <button onClick={() => toggleTodo(todo.id)}>Toggle</button>
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
