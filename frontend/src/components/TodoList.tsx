import { useEffect, useState } from "react";
import api from "../services/api";
import TaskForm from "./TaskForm";
import TaskCard, { Task } from "./TaskCard";

interface User {
  id: string;
  email: string;
}

interface TodoListProps {
  user: User | null;
  onStatsChange?: (stats: {
    total: number;
    completed: number;
    pending: number;
  }) => void;

  onStreakChange?: (streak: number) => void;
}

export default function TodoList({
  user,
  onStatsChange,
  onStreakChange,
}: TodoListProps) {

  /* ---------------- STATES ---------------- */

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState< "Low" | "Medium" | "High" >("Medium");
  const [deadline, setDeadline] = useState<Date | null>(null);

  /* ---------------- FETCH ---------------- */

  const fetchTasks = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await api.get("/tasks");
      setTasks(response.data);
    }

    catch (err: any) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Unable to fetch tasks."
      );
    }

    finally {
      setLoading(false);
    }
  };

  /* ---------------- LOAD ---------------- */

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  /* ---------------- AUTO REFRESH ---------------- */

  useEffect(() => {
    const interval =
      setInterval(() => {
        fetchTasks();
      }, 60000);
    return () =>
      clearInterval(interval);
  }, []);

  /* ---------------- COUNTS ---------------- */

  const completedTasks =
    tasks.filter(
      task => task.completed
    ).length;

  const pendingTasks =
    tasks.length -
    completedTasks;

useEffect(() => {
  onStatsChange?.({
    total: tasks.length,
    completed: completedTasks,
    pending: pendingTasks,
  });
}, [
  tasks,
  completedTasks,
  pendingTasks,
  onStatsChange,
]);

useEffect(() => {
  const calculateStreak = () => {
    const completed = tasks.filter(task => task.completed);

    if (completed.length === 0) {
      onStreakChange?.(0);
      return;
    }
    const uniqueDays = new Set(

      completed.map(task =>
        new Date(task.updatedAt)
          .toDateString()
      )
    );
    onStreakChange?.(
      uniqueDays.size
    );
  };
  calculateStreak();
}, [tasks, onStreakChange]);

      /* ---------------- ADD TASK ---------------- */

  const addTask = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      setError("");
      const expiresAt =
        deadline
          ? deadline.toISOString()
          : null;

      await api.post("/tasks", {
        content: newTask,
        priority,
        expiresAt,
      });

      setNewTask("");
      setPriority("Medium");
      setDeadline(null);
      fetchTasks();
    }

    catch (err: any) {

      console.error(err);

      setError(
        err.response?.data?.message ||
        "Failed to add task."
      );
    }
  };

  /* ---------------- DELETE TASK ---------------- */

  const deleteTask = async (
    id: string
  ) => {

    const confirmDelete =
      window.confirm(
        "Delete this task?"
      );

    if (!confirmDelete) return;

    try {
      await api.delete(
        `/tasks/${id}`
      );
      fetchTasks();
    }

    catch (err: any) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Unable to delete task."
      );
    }
  };

  /* ---------------- COMPLETE TASK ---------------- */

  const toggleComplete = async (
    task: Task
  ) => {
    try {
      await api.put(
        `/tasks/${task._id}`,
        {
          completed:
            !task.completed,
        }
      );
      fetchTasks();
    }

    catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Unable to update task."
      );
    }
  };

  /* ---------------- SAVE EDIT ---------------- */

  const saveEdit = async (
    id: string,
    content: string,
    priority: "Low" | "Medium" | "High",
    expiresAt: string | null
  ) => {
    try {
      await api.put(
        `/tasks/${id}`,
        {
          content,
          priority,
          expiresAt,
        }
      );
      fetchTasks();
    }

    catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Unable to save changes."
      );
    }
  };

  /* ---------------- SORT TASKS ---------------- */

  const sortedTasks =
    [...tasks].sort((a, b) => {
      if (
        a.completed !==
        b.completed
      ) {
        return Number(a.completed) - Number(b.completed);
      }
      if (
        a.priority ===
        b.priority
      ) {
        return 0;
      }

      const order = {
        High: 3,
        Medium: 2,
        Low: 1,
      };

      return (
        order[b.priority] -
        order[a.priority]
      );
    });
      return (

    <div className="max-w-7xl mx-auto p-4">

      {/* ================= HEADER ================= */}

      <div className="mb-4">
        <p className="text-gray-500">
          Organize, prioritize and complete your daily tasks.
        </p>
      </div>

      {/* ================= STATISTICS ================= */}

      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl shadow p-6 border">
          <p className="text-gray-500">
            Total Tasks
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {tasks.length}
          </h2>
        </div>

        <div className="bg-yellow-50 rounded-2xl shadow p-6 border border-yellow-200">
          <p className="text-yellow-700">
            Pending
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {pendingTasks}
          </h2>
        </div>

        <div className="bg-green-50 rounded-2xl shadow p-6 border border-green-200">
          <p className="text-green-700">
            Completed
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {completedTasks}
          </h2>
        </div>
      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="mb-6 rounded-xl bg-red-100 border border-red-300 text-red-700 p-4">
          {error}
        </div>
      )}

      {/* ================= TASK FORM ================= */}

      <div className="mb-8">
        <TaskForm
          newTask={newTask}
          setNewTask={setNewTask}
          priority={priority}
          setPriority={setPriority}
          deadline={deadline}
          setDeadline={setDeadline}
          addTask={addTask}
        />
      </div>

      {/* ================= LOADING ================= */}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-blue-600"></div>
        </div>

      ) : sortedTasks.length === 0 ? (
        <div className="bg-white rounded-2xl shadow border p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-700">
            No Tasks Yet
          </h2>

          <p className="text-gray-500 mt-3">
            Create your first task to start being productive.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {sortedTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              toggleComplete={toggleComplete}
              deleteTask={deleteTask}
              saveEdit={saveEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}