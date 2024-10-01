"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import '../styles/Connect.css'; 
import '@fortawesome/fontawesome-free/css/all.min.css';

const ConnectServices: React.FC = () => {
    const [currentService, setCurrentService] = useState(0);
    const [flip, setFlip] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false); // State to control overlay visibility
    const [isExiting, setIsExiting] = useState(false); // State to control exit animation
    const router = useRouter();
    
    // Updated services array with icons
    const services = [
        { name: "Spotify", color: "text-green-400", icon: "fab fa-spotify" },
        { name: "Apple Music", color: "text-red-400", icon: "fab fa-apple" },
        { name: "SoundCloud", color: "text-orange-400", icon: "fab fa-soundcloud" },
        { name: "YouTube", color: "text-red-500", icon: "fab fa-youtube" }, // Add YouTube option
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setFlip(true);
            setTimeout(() => {
                setCurrentService((prev) => (prev + 1) % services.length);
                setFlip(false);
            }, 500);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    // Function to handle navigation back to home
    const handleGoBack = () => {
        router.push('/');
    };

    // Function to handle showing the overlay
    const handleGetStarted = () => {
        setShowOverlay(true);
    };

    // Function to handle closing the overlay
    const handleCloseOverlay = () => {
        setIsExiting(true); // Set exit state to true
        setTimeout(() => {
            setShowOverlay(false); // Hide overlay after animation
            setIsExiting(false); // Reset exit state
        }, 300); // Match this timeout with the animation duration
    };

    return (
        <div className="connect-container">
            <button className="go-back-button" onClick={handleGoBack}>
                ← Go Back
            </button>
            <div className="content"> 
                <h1 className="slogan">Find Your Rhythm, <br />Boost Your Productivity!</h1>
                <p className="description">
                    Connect your favorite music streaming services <br />and let the music guide your mind.
                </p>
                <div className="flipping-text">
                    <div className={`flipping-text-item ${services[currentService].color} ${flip ? 'flip-leave-active' : ''}`}>
                        {services[currentService].name}
                    </div>
                    <div className={`flipping-text-item ${services[(currentService + 1) % services.length].color} ${flip ? 'flip-enter-active' : 'invisible'}`}>
                        {services[(currentService + 1) % services.length].name}
                    </div>
                </div>
                <div className="connect-buttons">
                    <button className="connect-button" onClick={handleGetStarted}>Get Started Now!</button>
                </div>
            </div>
            {showOverlay && (
                <div className="overlay">
                    <div className={`overlay-content ${isExiting ? 'overlay-content-exit' : ''}`}> {/* Add exit class */}
                        <h2 className="overlay-title">Connect Platform</h2>
                        <div className="options grid grid-cols-2 gap-4">
                            {services.map((service) => (
                                <button 
                                    key={service.name} 
                                    className={`option ${service.color} text-white flex items-center justify-center`}
                                >
                                    <i className={service.icon + " mr-2"}></i> {/* Icon added */}
                                    {service.name}
                                </button>
                            ))}
                        </div>
                        <div className="close-button" onClick={handleCloseOverlay}>
                            ✕
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConnectServices;
