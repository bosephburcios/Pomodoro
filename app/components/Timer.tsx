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

// Map theme name to filename
const getThemeFile = (theme: string) => {
  switch (theme) {
    case "Seoul Sunrise": return "background.gif";
    case "Cherry": return "cherry.gif";
    case "Gojo": return "gojo.gif";
    case "Other Background": return "other-background.gif";
    default: return "background.gif";
  }
};

const Timer: React.FC = () => {
  const [pomodoroTime, setPomodoroTime] = useState(1500);
  const [shortBreakTime, setShortBreakTime] = useState(300);
  const [longBreakTime, setLongBreakTime] = useState(900);

  const [time, setTime] = useState(pomodoroTime);
  const [isRunning, setIsRunning] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [isWorkPhase, setIsWorkPhase] = useState(true);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [music, setMusic] = useState<HTMLAudioElement | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [alertSound, setAlertSound] = useState("Bell");
  const [playSound, setPlaySound] = useState(true);
  const [alertVolume, setAlertVolume] = useState(0.5);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [theme, setTheme] = useState("Other Background");
  const [tempTheme, setTempTheme] = useState(theme);

  const [currentMode, setCurrentMode] = useState<"pomodoro" | "shortBreak" | "longBreak">("pomodoro");

  const isRunningRef = useRef(isRunning);
  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  const handleModeChange = (mode: "pomodoro" | "shortBreak" | "longBreak") => {
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

  const handleSoundChange = (sound: string, volume: number, play: boolean) => {
    setAlertSound(sound);
    setAlertVolume(volume);
    setPlaySound(play);
  };

  const createAndPlayMusic = (index: number) => {
    if (music) {
      music.removeEventListener("ended", handleSongEnd);
      music.pause();
    }
    const newAudio = new Audio(songs[index]);
    newAudio.volume = musicVolume;
    newAudio.muted = musicVolume === 0;
    newAudio.addEventListener("ended", handleSongEnd);
    setMusic(newAudio);
    newAudio.play();
  };

  useEffect(() => {
    if (music) {
      music.volume = musicVolume;
    }
  }, [musicVolume, music]);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    if (isRunning) {
      timerInterval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 0) {
            const alarmAudio = new Audio(audioFile);
            alarmAudio.volume = alertVolume;
            if (playSound) alarmAudio.play();
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

  const handleSongEnd = () => {
    if (!isRunningRef.current) return;
    setCurrentSongIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % songs.length;
      setTimeout(() => createAndPlayMusic(nextIndex), 1500);
      return nextIndex;
    });
  };

  const toggleTimer = () => {
    if (!isRunning) {
      if (music && music.paused) {
        music.play();
      } else {
        createAndPlayMusic(currentSongIndex);
      }
      setIsRunning(true);
    } else {
      music?.pause();
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCyclesCompleted(0);
    setCurrentSongIndex(0);
    music?.pause();
    setMusic(null);
    if (currentMode === "pomodoro") {
      setTime(pomodoroTime);
      setIsWorkPhase(true);
    } else if (currentMode === "shortBreak") {
      setTime(shortBreakTime);
      setIsWorkPhase(false);
    } else {
      setTime(longBreakTime);
      setIsWorkPhase(false);
    }
  };

  const handleTimeChange = (newPomodoro: number, newShortBreak: number, newLongBreak: number) => {
    setPomodoroTime(newPomodoro * 60);
    setShortBreakTime(newShortBreak * 60);
    setLongBreakTime(newLongBreak * 60);
    if (!isRunning) {
      if (currentMode === "pomodoro") {
        setTime(newPomodoro * 60);
      } else if (currentMode === "shortBreak") {
        setTime(newShortBreak * 60);
      } else {
        setTime(newLongBreak * 60);
      }
    }
  };

  useEffect(() => {
    if (isSettingsOpen) {
      setTempTheme(theme); // Sync temp theme with committed theme
    }
  }, [isSettingsOpen]);

  useEffect(() => {
    const activeTheme = isSettingsOpen ? tempTheme : theme;
    const gif = getThemeFile(activeTheme);
    document.body.style.backgroundImage = `url(/gifs/${gif})`;
  }, [theme, tempTheme, isSettingsOpen]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap"
      />
      <div className="rectangle-container">
        {/* TOP BAR */}
        <div className="top-bar">
          <button className={`top-bar-button ${currentMode === "pomodoro" ? "selected" : ""}`} onClick={() => handleModeChange("pomodoro")}>Pomodoro</button>
          <button className={`top-bar-button ${currentMode === "shortBreak" ? "selected" : ""}`} onClick={() => handleModeChange("shortBreak")}>Short Break</button>
          <button className={`top-bar-button ${currentMode === "longBreak" ? "selected" : ""}`} onClick={() => handleModeChange("longBreak")}>Long Break</button>
        </div>

        {/* CENTER TIME DISPLAY */}
        <div className="time-display">{formatTime(time)}</div>

        {/* BOTTOM CONTROLS */}
        <div className="bottom-controls">
          <button onClick={toggleTimer} className="start-button">{isRunning ? "Pause" : "Start"}</button>
          <span className="material-symbols-outlined reset-icon" onClick={resetTimer}>refresh</span>
          <span className="material-symbols-outlined settings-icon" onClick={() => setIsSettingsOpen(true)}>settings</span>
        </div>
      </div>

      {/* SETTINGS MODAL */}
      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => {
            setIsSettingsOpen(false);
            setTempTheme(theme); // revert preview
          }}
          onResetAll={() => console.log("Reset all settings")}
          onSoundChange={handleSoundChange}
          onSaveChanges={() => {
            setTheme(tempTheme); // commit selected
            setIsSettingsOpen(false);
          }}
          isLoggedIn={false}
          pomodoroTime={pomodoroTime / 60}
          shortBreakTime={shortBreakTime / 60}
          longBreakTime={longBreakTime / 60}
          onTimeChange={handleTimeChange}
          alarmSound={alertSound}
          alarmVolume={alertVolume}
          shouldPlaySound={playSound}
          musicVolume={musicVolume}
          onMusicVolumeChange={(v) => {
            setMusicVolume(v);
            if (music) {
              music.volume = v;
              music.muted = v === 0;
            }
          }}
          selectedTheme={tempTheme}
          onThemePreview={(newTheme) => setTempTheme(newTheme)}
        />
      )}
    </>
  );
};

function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export default Timer;
