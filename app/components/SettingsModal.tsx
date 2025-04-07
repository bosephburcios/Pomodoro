"use client";

import React, { useState, useRef, useEffect } from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetAll: () => void;
  onSaveChanges: () => void;
  isLoggedIn: boolean;
  pomodoroTime: number; // in minutes
  shortBreakTime: number; // in minutes
  longBreakTime: number; // in minutes
  onTimeChange: (
    pomodoro: number,
    shortBreak: number,
    longBreak: number
  ) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetAll,
  onSaveChanges,
  isLoggedIn,
  pomodoroTime,
  shortBreakTime,
  longBreakTime,
  onTimeChange,
}) => {
  // Active tab
  const [activeTab, setActiveTab] = useState<
    "general" | "timers" | "sounds" | "account"
  >("general");

  // Example theme state
  const [selectedTheme, setSelectedTheme] = useState("Seoul Sunrise");

  // For uploading an image/gif
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local Timer States
  const [localPomodoro, setLocalPomodoro] = useState(pomodoroTime);
  const [localShortBreak, setLocalShortBreak] = useState(shortBreakTime);
  const [localLongBreak, setLocalLongBreak] = useState(longBreakTime);
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);

  // ------------------
  // Sounds Tab States
  // ------------------
  const [alertSound, setAlertSound] = useState("Bell");
  const [playSound, setPlaySound] = useState(true);
  const [alertVolume, setAlertVolume] = useState(0.5); // Range from 0 to 1

  // Sync local state when props change
  useEffect(() => {
    setLocalPomodoro(pomodoroTime);
    setLocalShortBreak(shortBreakTime);
    setLocalLongBreak(longBreakTime);
  }, [pomodoroTime, shortBreakTime, longBreakTime]);

  if (!isOpen) return null;

  // Trigger hidden file input
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Validate uploaded file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/gif", "image/png", "image/jpeg"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid .gif, .png, or .jpg file.");
      return;
    }
    alert(`Uploaded: ${file.name}`);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const validTypes = ["image/gif", "image/png", "image/jpeg"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid .gif, .png, or .jpg file.");
      return;
    }
    alert(`Uploaded: ${file.name}`);
  };

  // ------------------
  // Tab Content
  // ------------------
  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <>
            <h1 className="text-xl font-semibold mb-4">General</h1>
            {/* Select Theme */}
            <div className="mb-6">
              <label className="block mb-2">Select Theme:</label>
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="w-[400px] bg-gray-800 border border-gray-600 rounded px-2 py-1"
              >
                <option>Seoul Sunrise</option>
                <option>Cherry Blossom</option>
                <option>Gojo</option>
                <option>Background GIF</option>
              </select>
            </div>

            {/* Upload your own image/gif */}
            <div className="mb-6">
              <p className="mb-2 text-sm">
                Want a different theme? Upload your own image or gif{" "}
                <span
                  className="text-blue-400 underline cursor-pointer"
                  onClick={handleUploadClick}
                >
                  here
                </span>
                !
              </p>
              <input
                type="file"
                accept="image/gif,image/png,image/jpeg"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              {/* Dropzone area */}
              <div
                className="w-full h-32 border-2 border-dashed border-gray-500 rounded flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors duration-200"
                onClick={handleUploadClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <span className="text-gray-400">
                  Drag and drop an image here, or click to select file
                </span>
              </div>
            </div>

            {/* Toggle for Spotify playlist */}
            <div>
              <p className="mb-2">Show playlist</p>
              <div className="relative inline-block group">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={!isLoggedIn}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer-focus:ring-2 peer-focus:ring-blue-300 transition-colors duration-200 peer-checked:bg-blue-600 disabled:opacity-50"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 transform peer-checked:translate-x-5 disabled:opacity-50"></div>
                </label>
                {!isLoggedIn && (
                  <div className="absolute left-full ml-2 whitespace-nowrap text-gray-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    (Locked until logged in)
                  </div>
                )}
              </div>
            </div>
          </>
        );

      case "timers":
        return (
          <>
            <h1 className="text-xl font-semibold mb-4">Timers</h1>

            {/* Time heading */}
            <label className="block font-semibold mb-2 text-gray-200">
              Time (minutes)
            </label>
            <div className="flex space-x-8 mb-6">
              {/* Pomodoro */}
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-400 mb-1">Pomodoro</span>
                <input
                  type="number"
                  value={localPomodoro}
                  onChange={(e) => setLocalPomodoro(Number(e.target.value))}
                  className="bg-gray-800 border border-gray-600 rounded px-2 py-1 w-16 text-center"
                />
              </div>

              {/* Short Break */}
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-400 mb-1">Short Break</span>
                <input
                  type="number"
                  value={localShortBreak}
                  onChange={(e) => setLocalShortBreak(Number(e.target.value))}
                  className="bg-gray-800 border border-gray-600 rounded px-2 py-1 w-16 text-center"
                />
              </div>

              {/* Long Break */}
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-400 mb-1">Long Break</span>
                <input
                  type="number"
                  value={localLongBreak}
                  onChange={(e) => setLocalLongBreak(Number(e.target.value))}
                  className="bg-gray-800 border border-gray-600 rounded px-2 py-1 w-16 text-center"
                />
              </div>
            </div>

            {/* Auto Start Breaks Toggle */}
            <div className="mb-6 flex items-center">
              <p className="mr-4 text-sm">Auto Start Breaks</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoStartBreaks}
                  onChange={(e) => setAutoStartBreaks(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer-focus:ring-2 peer-focus:ring-blue-300 transition-colors duration-200 peer-checked:bg-blue-600"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 transform peer-checked:translate-x-5"></div>
              </label>
            </div>
          </>
        );

      case "sounds":
        return (
          <>
            <h1 className="text-xl font-semibold mb-4">Sounds</h1>

            {/* Select alert sound */}
            <div className="mb-4">
              <label className="block mb-2">Select alert sound:</label>
              <select
                value={alertSound}
                onChange={(e) => setAlertSound(e.target.value)}
                className="w-[300px] bg-gray-800 border border-gray-600 rounded px-2 py-1"
              >
                <option value="Bell">Bell</option>
                <option value="Bird">Bird</option>
                <option value="Chime">Chime</option>
                <option value="None">None</option>
              </select>
            </div>

            {/* Toggle play sound */}
            <div className="mb-4 flex items-center space-x-2">
              <label className="text-sm">Play sound when timer finishes</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={playSound}
                  onChange={(e) => setPlaySound(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer-focus:ring-2 peer-focus:ring-blue-300 transition-colors duration-200 peer-checked:bg-blue-600"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 transform peer-checked:translate-x-5"></div>
              </label>
            </div>

            {/* Alert volume */}
            <div className="mb-6">
              <label className="block mb-2 text-sm">Alert volume</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={alertVolume}
                onChange={(e) => setAlertVolume(Number(e.target.value))}
                className="w-[250px] accent-white cursor-pointer"
              />
              <p className="text-xs text-gray-400 mt-1">Volume: {Math.round(alertVolume * 100)}%</p>
            </div>
          </>
        );

      case "account":
        return (
          <>
            <h1 className="text-xl font-semibold mb-4">Account</h1>
            <p>Account-specific settings go here.</p>
          </>
        );

      default:
        return null;
    }
  };

  // When "Save changes" is clicked, update parent timer values + any sounds logic
  const handleSave = () => {
    // For now, we only pass the timers up to the parent
    onTimeChange(localPomodoro, localShortBreak, localLongBreak);
    // You could also pass up alertSound, playSound, and alertVolume if needed
    onSaveChanges();
  };

  // When "Reset all" is clicked in the modal, reset local values to defaults
  const handleResetAll = () => {
    const defaultPomodoro = 25;
    const defaultShortBreak = 5;
    const defaultLongBreak = 15;
    setLocalPomodoro(defaultPomodoro);
    setLocalShortBreak(defaultShortBreak);
    setLocalLongBreak(defaultLongBreak);
    setAutoStartBreaks(false);

    // Reset sound settings to defaults
    setAlertSound("Bell");
    setPlaySound(true);
    setAlertVolume(0.5);

    // Update parent timer values
    onTimeChange(defaultPomodoro, defaultShortBreak, defaultLongBreak);
    onResetAll();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70" onClick={onClose} />

      {/* Modal container */}
      <div className="
        relative bg-[#111] text-white rounded-3xl shadow-xl 
        w-full sm:max-w-[650px] max-w-[90%] 
        min-h-[40vh] max-h-[75vh] 
        flex overflow-hidden
      ">
        {/* LEFT SIDE TABS */}
        <div className="w-[160px] p-4 mt-6 flex flex-col space-y-2">
          <button
            className={`text-left py-2 px-3 rounded hover:bg-[#222] ${
              activeTab === "general" ? "text-white bg-[#222]" : "text-gray-300"
            }`}
            onClick={() => setActiveTab("general")}
          >
            General
          </button>
          <button
            className={`text-left py-2 px-3 rounded hover:bg-[#222] ${
              activeTab === "timers" ? "text-white bg-[#222]" : "text-gray-300"
            }`}
            onClick={() => setActiveTab("timers")}
          >
            Timers
          </button>
          <button
            className={`text-left py-2 px-3 rounded hover:bg-[#222] ${
              activeTab === "sounds" ? "text-white bg-[#222]" : "text-gray-300"
            }`}
            onClick={() => setActiveTab("sounds")}
          >
            Sounds
          </button>
          <button
            className={`text-left py-2 px-3 rounded hover:bg-[#222] ${
              activeTab === "account" ? "text-white bg-[#222]" : "text-gray-300"
            }`}
            onClick={() => setActiveTab("account")}
          >
            Account
          </button>
        </div>

        {/* RIGHT SIDE CONTENT */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto items-start text-left">
          {renderTabContent()}

          {/* Feature requests & disclaimers */}
          <div className="mt-6 text-sm">
            <p className="mb-4">
              Have feature requests, or an issue to report? Fill out our{" "}
              <a
                href="https://your-quick-feedback-form.com"
                target="_blank"
                rel="noreferrer"
                className="underline text-blue-400"
              >
                quick feedback form
              </a>{" "}
              here and follow my Instagram{" "}
              <a
                href="https://www.instagram.com/bosephburcios/"
                target="_blank"
                rel="noreferrer"
                className="underline text-blue-400"
              >
                @bosephburcios
              </a>
              .
            </p>
            <p className="text-xs text-gray-400">
              We are not related to the Pomodoro Technique™ trademark holder
              Cirillo Company and respect its trademarks. Pomodoro Technique®
              and Pomodoro® are registered trademarks of Francesco Cirillo.
            </p>
          </div>

          {/* Footer buttons */}
          <div className="mt-8 flex items-center justify-between w-full">
            <button
              onClick={handleResetAll}
              className="rounded-full border border-red-400 text-red-400 px-6 py-2 hover:bg-red-400 hover:text-white transition-colors duration-200"
            >
              Reset all
            </button>
            <div className="space-x-4">
              <button
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded-full transition-colors duration-200"
              >
                Close
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-300 hover:bg-blue-400 px-6 py-2 rounded-full transition-colors duration-200 text-white"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
