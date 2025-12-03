// @ts-ignore
import React, { useEffect, useState } from 'react';
import { api } from '../frontend/api';
import { Employee, UserRole, UpdateEmployeeRequest } from '../frontend/types';

interface EmployeeProfileProps {
    employeeId: number;
    userRole: UserRole;
    onBack: () => void;
}

export const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ employeeId, userRole, onBack }) => {
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<UpdateEmployeeRequest>({});

    useEffect(() => {
        loadEmployee();
    }, [employeeId]);
    // @ts-ignore
    const loadEmployee = async () => {
        try {
            const data = await api.getEmployee(employeeId);
            setEmployee(data);
            setEditData({
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                department: data.department,
                position: data.position,
                startDate: data.startDate,
                salary: data.salary,
                role: data.role
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    // @ts-ignore
    const handleSave = async () => {
        try {
            const updated = await api.updateEmployee(employeeId, editData);
            setEmployee(updated);
            setIsEditing(false);
        } catch (err: any) {
            alert('Fehler beim Speichern: ' + err.message);
        }
    };

    const canEdit = userRole === UserRole.ADMIN || userRole === UserRole.MANAGER;

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Lädt Profil...</div>;
    }

    if (error || !employee) {
        return (
            <div style={{ padding: '40px' }}>
                <div style={{ color: 'red', marginBottom: '20px' }}>⚠️ {error || 'Mitarbeiter nicht gefunden'}</div>
                <button onClick={onBack} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                    ← Zurück
                </button>
            </div>
        );
    }

    const roleColors: Record<string, string> = {
        admin: '#f093fb',
        manager: '#4facfe',
        employee: '#43e97b'
    };

    return (
        <div>
            <button
                onClick={onBack}
                style={{
                    padding: '10px 20px',
                    background: '#e0e0e0',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginBottom: '20px',
                    fontWeight: '600'
                }}
            >
                ← Zurück zur Liste
            </button>

            <div style={{
                background: 'black',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '30px' }}>
                    <div>
                        <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>
                            {employee.firstName} {employee.lastName}
                        </h2>
                        <span style={{
                            padding: '6px 16px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: '600',
                            background: roleColors[employee.role] + '20',
                            color: roleColors[employee.role]
                        }}>
              {employee.role}
            </span>
                    </div>

                    {canEdit && (
                        <button
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            style={{
                                padding: '10px 20px',
                                background: isEditing ? '#43e97b' : '#667eea',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            {isEditing ? '💾 Speichern' : '✏️ Bearbeiten'}
                        </button>
                    )}
                </div>

                <div style={{ display: 'grid', gap: '20px' }}>
                    <ProfileField
                        label="📧 E-Mail"
                        value={employee.email}
                        isEditing={false}
                    />

                    <ProfileField
                        label="👤 Vorname"
                        value={isEditing ? editData.firstName : employee.firstName}
                        isEditing={isEditing}
                        onChange={(val) => setEditData({ ...editData, firstName: val })}
                    />

                    <ProfileField
                        label="👤 Nachname"
                        value={isEditing ? editData.lastName : employee.lastName}
                        isEditing={isEditing}
                        onChange={(val) => setEditData({ ...editData, lastName: val })}
                    />

                    <ProfileField
                        label="📱 Telefon"
                        value={isEditing ? editData.phone : employee.phone}
                        isEditing={isEditing}
                        onChange={(val) => setEditData({ ...editData, phone: val })}
                        placeholder="Keine Telefonnummer"
                    />

                    <ProfileField
                        label="🏢 Abteilung"
                        value={isEditing ? editData.department : employee.department}
                        isEditing={isEditing}
                        onChange={(val) => setEditData({ ...editData, department: val })}
                        placeholder="Keine Abteilung"
                    />

                    <ProfileField
                        label="💼 Position"
                        value={isEditing ? editData.position : employee.position}
                        isEditing={isEditing}
                        onChange={(val) => setEditData({ ...editData, position: val })}
                        placeholder="Keine Position"
                    />

                    <ProfileField
                        label="📅 Startdatum"
                        value={isEditing ? editData.startDate : employee.startDate}
                        isEditing={isEditing}
                        onChange={(val) => setEditData({ ...editData, startDate: val })}
                        type="date"
                        placeholder="Kein Startdatum"
                        formatDate={true}
                    />

                    <ProfileField
                        label="💰 Gehalt"
                        value={isEditing ? editData.salary?.toString() : employee.salary?.toString()}
                        isEditing={isEditing}
                        onChange={(val) => setEditData({ ...editData, salary: val ? parseFloat(val) : undefined })}
                        type="number"
                        placeholder="Kein Gehalt"
                        formatCurrency={true}
                    />

                    {canEdit && isEditing && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#666' }}>
                                👑 Rolle
                            </label>
                            <select
                                value={editData.role}
                                onChange={(e) => setEditData({ ...editData, role: e.target.value as UserRole })}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    boxSizing: 'border-box'
                                }}
                            >
                                <option value={UserRole.EMPLOYEE}>Employee</option>
                                <option value={UserRole.MANAGER}>Manager</option>
                                <option value={UserRole.ADMIN}>Admin</option>
                            </select>
                        </div>
                    )}

                    <div style={{ marginTop: '10px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                        <div style={{ color: '#666', fontSize: '14px' }}>
                            <strong>Erstellt am:</strong> {new Date(employee.createdAt).toLocaleDateString('de-DE', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                        </div>
                    </div>

                    {isEditing && (
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setEditData({
                                    firstName: employee.firstName,
                                    lastName: employee.lastName,
                                    phone: employee.phone,
                                    department: employee.department,
                                    position: employee.position,
                                    startDate: employee.startDate,
                                    salary: employee.salary,
                                    role: employee.role
                                });
                            }}
                            style={{
                                padding: '10px 20px',
                                background: '#ff6b6b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            ❌ Abbrechen
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

interface ProfileFieldProps {
    label: string;
    value?: string;
    isEditing: boolean;
    onChange?: (value: string) => void;
    type?: string;
    placeholder?: string;
    formatDate?: boolean;
    formatCurrency?: boolean;
}

const ProfileField: React.FC<ProfileFieldProps> = ({
                                                       label,
                                                       value,
                                                       isEditing,
                                                       onChange,
                                                       type = 'text',
                                                       placeholder = '-',
                                                       formatDate = false,
                                                       formatCurrency = false
                                                   }) => {
    let displayValue = value || placeholder;

    if (value && formatDate) {
        displayValue = new Date(value).toLocaleDateString('de-DE');
    }

    if (value && formatCurrency) {
        displayValue = new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR'
        }).format(parseFloat(value));
    }

    return (
        <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#666' }}>
                {label}
            </label>
            {isEditing ? (
                <input
                    type={type}
                    value={value || ''}
                    onChange={(e) => onChange?.(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                    }}
                />
            ) : (
                <div style={{
                    padding: '12px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    color: value ? '#333' : '#999',
                    fontSize: '16px'
                }}>
                    {displayValue}
                </div>
            )}
        </div>
    );
};