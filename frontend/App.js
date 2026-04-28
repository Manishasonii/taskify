import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [tasks, setTasks] = useState([]);

  const API = "http://localhost:5000";

  // Fetch tasks
  const getTasks = async () => {
    const res = await axios.get(`${API}/tasks`);
    setTasks(res.data);
  };

  useEffect(() => {
    getTasks();
  }, []);

  // Add task
  const addTask = async () => {
    if (!text) return;
    await axios.post(`${API}/add`, { text });
    setText("");
    getTasks();
  };

  // Delete task
  const deleteTask = async (id) => {
    await axios.delete(`${API}/delete/${id}`);
    getTasks();
  };

  // Toggle complete
  const toggleComplete = async (task) => {
    await axios.put(`${API}/update/${task._id}`, {
      completed: !task.completed,
    });
    getTasks();
  };

  // Edit task
  const editTask = async (task) => {
    const newText = prompt("Edit task", task.text);
    if (!newText) return;

    await axios.put(`${API}/update/${task._id}`, {
      text: newText,
    });
    getTasks();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>To-Do App</h2>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter task"
      />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task)}
            />

            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.text}
            </span>

            <button onClick={() => editTask(task)}>Edit</button>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;