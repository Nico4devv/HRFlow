// Gemeinsame Types für Backend und Frontend

export enum UserRole {
    ADMIN = 'admin',
    MANAGER = 'manager',
    EMPLOYEE = 'employee'
}

export interface User {
    id: number;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    createdAt: string;
}

export interface Employee {
    id: number;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    phone?: string;
    department?: string;
    position?: string;
    startDate?: string;
    salary?: number;
    createdAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface CreateEmployeeRequest {
    email: string;
    password: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    phone?: string;
    department?: string;
    position?: string;
    startDate?: string;
    salary?: number;
}

export interface UpdateEmployeeRequest {
    firstName?: string;
    lastName?: string;
    phone?: string;
    department?: string;
    position?: string;
    startDate?: string;
    salary?: number;
    role?: UserRole;
}

export interface DashboardStats {
    totalEmployees: number;
    totalAdmins: number;
    totalManagers: number;
    totalStaff: number;
    recentHires: Employee[];
}

export interface AuthContext {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}