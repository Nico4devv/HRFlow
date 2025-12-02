// @ts-ignore
import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { DashboardStats } from '../types';

export const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDashboard();
    }, []);
    // @ts-ignore
    const loadDashboard = async () => {
        try {
            const data = await api.getDashboard();
            setStats(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Lädt...</div>;
    }

    if (error) {
        return <div style={{ padding: '40px', color: 'red' }}>Fehler: {error}</div>;
    }

    if (!stats) return null;

    const statCards = [
        { label: 'Gesamt Mitarbeiter', value: stats.totalEmployees, color: '#667eea', icon: '👥' },
        { label: 'Admins', value: stats.totalAdmins, color: '#f093fb', icon: '👑' },
        { label: 'Manager', value: stats.totalManagers, color: '#4facfe', icon: '📊' },
        { label: 'Mitarbeiter', value: stats.totalStaff, color: '#43e97b', icon: '💼' },
    ];

    return (
        <div>
            <h2 style={{ marginBottom: '30px', color: '#333' }}>Dashboard Übersicht</h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
            }}>
                {statCards.map((card, idx) => (
                    <div
                        key={idx}
                        style={{
                            background: 'white',
                            padding: '25px',
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            borderLeft: `4px solid ${card.color}`,
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>{card.icon}</div>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: card.color, marginBottom: '5px' }}>
                            {card.value}
                        </div>
                        <div style={{ color: '#666', fontSize: '14px' }}>{card.label}</div>
                    </div>
                ))}
            </div>

            <div style={{
                background: 'white',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>
                    📅 Neueste Einstellungen
                </h3>

                {stats.recentHires.length === 0 ? (
                    <p style={{ color: '#999' }}>Keine neuesten Einstellungen</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>Name</th>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>Position</th>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>Abteilung</th>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>Rolle</th>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>Startdatum</th>
                            </tr>
                            </thead>
                            <tbody>
                            {stats.recentHires.map((emp) => {
                                const roleColors: Record<string, string> = {
                                    admin: '#f093fb',
                                    manager: '#4facfe',
                                    employee: '#43e97b'
                                };

                                return (
                                    <tr key={emp.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={{ padding: '12px' }}>
                                            <strong>{emp.firstName} {emp.lastName}</strong>
                                        </td>
                                        <td style={{ padding: '12px', color: '#666' }}>
                                            {emp.position || '-'}
                                        </td>
                                        <td style={{ padding: '12px', color: '#666' }}>
                                            {emp.department || '-'}
                                        </td>
                                        <td style={{ padding: '12px' }}>
                        <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: roleColors[emp.role] + '20',
                            color: roleColors[emp.role]
                        }}>
                          {emp.role}
                        </span>
                                        </td>
                                        <td style={{ padding: '12px', color: '#666' }}>
                                            {emp.startDate ? new Date(emp.startDate).toLocaleDateString('de-DE') : '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};