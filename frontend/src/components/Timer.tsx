import React, { useState, useEffect, useRef } from 'react';

import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';

const WORK_TIME = 25 * 60;

const SHORT_BREAK_TIME = 5 * 60;

const LONG_BREAK_TIME = 15 * 60;

const MODES = {

  POMODORO: 'Pomodoro',

  SHORT_BREAK: 'Short Break',

  LONG_BREAK: 'Long Break',

};

const getTimeForMode = (mode) => {

  switch (mode) {

    case MODES.SHORT_BREAK:

      return SHORT_BREAK_TIME;

    case MODES.LONG_BREAK:

      return LONG_BREAK_TIME;

    default:

      return WORK_TIME;

  }

};

const getExplanationForMode = (mode) => {

  switch (mode) {

    case MODES.POMODORO:

      return 'A Pomodoro timer is a time management tool that uses intervals of focused work (called "pomodoros") to help you complete tasks and avoid burnout. The standard method involves working on a single task for 25 minutes';

    case MODES.SHORT_BREAK:

      return 'A 5-minute break to help you stay energized and avoid burnout.';

    case MODES.LONG_BREAK:

      return 'A longer 15-minute break to recharge after four consecutive work sessions.';

    default:

      return '';

  }

};

const CircularProgress: React.FC<{ percentage: number; children?: React.ReactNode }> = ({ percentage, children }) => {

    const gradient = `conic-gradient(#3b82f6 ${percentage}%, #e5e7eb ${percentage}%)`;

    return (

      <div

        className="relative w-36 h-36 rounded-full flex items-center justify-center"

        style={{ background: gradient }}

      >

        <div className="absolute w-[calc(100%-16px)] h-[calc(100%-16px)] bg-white rounded-full flex items-center justify-center">

          {children}

        </div>

      </div>

    );

  };

interface TimerProps {
  onModeChange?: (mode: string) => void;
}

