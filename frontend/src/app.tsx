import React, { useState, useEffect } from 'react';
import { Login, Dashboard, EmployeeList, EmployeeProfile } from './components';
import { User, UserRole } from '../types';
import { api } from '../api';

type View = 'dashboard' | 'employees' | 'profile';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState<View>('dashboard');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);

    useEffect(() => {
        // Check if user is already logged in
        const token = api.getToken();
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                handleLogout();
            }
        }
    }, []);

    const handleLoginSuccess = (token: string, userData: User) => {
        api.setToken(token);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setCurrentView('dashboard');
    };

    const handleLogout = () => {
        api.logout();
        setUser(null);
        localStorage.removeItem('user');
        setCurrentView('dashboard');
    };

    const handleSelectEmployee = (id: number) => {
        setSelectedEmployeeId(id);
        setCurrentView('profile');
    };

    if (!user) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="app-root" style={{ minHeight: '100vh' }}>
            <header className="app-header">
                <div className="container">
                    <div className="app-brand">
                        <h1>🏢 HRFlow</h1>
                        <p>Mitarbeiter-Management System</p>
                    </div>

                    <div className="user-actions">
                        <div className="user-name">
                            {user.firstName} {user.lastName}
                        </div>
                        <div style={{ fontSize: 12, opacity: 0.9 }}>{user.role.toUpperCase()}</div>
                        <button className="logout-btn" onClick={handleLogout}>🚪 Abmelden</button>
                    </div>
                </div>
            </header>

            <nav className="app-nav">
                <div className="nav-inner">
                    <NavButton
                        active={currentView === 'dashboard'}
                        onClick={() => setCurrentView('dashboard')}
                        icon="📊"
                        label="Dashboard"
                    />
                    <NavButton
                        active={currentView === 'employees' || currentView === 'profile'}
                        onClick={() => setCurrentView('employees')}
                        icon="👥"
                        label="Mitarbeiter"
                    />
                </div>
            </nav>

            <main className="app-main">
                {currentView === 'dashboard' && <Dashboard />}

                {currentView === 'employees' && (
                    <EmployeeList
                        userRole={user.role as UserRole}
                        onSelectEmployee={handleSelectEmployee}
                    />
                )}

                {currentView === 'profile' && selectedEmployeeId !== null && (
                    <EmployeeProfile
                        employeeId={selectedEmployeeId}
                        userRole={user.role as UserRole}
                        onBack={() => setCurrentView('employees')}
                    />
                )}
            </main>

            <footer style={{ textAlign: 'center', padding: '20px', color: '#999', fontSize: '14px' }}>
                <p style={{ margin: 0 }}>© 2024 HRFlow - Mitarbeiter-Management System</p>
            </footer>
        </div>
    );
};

interface NavButtonProps {
    active: boolean;
    onClick: () => void;
    icon: string;
    label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '15px 25px',
                background: 'transparent',
                color: active ? '#667eea' : '#666',
                border: 'none',
                borderBottom: active ? '3px solid #667eea' : '3px solid transparent',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: active ? '600' : '500',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}
            onMouseOver={(e) => {
                if (!active) {
                    e.currentTarget.style.color = '#667eea';
                    e.currentTarget.style.background = '#f8f9fa';
                }
            }}
            onMouseOut={(e) => {
                if (!active) {
                    e.currentTarget.style.color = '#666';
                    e.currentTarget.style.background = 'transparent';
                }
            }}
        >
            <span>{icon}</span>
            <span>{label}</span>
        </button>
    );
};

export default App;