import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import GameBoard from './components/GameBoard';
import './index.css';

function App() {
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState('');

    const handleLogin = (id, name) => {
        setUserId(id);
        setUsername(name);
    };

    const handleLogout = () => {
        setUserId(null);
        setUsername('');
    };

    return (
        <div className="app-container">
            <header style={{
                width: '100%',
                maxWidth: '1024px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-5)'
            }}>
                <div>
                    <h1 style={{ fontSize: '32px' }}>Magrana</h1>
                    {username && <p style={{ color: 'var(--color-neutral-dark-2)', marginTop: '4px' }}>Welcome, {username}</p>}
                </div>
                {userId && (
                    <button onClick={handleLogout} className="btn-secondary btn-md">
                        Logout
                    </button>
                )}
            </header>
            <main style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {!userId ? (
                    <LoginPage onLogin={handleLogin} />
                ) : (
                    <GameBoard userId={userId} />
                )}
            </main>
        </div>
    );
}

export default App;
