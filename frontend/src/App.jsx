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
            <header>
                <h1>Magrana</h1>
                {username && <p>Welcome, {username}</p>}
            </header>
            <main>
                {!userId ? (
                    <LoginPage onLogin={handleLogin} />
                ) : (
                    <GameBoard userId={userId} onLogout={handleLogout} />
                )}
            </main>
        </div>
    );
}

export default App;
