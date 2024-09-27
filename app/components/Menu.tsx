"use client";

import { useState, useEffect } from 'react';

const Menu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
    const [selectedGif, setSelectedGif] = useState<string>('other-background.gif'); // Default GIF
    const [bgImage, setBgImage] = useState<string | null>(`/gifs/${selectedGif}`); // Initial background image

    // List of static GIF filenames
    const gifs = [
        'other-background.gif',
        'background.gif',
        'gojo.gif',
    ];

    const toggleMenu = () => {
        setIsOpen(prev => !prev);
    };

    const handleThemesClick = () => {
        setIsOpen(false);
        setIsThemeMenuOpen(true);
    };

    const handleGifSelect = (gif: string) => {
        setSelectedGif(gif);
        setBgImage(`/gifs/${gif}`); // Set the background image when selected
        setIsThemeMenuOpen(false);
    };

    const handleCloseThemeMenu = () => {
        setIsThemeMenuOpen(false);
    };

    // Set the background image when the component mounts
    useEffect(() => {
        // Set initial background image
        document.body.style.backgroundImage = `url(${bgImage})`;
        document.body.style.backgroundSize = 'cover'; 
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundColor = 'transparent'; 
    }, []); // Run only once on mount

    // Update the background image whenever bgImage changes
    useEffect(() => {
        if (bgImage) {
            document.body.style.backgroundImage = `url(${bgImage})`;
        }
    }, [bgImage]);

    // Apply grey tint to body when theme menu is open
    useEffect(() => {
        if (isThemeMenuOpen) {
            document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        } else {
            document.body.style.backgroundColor = 'transparent'; // Reset when closed
        }
    }, [isThemeMenuOpen]);

    return (
        <div className="relative">
            <button onClick={toggleMenu} className={`menu-icon ${isOpen ? 'open' : ''}`}>
                {isOpen ? '✕' : '☰'}
            </button>
            {isOpen && (
                <div className="menu-popup">
                    <ul>
                        <li>Connect Service</li>
                        <li onClick={handleThemesClick}>Themes</li>
                        <li>Settings</li>
                    </ul>
                </div>
            )}
            {isThemeMenuOpen && (
                <>
                    <div className="overlay" onClick={handleCloseThemeMenu}></div>
                    <div className="theme-popup">
                        <button className="close-button" onClick={handleCloseThemeMenu}>✕</button>
                        <h1 className="theme-title">Choose Theme:</h1>
                        <div className="gif-options">
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
                            <div className="upload-gif">
                                <input 
                                    className="hidden-input" 
                                    type="file" 
                                    accept="image/gif" 
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                const result = event.target?.result as string;
                                                setSelectedGif(result);
                                                setBgImage(result);
                                                setIsThemeMenuOpen(false);
                                            };
                                            reader.readAsDataURL(file);
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
