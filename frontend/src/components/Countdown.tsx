import { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface CountdownProps {
  deadline: string | Date | null;
}

export default function Countdown({
  deadline,
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [expired, setExpired] = useState(false);

  const calculateTime = () => {
    if (!deadline) {
      setExpired(false);
      setTimeLeft("No Deadline");
      return;
    }

    const now = new Date().getTime();

    const target =
      new Date(deadline).getTime();

    const difference = target - now;

    if (difference <= 0) {
      setExpired(true);
      setTimeLeft("Expired");
      return;
    }

    setExpired(false);

    const days = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
      (difference %
        (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    );

    const minutes = Math.floor(
      (difference %
        (1000 * 60 * 60)) /
        (1000 * 60)
    );

    const seconds = Math.floor(
      (difference %
        (1000 * 60)) /
        1000
    );

    let text = "";
    if (days > 0)
    text += `${days}d `;
    text += `${hours}h ${minutes}m ${seconds}s`;
    setTimeLeft(text);
  };

  useEffect(() => {
    calculateTime();

    const interval = setInterval(
      calculateTime,
      1000
    );

    return () => clearInterval(interval);
  }, [deadline]);

  if (expired) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-red-100 border border-red-300 px-3 py-2">
        <AlertTriangle
          size={18}
          className="text-red-600"
        />
        <span className="font-medium text-red-700">
          Expired
        </span>
      </div>
    );
  }

  if (!deadline) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-gray-100 border px-3 py-2">
        <Clock
          size={18}
          className="text-gray-500"
        />
        <span className="text-gray-600">
          No Deadline
        </span>
      </div>
    );
  }

  const totalHours =
    Math.floor(
      (new Date(deadline).getTime() -
        Date.now()) /
        (1000 * 60 * 60)
    );

  let color = "";
  if (totalHours < 1)
    color = "bg-red-100 border-red-300 text-red-700";
  else if (totalHours < 24)
    color = "bg-yellow-100 border-yellow-300 text-yellow-700";
  else
    color = "bg-green-100 border-green-300 text-green-700";

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${color}`}
    >
      <Clock size={18} />
      <span className="font-medium">
        {timeLeft}
      </span>
    </div>
  );
}