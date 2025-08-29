import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const backendUrl = "http://localhost:8081/api";
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get(`${backendUrl}/todos`);
        setTodos(res.data || []);
      } catch (err) {
        console.error("Error fetching todos:", err);
        setTodos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      const res = await axios.post(`${backendUrl}/add`, {
        title,
        description,
      });

      const newTodo = res.data;
      setTodos((prevTodos) => [newTodo, ...prevTodos]);
      setTitle("");
      setDescription("");
      setIsFormVisible(false);
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${backendUrl}/delete/${id}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  return (
    <div className="h-screen bg-black flex flex-col p-4">
      <div className="w-full h-full bg-white shadow-xl rounded-2xl p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold text-black">Todo</h1>
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        {isFormVisible && (
          <form
            onSubmit={handleAddTodo}
            className="flex flex-col gap-3 mb-6 bg-gray-50 p-4 rounded-xl shadow-sm"
          >
            <input
              type="text"
              placeholder="Todo title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none"
            />
            <textarea
              placeholder="Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none resize-none"
            />
            <button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white font-medium py-2 rounded-lg transition"
            >
              Add Todo
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : todos.length === 0 ? (
          <p className="text-center text-gray-500">No todos</p>
        ) : (
          <div className="space-y-4">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="p-4 rounded-xl shadow-md border bg-white border-gray-200 flex justify-between items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold text-black">
                    {todo.title}
                  </h2>
                  <p className="text-gray-600 text-sm">{todo.description}</p>
                </div>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
