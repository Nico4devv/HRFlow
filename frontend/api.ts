import {
    LoginRequest,
    LoginResponse,
    Employee,
    CreateEmployeeRequest,
    UpdateEmployeeRequest,
    DashboardStats
} from './types';

const API_URL = 'http://localhost:9999/api';

class ApiClient {
    private token: string | null = null;

    setToken(token: string | null): void {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    getToken(): string | null {
        if (!this.token) {
            this.token = localStorage.getItem('token');
        }
        return this.token;
    }
    // @ts-ignore
    private async fetch(endpoint: string, options: RequestInit = {}): Promise<any> {
        const token = this.getToken();

        const headers: Record<string, string> = Object.assign({}, (options.headers as Record<string, string>) || {});
        headers['Content-Type'] = 'application/json';

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Netzwerkfehler' }));
            throw new Error(error.error || 'Ein Fehler ist aufgetreten');
        }

        return response.json();
    }
    // @ts-ignore
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await this.fetch('/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        this.setToken(response.token);
        return response;
    }
    // @ts-ignore
    async getDashboard(): Promise<DashboardStats> {
        return this.fetch('/dashboard');
    }
    // @ts-ignore
    async getEmployees(): Promise<Employee[]> {
        return this.fetch('/employees');
    }
    // @ts-ignore
    async getEmployee(id: number): Promise<Employee> {
        return this.fetch(`/employees/${id}`);
    }
    // @ts-ignore
    async createEmployee(data: CreateEmployeeRequest): Promise<Employee> {
        return this.fetch('/employees', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
    // @ts-ignore
    async updateEmployee(id: number, data: UpdateEmployeeRequest): Promise<Employee> {
        return this.fetch(`/employees/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }
    // @ts-ignore
    async deleteEmployee(id: number): Promise<void> {
        return this.fetch(`/employees/${id}`, {
            method: 'DELETE',
        });
    }

    logout(): void {
        this.setToken(null);
    }
}

export const api = new ApiClient();