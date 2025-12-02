// @ts-ignore
import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Employee, UserRole, CreateEmployeeRequest } from '../types';

interface EmployeeListProps {
    userRole: UserRole;
    onSelectEmployee: (id: number) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({ userRole, onSelectEmployee }) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadEmployees();
    }, []);
    // @ts-ignore
    const loadEmployees = async () => {
        try {
            const data = await api.getEmployees();
            setEmployees(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    // @ts-ignore
    const handleDelete = async (id: number) => {
        if (!window.confirm('Mitarbeiter wirklich löschen?')) return;

        try {
            await api.deleteEmployee(id);
            setEmployees(employees.filter(emp => emp.id !== id));
        } catch (err: any) {
            alert('Fehler beim Löschen: ' + err.message);
        }
    };

    const canManage = userRole === UserRole.ADMIN || userRole === UserRole.MANAGER;
    const canDelete = userRole === UserRole.ADMIN;

    const filteredEmployees = employees.filter(emp =>
        `${emp.firstName} ${emp.lastName} ${emp.email} ${emp.department || ''}`
            .toLowerCase()
            // @ts-ignore
            .includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Lädt Mitarbeiter...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: 0, color: '#333' }}>Mitarbeiter ({employees.length})</h2>
                {canManage && (
                    <button
                        onClick={() => setShowAddModal(true)}
                        style={{
                            padding: '12px 24px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '14px'
                        }}
                    >
                        ➕ Mitarbeiter hinzufügen
                    </button>
                )}
            </div>

            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="🔍 Suchen nach Name, E-Mail oder Abteilung..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                    }}
                />
            </div>

            {error && (
                <div style={{ padding: '12px', background: '#fee', color: '#c33', borderRadius: '8px', marginBottom: '20px' }}>
                    ⚠️ {error}
                </div>
            )}

            <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8f9fa' }}>
                        <tr>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Name</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#666' }}>E-Mail</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Rolle</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Abteilung</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Position</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Aktionen</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredEmployees.map((emp) => {
                            const roleColors: Record<string, string> = {
                                admin: '#f093fb',
                                manager: '#4facfe',
                                employee: '#43e97b'
                            };

                            return (
                                <tr key={emp.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                    <td style={{ padding: '16px' }}>
                                        <strong style={{ color: '#333' }}>{emp.firstName} {emp.lastName}</strong>
                                    </td>
                                    <td style={{ padding: '16px', color: '#666' }}>{emp.email}</td>
                                    <td style={{ padding: '16px' }}>
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
                                    <td style={{ padding: '16px', color: '#666' }}>{emp.department || '-'}</td>
                                    <td style={{ padding: '16px', color: '#666' }}>{emp.position || '-'}</td>
                                    <td style={{ padding: '16px' }}>
                                        <button
                                            onClick={() => onSelectEmployee(emp.id)}
                                            style={{
                                                padding: '6px 12px',
                                                background: '#4facfe',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                marginRight: '8px',
                                                fontSize: '12px'
                                            }}
                                        >
                                            👁️ Anzeigen
                                        </button>
                                        {canDelete && (
                                            <button
                                                onClick={() => handleDelete(emp.id)}
                                                style={{
                                                    padding: '6px 12px',
                                                    background: '#ff6b6b',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                🗑️ Löschen
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>

                    {filteredEmployees.length === 0 && (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                            {searchTerm ? '🔍 Keine Mitarbeiter gefunden' : '📋 Noch keine Mitarbeiter vorhanden'}
                        </div>
                    )}
                </div>
            </div>

            {showAddModal && (
                <AddEmployeeModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={(newEmp) => {
                        setEmployees([newEmp, ...employees]);
                        setShowAddModal(false);
                    }}
                />
            )}
        </div>
    );
};

interface AddEmployeeModalProps {
    onClose: () => void;
    onSuccess: (employee: Employee) => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState<CreateEmployeeRequest>({
        email: '',
        password: '',
        role: UserRole.EMPLOYEE,
        firstName: '',
        lastName: '',
        phone: '',
        department: '',
        position: '',
        startDate: '',
        salary: undefined
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // @ts-ignore
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const newEmployee = await api.createEmployee(formData);
            onSuccess(newEmployee);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '30px',
                maxWidth: '500px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Neuen Mitarbeiter hinzufügen</h3>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gap: '15px' }}>
                        <input
                            type="email"
                            placeholder="E-Mail *"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={{ padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                        />
                        <input
                            type="password"
                            placeholder="Passwort *"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            style={{ padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                        />
                        <input
                            type="text"
                            placeholder="Vorname *"
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            style={{ padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                        />
                        <input
                            type="text"
                            placeholder="Nachname *"
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            style={{ padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                        />
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                            style={{ padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                        >
                            <option value={UserRole.EMPLOYEE}>Employee</option>
                            <option value={UserRole.MANAGER}>Manager</option>
                            <option value={UserRole.ADMIN}>Admin</option>
                        </select>
                        <input
                            type="tel"
                            placeholder="Telefon"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            style={{ padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                        />
                        <input
                            type="text"
                            placeholder="Abteilung"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            style={{ padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                        />
                        <input
                            type="text"
                            placeholder="Position"
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            style={{ padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                        />
                        <input
                            type="date"
                            placeholder="Startdatum"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            style={{ padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                        />
                        <input
                            type="number"
                            placeholder="Gehalt"
                            value={formData.salary || ''}
                            onChange={(e) => setFormData({ ...formData, salary: e.target.value ? parseFloat(e.target.value) : undefined })}
                            style={{ padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                        />
                    </div>

                    {error && (
                        <div style={{ marginTop: '15px', padding: '10px', background: '#fee', color: '#c33', borderRadius: '6px' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                flex: 1,
                                padding: '12px',
                                background: loading ? '#ccc' : '#667eea',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            {loading ? 'Speichern...' : 'Hinzufügen'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '12px',
                                background: '#e0e0e0',
                                color: '#333',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            Abbrechen
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};