// components/Menu.tsx
"use client";

import { useState } from 'react';

const Menu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(prev => !prev);
    };

    return (
        <div className="relative">
            <button onClick={toggleMenu} className={`menu-icon ${isOpen ? 'open' : ''}`}>
                {isOpen ? '✕' : '☰'} {/* Change icon based on state */}
            </button>
            {isOpen && (
                <div className="menu-popup">
                    <ul>
                        <li>Connect Service</li>
                        <li>Settings</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Menu;
