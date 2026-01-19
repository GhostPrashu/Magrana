import React, { useState } from 'react';
import '../index.css';

const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                onLogin(data.user_id, username);
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Failed to connect to server');
        }
    };

    return (
        <div className="login-container">
            <h2>Login to Magrana</h2>
            {error && <p className="error" style={{ color: 'var(--color-error)' }}>{error}</p>}
            <form onSubmit={handleSubmit} className="login-form">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className={error ? 'error' : ''}
                        style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={error ? 'error' : ''}
                        style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                    <button type="submit" className="btn-primary btn-lg" style={{ marginTop: 'var(--spacing-2)', width: '100%' }}>
                        Login
                    </button>
                </div>
            </form>
            <div className="login-hint" style={{ marginTop: 'var(--spacing-2)', fontSize: '14px', color: 'var(--color-neutral-dark-2)' }}>
                <p>Hint: Use user1 / pass1</p>
            </div>
        </div>
    );
};

export default LoginPage;
