// @ts-ignore
import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import { DashboardStats } from '../../types';

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
            <h2 style={{ marginBottom: 18, color: '#333' }}>Dashboard Übersicht</h2>

            <div className="stat-grid" style={{ marginBottom: 24 }}>
                {statCards.map((card, idx) => (
                    <div key={idx} className="stat-card" style={{ borderLeft: `4px solid ${card.color}` }}>
                        <div style={{ fontSize: 28, marginBottom: 6 }}>{card.icon}</div>
                        <div className="stat-value" style={{ color: card.color }}>{card.value}</div>
                        <div style={{ color: '#666', fontSize: 13 }}>{card.label}</div>
                    </div>
                ))}
            </div>

            <div className="card">
                <h3 style={{ marginTop: 0, marginBottom: 16, color: '#333' }}>📅 Neueste Einstellungen</h3>

                {stats.recentHires.length === 0 ? (
                    <p style={{ color: '#999' }}>Keine neuesten Einstellungen</p>
                ) : (
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Position</th>
                                    <th>Abteilung</th>
                                    <th>Rolle</th>
                                    <th>Startdatum</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentHires.map((emp) => {
                                    return (
                                        <tr key={emp.id}>
                                            <td><strong>{emp.firstName} {emp.lastName}</strong></td>
                                            <td style={{ color: '#666' }}>{emp.position || '-'}</td>
                                            <td style={{ color: '#666' }}>{emp.department || '-'}</td>
                                            <td><span className={`badge ${emp.role}`}>{emp.role}</span></td>
                                            <td style={{ color: '#666' }}>{emp.startDate ? new Date(emp.startDate).toLocaleDateString('de-DE') : '-'}</td>
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