export default function Timer({
  onModeChange,
}: TimerProps)  {

  const [mode, setMode] = useState(MODES.POMODORO);
  useEffect(() => {

  onModeChange?.(mode);

}, [mode, onModeChange]);

  const [timeLeft, setTimeLeft] = useState(getTimeForMode(MODES.POMODORO));

  const [isRunning, setIsRunning] = useState(false);

  const [showPopup, setShowPopup] = useState(false);

  const [popupMessage, setPopupMessage] = useState('');

  const [explanation, setExplanation] = useState(getExplanationForMode(MODES.POMODORO));

  const [pulse, setPulse] = useState(false);

  const intervalRef = useRef(null);
  const alarmRef = useRef<HTMLAudioElement | null>(null);

  const triggerPulse = () => {

    setPulse(true);

    setTimeout(() => setPulse(false), 500);

  };

  const setTimer = (newMode) => {
    if (alarmRef.current) {
    alarmRef.current.pause();
    alarmRef.current.currentTime = 0;
    alarmRef.current.loop = false;
  }
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(getTimeForMode(newMode));
    setExplanation(getExplanationForMode(newMode));
  };

  const handleTimerEnd = () => {

  // 🔊 Play alarm continuously
  if (alarmRef.current) {
    alarmRef.current.currentTime = 0;
    alarmRef.current.play().catch(console.error);
  }

  triggerPulse();

  const nextMode =
    mode === MODES.POMODORO
      ? MODES.SHORT_BREAK
      : MODES.POMODORO;

  setPopupMessage(
    mode === MODES.POMODORO
      ? "Time for a short break!"
      : "Back to work!"
  );

  setShowPopup(true);

  setMode(nextMode);

  setTimeLeft(getTimeForMode(nextMode));

  setExplanation(getExplanationForMode(nextMode));
};

  useEffect(() => {
  alarmRef.current = new Audio("/sounds/timer-alarm.mp3");

  alarmRef.current.preload = "auto";

  alarmRef.current.volume = 0.8;
}, []);

  useEffect(() => {

    if (isRunning) {

      intervalRef.current = window.setInterval(() => {

        setTimeLeft((prevTime) => Math.max(prevTime-1, 0));

      }, 1000);

    } else if (intervalRef.current) {

      clearInterval(intervalRef.current);

    }

    return () => {

      if (intervalRef.current) {

        clearInterval(intervalRef.current);

      }

    };

  }, [isRunning, mode]);

  useEffect(() => {
    if(timeLeft === 0 && isRunning) {
      setIsRunning(false);
      handleTimerEnd();
    }
  }, [timeLeft, isRunning])

  const handleStartPause = () => {

    if (!isRunning) {

      triggerPulse();

    }

    setIsRunning(!isRunning);

  };

  const handleReset = () => {
    if (alarmRef.current) {
    alarmRef.current.pause();
    alarmRef.current.currentTime = 0;
    alarmRef.current.loop = false;
  }
    setIsRunning(false);
    setTimeLeft(getTimeForMode(mode));
  };

  const handleClosePopup = () => {

  // 🔇 Stop alarm
  if (alarmRef.current) {
    alarmRef.current.pause();
    alarmRef.current.currentTime = 0;
    alarmRef.current.loop = false;
  }

  setShowPopup(false);
  setTimeLeft(getTimeForMode(mode));
  // Automatically start next timer
  setIsRunning(true);
};

  const minutes = Math.floor(timeLeft / 60);

  const seconds = timeLeft % 60;

  const totalTime = getTimeForMode(mode);

  const percentage = (timeLeft / totalTime) * 100;

  const ModeButton = ({ label, currentMode, onClick }) => (

    <button

      onClick={onClick}

      className={`

        flex-1 px-2 py-1 rounded-md font-semibold text-xs transition-colors

        ${

          currentMode === label

            ? 'bg-blue-500 text-white shadow-md'

            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'

        }

      `}

    >

      {label}

    </button>

  );

  return (

    <div className="bg-white rounded-lg shadow-md p-3 w-full">

      {showPopup && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

          <div className="bg-white p-8 rounded-lg shadow-xl transform transition-all duration-300 scale-100">

            <div className="flex items-center justify-center mb-6">

              {mode === MODES.SHORT_BREAK || mode === MODES.LONG_BREAK ? (

                <Coffee className="w-16 h-16 text-blue-500" />

              ) : (

                <Brain className="w-16 h-16 text-green-500" />

              )}

            </div>

            <p className="text-2xl font-bold text-gray-800 mb-6 text-center">

              {popupMessage}

            </p>

            <button

              onClick={handleClosePopup}

              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out transform hover:scale-105"

            >

              Start Next

            </button>

          </div>

        </div>

      )}

      <div className="flex items-center justify-center mb-3 text-gray-800">

        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">

            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />

        </svg>

        <h2 className="text-lg font-bold">Pomodoro Timer</h2>

      </div>

      <div className="text-center text-sm text-gray-600 mt-0 mb-3 font-bold mx-4 h-13 p-2">

        <p>{explanation}</p>

      </div>

      <div className="flex justify-between bg-gray-100 p-1 rounded-lg mb-4 shadow-inner">

        <ModeButton

          label={MODES.POMODORO}

          currentMode={mode}

          onClick={() => setTimer(MODES.POMODORO)}

        />

        <ModeButton

          label={MODES.SHORT_BREAK}

          currentMode={mode}

          onClick={() => setTimer(MODES.SHORT_BREAK)}

        />

        <ModeButton

          label={MODES.LONG_BREAK}

          currentMode={mode}

          onClick={() => setTimer(MODES.LONG_BREAK)}

        />

      </div>

      <div className="flex justify-center items-center mb-4">

        <CircularProgress percentage={percentage}>

          <div

            className={`text-4xl font-extrabold text-gray-900 transition-transform duration-500 ${

              pulse ? 'scale-110' : ''

            }`}>

            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}

          </div>

        </CircularProgress>

      </div>

      <div className="flex gap-2 justify-center">

        <button

          onClick={handleStartPause}

          className={`

            flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-sm shadow-lg

            ${

              isRunning

                ? 'bg-red-500 hover:bg-red-600 text-white'

                : 'bg-blue-600 hover:bg-blue-700 text-white'

            }

            transition-all duration-200 transform hover:scale-90 active:scale-100 flex-grow

          `}

          aria-label={isRunning ? 'Pause timer' : 'Start timer'}

        >

          {isRunning ? <Pause size={18} /> : <Play size={18} />}

          <span>{isRunning ? 'Pause' : 'Start'}</span>

        </button>

        <button

          onClick={handleReset}

          className="flex items-center justify-center w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors shadow-md"

          title="Reset Timer"

          aria-label="Reset timer"

        >

          <RotateCcw size={18} />

        </button>

      </div>

    </div>

  );

}


