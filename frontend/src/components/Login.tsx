// @ts-ignore
import React, { useState } from 'react';
import { api } from '../../api';

interface LoginProps {
    onLoginSuccess: (token: string, user: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    // @ts-ignore
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.login({ email, password });
            onLoginSuccess(response.token, response.user);
        } catch (err: any) {
            setError(err.message || 'Login fehlgeschlagen');
        } finally {
            setLoading(false);
        }
    };

    const demoCredentials = [
        { role: 'Admin', email: 'admin@hrflow.de', password: 'admin123' },
        { role: 'Manager', email: 'manager@hrflow.de', password: 'manager123' },
        { role: 'Employee', email: 'employee@hrflow.de', password: 'employee123' },
    ];

    return (
        <div className="login-hero">
            <div className="login-card">
                <div style={{ textAlign: 'center', marginBottom: 18 }}>
                    <h1 className="login-title">🏢 HRFlow</h1>
                    <p className="login-sub">Mitarbeiter-Management System</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 14 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#333' }}>
                            E-Mail
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="email@beispiel.de"
                        />
                    </div>

                    <div style={{ marginBottom: 14 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#333' }}>
                            Passwort
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div style={{ padding: 12, background: '#fee', color: '#c33', borderRadius: 8, marginBottom: 14, fontSize: 14 }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', transform: 'none' }}
                    >
                        {loading ? 'Wird angemeldet...' : 'Anmelden'}
                    </button>
                </form>

                <div style={{ marginTop: 24 }} className="card">
                    <h3 style={{ margin: '0 0 12px 0', fontSize: 14, color: '#666' }}>🔑 Demo-Zugänge:</h3>
                    {demoCredentials.map((cred, idx) => (
                        <div
                            key={idx}
                            onClick={() => {
                                setEmail(cred.email);
                                setPassword(cred.password);
                            }}
                            style={{ padding: 10, marginBottom: 8, cursor: 'pointer' }}
                        >
                            <strong style={{ color: 'var(--accent-1)' }}>{cred.role}:</strong>
                            <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>
                                {cred.email} / {cred.password}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
