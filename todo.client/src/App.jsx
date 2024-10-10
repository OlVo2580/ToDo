import { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingText, setEditingText] = useState('');
    const [draggedTaskId, setDraggedTaskId] = useState(null);

    useEffect(() => {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
            console.log("savedTasks parsed:", JSON.parse(savedTasks));
        }
    }, []);

    useEffect(() => {
        if (tasks.length > 0) {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }, [tasks]);

    const addTask = (task) => {
        if (task.trim()) {
            setTasks([...tasks, { id: Date.now(), text: task }]);
        }
    };

    const removeTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const startEditing = (taskId, text) => {
        setEditingTaskId(taskId);
        setEditingText(text);
    };

    const saveTask = (taskId) => {
        setTasks(tasks.map(task => 
            task.id === taskId ? { ...task, text: editingText } : task
        ));
        setEditingTaskId(null);
        setEditingText('');
    };

    const handleAddTask = (event) => {
        event.preventDefault();
        const form = event.target;
        const input = form.elements['task'];
        addTask(input.value);
        input.value = '';
    };
    const handleDragStart = (taskId) => {
        setDraggedTaskId(taskId);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (taskId) => {
        const draggedTaskIndex = tasks.findIndex(task => task.id === draggedTaskId);
        const targetTaskIndex = tasks.findIndex(task => task.id === taskId);
        
        const updatedTasks = [...tasks];
        const [draggedTask] = updatedTasks.splice(draggedTaskIndex, 1);
        updatedTasks.splice(targetTaskIndex, 0, draggedTask);
        
        setTasks(updatedTasks);
        setDraggedTaskId(null);
    };
    return (
        <div>
            <h1>To-Do List</h1>
            <form onSubmit={handleAddTask}>
                <input type="text" name="task" placeholder="Enter new task" />
                <button type="submit">Add Task</button>
            </form>
            <ul>
                {tasks.map(task => (
                    <li 
                        key={task.id}
                        draggable 
                        onDragStart={() => handleDragStart(task.id)} 
                        onDragOver={handleDragOver} 
                        onDrop={() => handleDrop(task.id)}
                    >
                        {editingTaskId === task.id ? (
                            <>
                                <input 
                                    type="text" 
                                    value={editingText} 
                                    onChange={(e) => setEditingText(e.target.value)} 
                                />
                                <button onClick={() => saveTask(task.id)}>Save</button>
                            </>
                        ) : (
                            <>
                                {task.text} 
                                <button onClick={() => startEditing(task.id, task.text)}>Edit</button>
                                <button onClick={() => removeTask(task.id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
