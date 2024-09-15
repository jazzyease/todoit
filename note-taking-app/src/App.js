import React, { useState, useEffect } from 'react';
import { CheckSquare, PlusCircle, ArrowLeftRight, Moon, Sun } from 'lucide-react';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const storedCompletedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    setTasks(storedTasks);
    setCompletedTasks(storedCompletedTasks);
    
    const storedDarkMode = JSON.parse(localStorage.getItem('darkMode')) || false;
    setDarkMode(storedDarkMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [tasks, completedTasks, darkMode]);

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), text: newTask }]);
      setNewTask('');
    }
  };

  const toggleTask = (id, isCompleted) => {
    if (isCompleted) {
      const task = completedTasks.find(t => t.id === id);
      setCompletedTasks(completedTasks.filter(t => t.id !== id));
      setTasks([...tasks, task]);
    } else {
      const task = tasks.find(t => t.id === id);
      setTasks(tasks.filter(t => t.id !== id));
      setCompletedTasks([...completedTasks, task]);
    }
  };

  const TaskList = ({ items, isCompleted }) => (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="py-2 px-4 text-left text-gray-700 dark:text-gray-300">#</th>
            <th className="py-2 px-4 text-left text-gray-700 dark:text-gray-300">Task</th>
            <th className="py-2 px-4 text-center text-gray-700 dark:text-gray-300">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((task, index) => (
            <tr key={task.id} className="border-b dark:border-gray-700">
              <td className="py-2 px-4 text-gray-800 dark:text-gray-300">{index + 1}</td>
              <td className="py-2 px-4 text-gray-800 dark:text-gray-300">{task.text}</td>
              <td className="py-2 px-4 text-center">
                <button
                  onClick={() => toggleTask(task.id, isCompleted)}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <CheckSquare className={isCompleted ? "text-green-500" : "text-gray-400 dark:text-gray-600"} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={`min-h-screen py-6 flex flex-col justify-center sm:py-12 ${darkMode ? 'dark' : ''}`}>
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white dark:bg-gray-800 shadow-lg sm:rounded-3xl sm:p-20 transition-colors duration-300">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Note-Taking App</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {darkMode ? <Sun className="text-yellow-500" /> : <Moon className="text-gray-500" />}
            </button>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Add tasks, mark them as complete, and toggle between active and completed tasks.
          </p>

          <form onSubmit={addTask} className="mb-4">
            <div className="flex items-center border-b border-teal-500 py-2">
              <input
                className="appearance-none bg-transparent border-none w-full text-gray-700 dark:text-gray-300 mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="text"
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
              <button
                className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                type="submit"
              >
                <PlusCircle size={24} />
              </button>
            </div>
          </form>

          <div className="mb-4">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            >
              <ArrowLeftRight className="mr-2" />
              <span>{showCompleted ? "Show Active Tasks" : "Show Completed Tasks"}</span>
            </button>
          </div>

          <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
            {showCompleted ? "Completed Tasks" : "Active Tasks"}
          </h2>

          {showCompleted ? (
            <TaskList items={completedTasks} isCompleted={true} />
          ) : (
            <TaskList items={tasks} isCompleted={false} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;