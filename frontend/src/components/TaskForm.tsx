import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  Plus,
  CalendarDays,
  Clock,
  Flag,
  Calendar,
  X,
} from "lucide-react";

interface TaskFormProps {
  newTask: string;
  setNewTask: React.Dispatch<React.SetStateAction<string>>;
  priority: "Low" | "Medium" | "High";
  setPriority: React.Dispatch<
    React.SetStateAction<"Low" | "Medium" | "High">
  >;
  deadline: Date | null;
  setDeadline: React.Dispatch<
    React.SetStateAction<Date | null>
  >;
  addTask: (e: React.FormEvent) => void;
}

export default function TaskForm({
  newTask,
  setNewTask,

  priority,
  setPriority,

  deadline,
  setDeadline,
  addTask,
}: TaskFormProps) {

  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("18:00");

  /* ---------------- FORMAT DEADLINE ---------------- */

  const formatDeadline = () => {
    if (!deadline) return "Select Deadline";
    return deadline.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ---------------- SAVE DEADLINE ---------------- */

  const saveDeadline = () => {
    if (!selectedDate) return;
    const [hour, minute] = selectedTime.split(":");

    const value = new Date(selectedDate);
    value.setHours(Number(hour));
    value.setMinutes(Number(minute));
    value.setSeconds(0);
    setDeadline(value);
    setShowDeadlinePicker(false);
  };

  /* ---------------- CLEAR DEADLINE ---------------- */

  const clearDeadline = () => {
    setDeadline(null);
    setSelectedDate(undefined);
    setSelectedTime("18:00");
    setShowDeadlinePicker(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border p-6">

      {/* Header */}

      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Add New Task
        </h2>

        <p className="text-gray-500 mt-1">
          Stay focused. Finish tasks before the deadline.
        </p>
      </div>

      <form
        onSubmit={addTask}
        className="space-y-6"
      >

        {/* Task */}

        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Task
          </label>

          <input
            type="text"
            value={newTask}
            onChange={(e)=>
              setNewTask(e.target.value)
            }

            placeholder="What do you need to do?"
            className="
            w-full
            rounded-xl
            border
            border-gray-300
            px-4
            py-3
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-200
            "
            required
          />
        </div>

        {/* Priority */}

        <div>
          <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
            <Flag size={18}/>
            Priority
          </label>

          <select
            value={priority}
            onChange={(e)=>
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
            transition
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
          <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
            <Calendar size={18}/>
            Deadline
          </label>

          <button
            type="button"
            onClick={()=>
              setShowDeadlinePicker(
                !showDeadlinePicker
              )
            }
            className="
            w-full
            rounded-xl
            border
            border-gray-300
            px-4
            py-3
            flex
            justify-between
            items-center
            hover:border-blue-500
            transition
            "
          >
            <span
              className={
                deadline
                  ? "text-gray-700"
                  : "text-gray-400"
              }
            >
              📅 {formatDeadline()}
            </span>
            <CalendarDays size={18}/>
          </button>

          {showDeadlinePicker && (
            <div className="
            mt-5
            rounded-2xl
            border
            bg-white
            shadow-lg
            p-5
            space-y-5
            ">

                              {/* Calendar */}

              <div>
                <h3 className="font-semibold text-gray-700 mb-3">
                  Choose Date
                </h3>

                <div className="flex justify-center rounded-xl border bg-gray-50 p-4">
                 <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    showOutsideDays
                  />
                </div>
              </div>

              {/* Time */}

              <div>
                <label className="flex items-center gap-2 mb-2 font-semibold text-gray-700">
                  <Clock size={18} />
                  Choose Time
                </label>

                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) =>
                    setSelectedTime(e.target.value)
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

              {/* Preview */}

              {selectedDate && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <h4 className="font-semibold text-blue-700">
                    Deadline Preview
                  </h4>
                  <p className="mt-2 text-gray-700">
                    📅{" "}
                    {new Date(
                      selectedDate
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    {" • "}
                    {selectedTime}
                  </p>
                </div>
              )}

              {/* Buttons */}

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={saveDeadline}
                  className="
                  flex-1
                  rounded-xl
                  bg-blue-600
                  py-3
                  text-white
                  font-medium
                  hover:bg-blue-700
                  transition
                  "
                >
                  Save Deadline
                </button>

                <button
                  type="button"
                  onClick={clearDeadline}
                  className="
                  rounded-xl
                  bg-red-500
                  px-5
                  text-white
                  hover:bg-red-600
                  transition
                  "
                >
                  <X size={18} />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowDeadlinePicker(false)
                  }
                  className="
                  rounded-xl
                  border
                  border-gray-300
                  px-5
                  hover:bg-gray-100
                  transition
                  "
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

                {/* Productivity Tip */}

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <h3 className="font-semibold text-blue-700">
            💡 Productivity Tip
          </h3>

          <p className="mt-2 text-sm text-blue-600 leading-6">
            Assigning a deadline keeps you focused.
            Tasks that pass their deadline will be
            automatically removed from your pending list.
          </p>
        </div>

        {/* Submit */}

        <button
          type="submit"
          className="
          w-full
          rounded-xl
          bg-blue-600
          py-4
          text-white
          font-semibold
          flex
          items-center
          justify-center
          gap-3
          hover:bg-blue-700
          transition-all
          duration-300
          hover:scale-[1.01]
          active:scale-[0.99]
          shadow-md
          "
        >
          <Plus size={20} />
          Add Task
        </button>
      </form>
    </div>
  );
}