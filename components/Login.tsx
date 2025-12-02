// @ts-ignore
import React, { useState } from 'react';
import { api } from '../frontend/api';

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
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '40px',
                maxWidth: '450px',
                width: '100%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ margin: 0, color: '#667eea', fontSize: '32px' }}>🏢 HRFlow</h1>
                    <p style={{ margin: '10px 0 0', color: '#666' }}>Mitarbeiter-Management System</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                            E-Mail
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                            placeholder="email@beispiel.de"
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                            Passwort
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div style={{
                            padding: '12px',
                            background: '#fee',
                            color: '#c33',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            fontSize: '14px'
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'scale(1.02)')}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {loading ? 'Wird angemeldet...' : 'Anmelden'}
                    </button>
                </form>

                <div style={{
                    marginTop: '30px',
                    padding: '20px',
                    background: '#f8f9fa',
                    borderRadius: '8px'
                }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#666' }}>
                        🔑 Demo-Zugänge:
                    </h3>
                    {demoCredentials.map((cred, idx) => (
                        <div
                            key={idx}
                            onClick={() => {
                                setEmail(cred.email);
                                setPassword(cred.password);
                            }}
                            style={{
                                padding: '10px',
                                marginBottom: '8px',
                                background: 'white',
                                border: '1px solid #e0e0e0',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = '#667eea';
                                e.currentTarget.style.transform = 'translateX(5px)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = '#e0e0e0';
                                e.currentTarget.style.transform = 'translateX(0)';
                            }}
                        >
                            <strong style={{ color: '#667eea' }}>{cred.role}:</strong>
                            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                {cred.email} / {cred.password}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};