import { useState } from "react";
import {
  Check,
  Trash2,
  Pencil,
  Save,
  X,
  Flag,
  CalendarDays,
} from "lucide-react";
import Countdown from "./Countdown";

export interface Task {
  _id: string;
  content: string;
  completed: boolean;
  priority: "Low" | "Medium" | "High";
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TaskCardProps {
  task: Task;

  toggleComplete: (
    task: Task
  ) => void;

  deleteTask: (
    id: string
  ) => void;

  saveEdit: (
    id: string,
    content: string,
    priority: "Low" | "Medium" | "High",
    expiresAt: string | null
  ) => void;
}

export default function TaskCard({
  task,
  toggleComplete,
  deleteTask,
  saveEdit,
}: TaskCardProps) {

  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(task.content);
  const [priority, setPriority] =useState<"Low" | "Medium" | "High">(task.priority);
  const [deadline, setDeadline] =
    useState(
      task.expiresAt
        ? task.expiresAt.slice(0,16)
        : ""
    );

  const getPriorityStyle = () => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border-red-300";
      case "Medium":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "Low":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (

    <div
      className={`
      rounded-2xl
      border
      bg-white
      shadow-sm
      p-5
      transition-all
      hover:shadow-md
      ${
        task.completed
          ? "opacity-70"
          : ""
      }
      `}
    >

      {/* Header */}

      <div className="flex justify-between items-start gap-5">
        <div className="flex-1">
          {
            editing
            ?
            <input
              value={content}
              onChange={(e)=>
                setContent(
                  e.target.value
                )
              }
             className="
              w-full
              rounded-lg
              border
              px-3
              py-2
              "
            />
            :
            <h3
              className={`
              text-xl
              font-semibold
              ${
                task.completed
                ?
                "line-through text-gray-500"
                :
                "text-gray-800"
              }
              `}
            > {task.content} </h3>
          }

          <div className="mt-4 flex flex-wrap gap-3">
            <span
              className={`
              px-3
              py-1
              rounded-full
              border
              text-sm
              font-medium
              ${getPriorityStyle()}
              `}
            >
              <Flag
                size={14}
                className="inline mr-1"
              />
              {priority}
            </span>

            <span
              className="
              flex
              items-center
              gap-2
              text-gray-500
              text-sm
              "
            >
              <CalendarDays size={16}/>
              {
                task.expiresAt
                ?
                new Date(
                  task.expiresAt
                ).toLocaleString()
                :
                "No Deadline"
              }
            </span>
          </div>

          <div className="mt-5">
            <Countdown
              deadline={
                task.expiresAt
              }
            />
          </div>
        </div>

        <button
          onClick={()=>
            toggleComplete(task)
          }

          className={`
          h-11
          w-11
          rounded-full
          flex
          items-center
          justify-center
          transition

          ${
            task.completed
            ?
            "bg-green-600 text-white"
            :
            "border hover:bg-green-50"
          }
          `}
        >
          <Check size={20}/>
        </button>
      </div>
            {/* ================= EDIT SECTION ================= */}

      {editing && (
        <div className="mt-6 border-t pt-5 space-y-5">
          {/* Edit Task */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Task
            </label>

            <input
              type="text"
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              className="
              w-full
              rounded-xl
              border
              border-gray-300
              px-4
              py-3
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-200
              "
            />
          </div>

          {/* Priority */}

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Priority
            </label>

            <select
              value={priority}
              onChange={(e) =>
                setPriority(
                  e.target.value as
                    | "Low"
                    | "Medium"
                    | "High"
                )
              }
              className="
              w-full
              rounded-xl
              border
              border-gray-300
              px-4
              py-3
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-200
              "
            >
              <option value="Low">
                🟢 Low
              </option>
              <option value="Medium">
                🟠 Medium
              </option>
              <option value="High">
                🔴 High
              </option>
            </select>
          </div>

          {/* Deadline */}

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Deadline
            </label>

            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) =>
                setDeadline(
                  e.target.value
                )
              }
              className="
              w-full
              rounded-xl
              border
              border-gray-300
              px-4
              py-3
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-200
              "
            />

            <p className="mt-2 text-xs text-gray-500">
              Leave empty if you don't want this task to expire.
            </p>
          </div>

                    {/* ================= ACTION BUTTONS ================= */}

          <div className="flex flex-wrap gap-3 pt-2">
            {/* Save */}
            <button
              type="button"
              onClick={() => {
                saveEdit(
                  task._id,
                  content,
                  priority,
                  deadline || null
                );
                setEditing(false);
              }}
              className="
              flex-1
              bg-green-600
              hover:bg-green-700
              text-white
              rounded-xl
              py-3
              flex
              items-center
              justify-center
              gap-2
              transition
              "
            >
              <Save size={18} />
              Save
            </button>
            {/* Cancel */}

            <button
              type="button"
              onClick={() => {
                setContent(task.content);
                setPriority(task.priority);
                setDeadline(
                  task.expiresAt
                    ? task.expiresAt.slice(0, 16)
                    : ""
                );
                setEditing(false);
              }}
              className="
              flex-1
              bg-gray-200
              hover:bg-gray-300
              rounded-xl
              py-3
              flex
              items-center
              justify-center
              gap-2
              transition
              "
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ================= NORMAL BUTTONS ================= */}

      {!editing && (
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              setEditing(true)
            }
            className="
            flex-1
            bg-yellow-500
            hover:bg-yellow-600
            text-white
            rounded-xl
            py-3
            flex
            items-center
            justify-center
            gap-2
            transition
            "
          >
            <Pencil size={18} />
            Edit
          </button>

          <button
            type="button"
            onClick={() =>
              deleteTask(task._id)
            }
            className="
            flex-1
            bg-red-600
            hover:bg-red-700
            text-white
            rounded-xl
            py-3
            flex
            items-center
            justify-center
            gap-2
            transition
            "
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      )}

            {/* ================= STATUS ================= */}

      <div className="mt-5 flex flex-wrap justify-between items-center gap-3 border-t pt-4">
        <div className="text-sm text-gray-500">
          Created
          <div className="font-medium text-gray-700 mt-1">
            {new Date(task.createdAt).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        <div>
          {task.completed ? (
            <span
              className="
              inline-flex
              items-center
              rounded-full
              bg-green-100
              px-4
              py-2
              text-sm
              font-semibold
              text-green-700
              "
            >
              ✅ Completed
            </span>
          ) : (
            <span
              className="
              inline-flex
              items-center
              rounded-full
              bg-yellow-100
              px-4
              py-2
              text-sm
              font-semibold
              text-yellow-700
              "
            >
              ⏳ Pending
            </span>
          )}
        </div>
      </div>
    </div>
  );
}