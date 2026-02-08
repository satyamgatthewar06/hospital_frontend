import React, { useState, useEffect } from 'react';
import Sidebar from './Navigation/Sidebar';
import Header from './Header';
import './Layout.css';

const Layout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Auto-collapse on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setCollapsed(true);
            } else {
                setCollapsed(false);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="app-layout">
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <div className={`main-wrapper ${collapsed ? 'collapsed' : ''}`}>
                <Header />
                <main className="content-body">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
