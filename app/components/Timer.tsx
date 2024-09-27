"use client";

import { useEffect, useState } from 'react';
import './Timer.css';

const audioFile = '/sounds/alarm.mp3';
const song1 = '/sounds/sonny.mp3';
const song2 = '/sounds/Autumn Leaves.mp3';
const song3 = '/sounds/My Foolish Heart.mp3';
const song4 = '/sounds/Body & Soul.mp3';
const song5 = '/sounds/All The Things You Are.mp3';
const song6 = '/sounds/if i am with you.mp3';

// Array of songs that play during the timer
const songs = [song1, song2, song3, song4, song5, song6];

const Timer: React.FC = () => {
    const initialWorkTime = 1500; // 25 minutes
    const initialBreakTime = 300; // 5 minutes

    const [time, setTime] = useState(initialWorkTime);
    const [isRunning, setIsRunning] = useState(false);
    const [cyclesCompleted, setCyclesCompleted] = useState(0);
    const [isWorkPhase, setIsWorkPhase] = useState(true);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [music, setMusic] = useState<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Create a new Audio instance only in the client-side environment
        if (typeof window !== 'undefined') {
            const newMusic = new Audio(songs[currentSongIndex]);
            setMusic(newMusic);
        }
    }, [currentSongIndex]);

    // Timer logic
    useEffect(() => {
        let timerInterval: NodeJS.Timeout;

        if (isRunning) {
            timerInterval = setInterval(() => {
                setTime(prevTime => {
                    if (prevTime <= 0) {
                        if (isWorkPhase) {
                            setTime(initialBreakTime);
                            setIsWorkPhase(false);
                        } else {
                            setTime(initialWorkTime);
                            setIsWorkPhase(true);
                            setCyclesCompleted(prevCycles => prevCycles + 1);
                            setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
                        }
                        const alarmAudio = new Audio(audioFile); // Timer beep sound
                        alarmAudio.play();
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerInterval);
    }, [isRunning, isWorkPhase, cyclesCompleted]);

    useEffect(() => {
        if (cyclesCompleted === 8) {
            setIsRunning(false);
        }
    }, [cyclesCompleted]);

    const handleSongEnd = () => {
        setTimeout(() => {
            const nextIndex = (currentSongIndex + 1) % songs.length;
            setCurrentSongIndex(nextIndex);
            music?.play(); // Play the next song
        }, 1500); // 1500 milliseconds
    };

    useEffect(() => {
        if (music) {
            music.addEventListener('ended', handleSongEnd);
            return () => {
                music.removeEventListener('ended', handleSongEnd);
            };
        }
    }, [music]);

    const toggleTimer = () => {
        if (!isRunning) {
            if (music && music.paused) {
                music.play();
            } else {
                const musicToPlay = new Audio(songs[currentSongIndex]);
                musicToPlay.addEventListener('ended', handleSongEnd);
                setMusic(musicToPlay);
                musicToPlay.play();
            }
            setIsRunning(true);
        } else {
            music?.pause();
            setIsRunning(false);
        }
    };

    const resetTimer = () => {
        setTime(initialWorkTime);
        setIsRunning(false);
        setCyclesCompleted(0);
        setIsWorkPhase(true);
        setCurrentSongIndex(0);
        music?.pause();
        setMusic(null); // Reset music to avoid keeping the old audio reference
    };

    return (
        <div className="circle-container">
            <div className="timer">{formatTime(time)}</div>
            <div className="controls">
                <button onClick={toggleTimer}>{isRunning ? 'Pause' : 'Start'}</button>
                <button onClick={resetTimer}>Reset</button>
            </div>
        </div>
    );
     
};

// Helper method to set up time in timer.
const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default Timer;