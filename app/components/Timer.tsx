"use client";

import { useEffect, useRef, useState } from "react";
import "./Timer.css";
import SettingsModal from "./SettingsModal";

// Example sound files
const audioFile = "/sounds/alarm.mp3";
const song1 = "/sounds/sonny.mp3";
const song2 = "/sounds/Autumn Leaves.mp3";
const song3 = "/sounds/My Foolish Heart.mp3";
const song4 = "/sounds/Body & Soul.mp3";
const song5 = "/sounds/All The Things You Are.mp3";
const song6 = "/sounds/if i am with you.mp3";

// Array of songs
const songs = [song1, song2, song3, song4, song5, song6];

const Timer: React.FC = () => {
  // Store durations in seconds
  const [pomodoroTime, setPomodoroTime] = useState(1500); // 25 minutes
  const [shortBreakTime, setShortBreakTime] = useState(300); // 5 minutes
  const [longBreakTime, setLongBreakTime] = useState(900); // 15 minutes

  const [time, setTime] = useState(pomodoroTime);
  const [isRunning, setIsRunning] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [isWorkPhase, setIsWorkPhase] = useState(true);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [music, setMusic] = useState<HTMLAudioElement | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Mode state: "pomodoro", "shortBreak", or "longBreak"
  const [currentMode, setCurrentMode] = useState<
    "pomodoro" | "shortBreak" | "longBreak"
  >("pomodoro");

  // Use a ref to keep track of isRunning
  const isRunningRef = useRef(isRunning);
  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  // Handle mode change using current durations
  const handleModeChange = (mode: "pomodoro" | "shortBreak" | "longBreak") => {
    console.log("Changing mode to:", mode);
    setCurrentMode(mode);
    setIsRunning(false);
    music?.pause();
    setMusic(null);

    if (mode === "pomodoro") {
      setTime(pomodoroTime);
      setIsWorkPhase(true);
    } else if (mode === "shortBreak") {
      setTime(shortBreakTime);
      setIsWorkPhase(false);
    } else {
      setTime(longBreakTime);
      setIsWorkPhase(false);
    }
  };

  // Open Settings modal
  const openSettings = () => {
    setIsSettingsOpen(true);
  };

  // Helper: create a new Audio instance, attach event listener, and play.
  const createAndPlayMusic = (index: number) => {
    console.log("Creating and playing song index:", index, "Song:", songs[index]);
    if (music) {
      music.removeEventListener("ended", handleSongEnd);
      music.pause();
    }
    const newAudio = new Audio(songs[index]);
    newAudio.addEventListener("ended", handleSongEnd);
    setMusic(newAudio);
    newAudio.play();
  };

  // Timer logic: decrement time every second when running.
  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    if (isRunning) {
      timerInterval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 0) {
            console.log("Timer finished. Playing alarm.");
            const alarmAudio = new Audio(audioFile);
            alarmAudio.play();
            if (isWorkPhase) {
              setTime(shortBreakTime);
              setIsWorkPhase(false);
            } else {
              setTime(pomodoroTime);
              setIsWorkPhase(true);
              setCyclesCompleted((prev) => prev + 1);
            }
            return isWorkPhase ? shortBreakTime - 1 : pomodoroTime - 1;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [isRunning, isWorkPhase, pomodoroTime, shortBreakTime]);

  useEffect(() => {
    if (cyclesCompleted === 8) {
      setIsRunning(false);
    }
  }, [cyclesCompleted]);

  // When a song ends, if still running, play the next song.
  const handleSongEnd = () => {
    if (!isRunningRef.current) return;
    setCurrentSongIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % songs.length;
      console.log(
        "Song ended. Current song index:",
        prevIndex,
        "Next song index:",
        nextIndex,
        "Next song:",
        songs[nextIndex]
      );
      setTimeout(() => {
        createAndPlayMusic(nextIndex);
      }, 1500);
      return nextIndex;
    });
  };

  const toggleTimer = () => {
    if (!isRunning) {
      console.log(
        "Starting timer. Current song index:",
        currentSongIndex,
        "Song:",
        songs[currentSongIndex]
      );
      if (music && music.paused) {
        music.play();
      } else {
        createAndPlayMusic(currentSongIndex);
      }
      setIsRunning(true);
    } else {
      console.log("Pausing timer. Current song index:", currentSongIndex);
      music?.pause();
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    console.log("Resetting timer.");
    setTime(pomodoroTime);
    setIsRunning(false);
    setCyclesCompleted(0);
    setIsWorkPhase(true);
    setCurrentSongIndex(0);
    music?.pause();
    setMusic(null);
  };

  // Callback to update time durations from SettingsModal (times in minutes)
  const handleTimeChange = (
    newPomodoro: number,
    newShortBreak: number,
    newLongBreak: number
  ) => {
    console.log(
      "Updating timer durations:",
      "Pomodoro:",
      newPomodoro,
      "Short Break:",
      newShortBreak,
      "Long Break:",
      newLongBreak
    );
    setPomodoroTime(newPomodoro * 60);
    setShortBreakTime(newShortBreak * 60);
    setLongBreakTime(newLongBreak * 60);
    if (currentMode === "pomodoro") {
      setTime(newPomodoro * 60);
    } else if (currentMode === "shortBreak") {
      setTime(newShortBreak * 60);
    } else {
      setTime(newLongBreak * 60);
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap"
      />
      <div className="rectangle-container">
        {/* TOP BAR */}
        <div className="top-bar">
          <button
            className={`top-bar-button ${
              currentMode === "pomodoro" ? "selected" : ""
            }`}
            onClick={() => handleModeChange("pomodoro")}
          >
            Pomodoro
          </button>
          <button
            className={`top-bar-button ${
              currentMode === "shortBreak" ? "selected" : ""
            }`}
            onClick={() => handleModeChange("shortBreak")}
          >
            Short Break
          </button>
          <button
            className={`top-bar-button ${
              currentMode === "longBreak" ? "selected" : ""
            }`}
            onClick={() => handleModeChange("longBreak")}
          >
            Long Break
          </button>
        </div>

        {/* CENTER TIME DISPLAY */}
        <div className="time-display">{formatTime(time)}</div>

        {/* BOTTOM CONTROLS */}
        <div className="bottom-controls">
          <button onClick={toggleTimer} className="start-button">
            {isRunning ? "Pause" : "Start"}
          </button>

          {/* Reset icon using Material Symbols Outlined */}
          <span
            className="material-symbols-outlined reset-icon"
            onClick={resetTimer}
          >
            refresh
          </span>

          {/* Settings icon using Material Symbols Outlined */}
          <span
            className="material-symbols-outlined settings-icon"
            onClick={() => setIsSettingsOpen(true)}
          >
            settings
          </span>
        </div>
      </div>

      {/* Settings Modal */}
      <div className={`settings-modal-overlay ${isSettingsOpen ? "fade-in" : ""}`}>
        {isSettingsOpen && (
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            onResetAll={() => console.log("Reset all settings")}
            onSaveChanges={() => {
              console.log("Save settings");
              setIsSettingsOpen(false);
            }}
            isLoggedIn={false} // Update with your actual login state
            pomodoroTime={pomodoroTime / 60} // pass in minutes
            shortBreakTime={shortBreakTime / 60} // pass in minutes
            longBreakTime={longBreakTime / 60} // pass in minutes
            onTimeChange={handleTimeChange}
          />
        )}
      </div>
    </>
  );
};

// Helper function to format time as mm:ss
function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export default Timer;