"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './Menu.css';
import SettingsModal from './SettingsModal'; // Import the separate SettingsModal component

const Menu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const [selectedGif, setSelectedGif] = useState<string>('other-background.gif');
    const [bgImage, setBgImage] = useState<string>(`/gifs/${selectedGif}`);

    const router = useRouter();

    const gifs = [
        'other-background.gif',
        'background.gif',
        'gojo.gif',
        'cherry.gif',
    ];

    // Toggle the main hamburger menu
    const toggleMenu = () => setIsOpen((prev) => !prev);

    // Themes
    const handleThemesClick = () => {
        setIsOpen(false);
        setIsThemeMenuOpen(true);
    };
    const handleGifSelect = (gif: string) => {
        setSelectedGif(gif);
        setBgImage(`/gifs/${gif}`);
        setIsThemeMenuOpen(false);
    };
    const handleCloseThemeMenu = () => setIsThemeMenuOpen(false);

    // Connect Services
    const handleConnectServiceClick = () => {
        router.push('/connect_services');
    };

    // Settings: only render SettingsModal when user clicks on Settings.
    const handleSettingsClick = () => {
        setIsOpen(false);
        setIsSettingsOpen(true);
    };

    // Apply the chosen GIF as background
    useEffect(() => {
        document.body.style.backgroundImage = `url(${bgImage})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundColor = 'transparent';

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, [bgImage]);

    // Dim the background for the theme modal
    useEffect(() => {
        document.body.style.backgroundColor = isThemeMenuOpen ? 'rgba(0, 0, 0, 0.5)' : 'transparent';
    }, [isThemeMenuOpen]);

    // Dim the background for the settings modal if it's open (and not overridden by the theme modal)
    useEffect(() => {
        if (isSettingsOpen) {
            document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        } else if (!isThemeMenuOpen) {
            document.body.style.backgroundColor = 'transparent';
        }
    }, [isSettingsOpen, isThemeMenuOpen]);

    // Handlers for SettingsModal actions
    const handleCloseSettingsModal = () => setIsSettingsOpen(false);
    const handleResetAll = () => {
        alert("All settings have been reset!");
    };
    const handleSaveChanges = () => {
        alert("Settings saved!");
        setIsSettingsOpen(false);
    };

    return (
        <div className="relative">
            {/* Hamburger Icon */}
            <button onClick={toggleMenu} className={`menu-icon ${isOpen ? 'open' : ''}`}>
                {isOpen ? '✕' : '☰'}
            </button>

            {/* Slide-out Menu */}
            {isOpen && (
                <div className="menu-popup">
                    <ul>
                        <li onClick={handleConnectServiceClick}>Connect Service</li>
                        <li onClick={handleThemesClick}>Themes</li>
                        <li onClick={handleSettingsClick}>Settings</li>
                    </ul>
                </div>
            )}

            {/* THEME POPUP */}
            {isThemeMenuOpen && (
                <>
                    <div className="overlay" onClick={handleCloseThemeMenu}></div>
                    <div className="theme-popup">
                        <button className="close-button" onClick={handleCloseThemeMenu}>✕</button>
                        <h1 className="theme-title">Choose Theme:</h1>
                        <div className="gif-options">
                            <div className="gif-container">
                                {gifs.map(gif => (
                                    <div key={gif} className="gif-option">
                                        <img src={`/gifs/${gif}`} alt={gif} className="gif-preview" />
                                        <button 
                                            className={`select-button ${selectedGif === gif ? 'selected-button' : ''}`} 
                                            onClick={() => handleGifSelect(gif)}
                                        >
                                            {selectedGif === gif ? 'Selected' : 'Select'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="upload-gif">
                                <input 
                                    className="hidden-input" 
                                    type="file" 
                                    accept="image/gif" 
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file && file.type === 'image/gif') {
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                const result = event.target?.result as string;
                                                setSelectedGif(result);
                                                setBgImage(result);
                                                setIsThemeMenuOpen(false);
                                            };
                                            reader.readAsDataURL(file);
                                        } else {
                                            alert("Please upload a valid GIF.");
                                        }
                                    }} 
                                />
                                <h3
                                    className="upload-button" 
                                    onClick={() => (document.querySelector('.hidden-input') as HTMLInputElement)?.click()}
                                >
                                    Upload Your Own Gif Background!
                                </h3>
                            </div>
                        </div>
                    </div>
                </>
            )}

            
        </div>
    );
};

export default Menu;
