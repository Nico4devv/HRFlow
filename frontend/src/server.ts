// @ts-ignore
import express, { Response } from 'express';
// @ts-ignore
import cors from 'cors';
// @ts-ignore
import bcrypt from 'bcryptjs';
// @ts-ignore
import jwt from 'jsonwebtoken';
// @ts-ignore
import { initDatabase, getDb } from './database';
// @ts-ignore
import authenticateToken, { authorizeRoles, AuthRequest, JWT_SECRET } from './auth';
// @ts-ignore
import { UserRole, LoginRequest, CreateEmployeeRequest, UpdateEmployeeRequest } from './types';

const app = express();
const PORT = 9999;

app.use(cors());
app.use(express.json());

initDatabase();

// Simple landing page so GET / returns something useful
app.get('/', (_req, res) => {
        res.send(`
                <html>
                    <head><title>HRFlow</title></head>
                    <body style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial; padding:24px;">
                        <h1>HRFlow</h1>
                        <p>API server is running. Use the <code>/api</code> endpoints.</p>
                        <ul>
                            <li>POST <a href="/api/login">/api/login</a> (login)</li>
                            <li>GET <a href="/api/dashboard">/api/dashboard</a> (requires auth)</li>
                            <li>GET <a href="/api/employees">/api/employees</a> (requires auth)</li>
                        </ul>
                        <p>Server listening on port ${PORT}.</p>
                    </body>
                </html>
        `);
});


// Simple landing page so GET / returns something useful
app.get('/', (_req, res) => {
        res.send(`
                <html>
                    <head><title>HRFlow</title></head>
                    <body style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial; padding:24px;">
                        <h1>HRFlow</h1>
                        <p>API server is running. Use the <code>/api</code> endpoints.</p>
                        <ul>
                            <li>POST <a href="/api/login">/api/login</a> (login)</li>
                            <li>GET <a href="/api/dashboard">/api/dashboard</a> (requires auth)</li>
                            <li>GET <a href="/api/employees">/api/employees</a> (requires auth)</li>
                        </ul>
                        <p>Server listening on port ${PORT}.</p>
                    </body>
                </html>
        `);
});

// LOGIN
app.post('/api/login', (req: express.Request<{}, {}, LoginRequest>, res: Response) => {
    const { email, password } = req.body;
    const db = getDb();

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;

    if (!user || !bcrypt.compareSync(password, user.password)) {
        res.status(401).json({ error: 'Ungültige Anmeldedaten' });
        return;
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '8h' }
    );

    res.json({
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.first_name,
            lastName: user.last_name,
            createdAt: user.created_at
        }
    });
});

// GET DASHBOARD STATS
app.get('/api/dashboard', authenticateToken, (req: AuthRequest, res: Response) => {
    const db = getDb();

    const stats = db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins,
      SUM(CASE WHEN role = 'manager' THEN 1 ELSE 0 END) as managers,
      SUM(CASE WHEN role = 'employee' THEN 1 ELSE 0 END) as employees
    FROM users
  `).get() as any;

    const recentHires = db.prepare(`
    SELECT u.id, u.email, u.role, u.first_name, u.last_name, u.created_at,
           e.phone, e.department, e.position, e.start_date, e.salary
    FROM users u
    LEFT JOIN employees e ON u.id = e.user_id
    ORDER BY u.created_at DESC
    LIMIT 5
  `).all();

    res.json({
        totalEmployees: stats.total,
        totalAdmins: stats.admins,
        totalManagers: stats.managers,
        totalStaff: stats.employees,
        recentHires
    });
});

// GET ALL EMPLOYEES
app.get('/api/employees', authenticateToken, (req: AuthRequest, res: Response) => {
    const db = getDb();
    const employees = db.prepare(`
    SELECT u.id, u.email, u.role, u.first_name, u.last_name, u.created_at,
           e.phone, e.department, e.position, e.start_date, e.salary
    FROM users u
    LEFT JOIN employees e ON u.id = e.user_id
    ORDER BY u.created_at DESC
  `).all();

    res.json(employees);
});

// GET EMPLOYEE BY ID
app.delete('/api/employees/:id',
    authenticateToken,
    authorizeRoles(UserRole.ADMIN),
    (req: AuthRequest & express.Request<{ id: string }>, res: Response) => {
        const db = getDb();
        const userId = parseInt(req.params.id, 10);

        try {
            db.prepare('DELETE FROM users WHERE id = ?').run(userId);
            res.json({ message: 'Mitarbeiter gelöscht' });
        } catch (error) {
            res.status(500).json({ error: 'Fehler beim Löschen' });
        }
    });

// CREATE EMPLOYEE (nur Admin/Manager)
app.post('/api/employees',
    authenticateToken,
    authorizeRoles(UserRole.ADMIN, UserRole.MANAGER),
    (req: express.Request<{}, {}, CreateEmployeeRequest>, res: Response) => {
        const { email, password, role, firstName, lastName, phone, department, position, startDate, salary } = req.body;
        const db = getDb();

        try {
            const hashedPassword = bcrypt.hashSync(password, 10);

            const result = db.prepare(`
        INSERT INTO users (email, password, role, first_name, last_name)
        VALUES (?, ?, ?, ?, ?)
      `).run(email, hashedPassword, role, firstName, lastName);

            const userId = result.lastInsertRowid;

            if (phone || department || position || startDate || salary) {
                db.prepare(`
          INSERT INTO employees (user_id, phone, department, position, start_date, salary)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(userId, phone || null, department || null, position || null, startDate || null, salary || null);
            }

            const newEmployee = db.prepare(`
        SELECT u.id, u.email, u.role, u.first_name, u.last_name, u.created_at,
               e.phone, e.department, e.position, e.start_date, e.salary
        FROM users u
        LEFT JOIN employees e ON u.id = e.user_id
        WHERE u.id = ?
      `).get(userId);

            res.status(201).json(newEmployee);
        } catch (error: any) {
            if (error.message.includes('UNIQUE constraint failed')) {
                res.status(400).json({ error: 'E-Mail bereits vorhanden' });
            } else {
                res.status(500).json({ error: 'Fehler beim Erstellen des Mitarbeiters' });
            }
        }
    });

// UPDATE EMPLOYEE
app.put('/api/employees/:id',
    authenticateToken,
    authorizeRoles(UserRole.ADMIN, UserRole.MANAGER),
    (req: express.Request<{ id: string }, {}, UpdateEmployeeRequest>, res: Response) => {
        const { firstName, lastName, phone, department, position, startDate, salary, role } = req.body;
        const db = getDb();
        const userId = parseInt(req.params.id);

        try {
            // Update users table
            if (firstName || lastName || role) {
                const updates: string[] = [];
                const values: any[] = [];

                if (firstName) { updates.push('first_name = ?'); values.push(firstName); }
                if (lastName) { updates.push('last_name = ?'); values.push(lastName); }
                if (role) { updates.push('role = ?'); values.push(role); }

                values.push(userId);

                db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values);
            }

            // Update employees table
            if (phone || department || position || startDate || salary) {
                const empExists = db.prepare('SELECT id FROM employees WHERE user_id = ?').get(userId);

                if (empExists) {
                    const updates: string[] = [];
                    const values: any[] = [];

                    if (phone !== undefined) { updates.push('phone = ?'); values.push(phone); }
                    if (department !== undefined) { updates.push('department = ?'); values.push(department); }
                    if (position !== undefined) { updates.push('position = ?'); values.push(position); }
                    if (startDate !== undefined) { updates.push('start_date = ?'); values.push(startDate); }
                    if (salary !== undefined) { updates.push('salary = ?'); values.push(salary); }

                    values.push(userId);

                    db.prepare(`UPDATE employees SET ${updates.join(', ')} WHERE user_id = ?`).run(...values);
                } else {
                    db.prepare(`
            INSERT INTO employees (user_id, phone, department, position, start_date, salary)
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(userId, phone || null, department || null, position || null, startDate || null, salary || null);
                }
            }

            const updated = db.prepare(`
        SELECT u.id, u.email, u.role, u.first_name, u.last_name, u.created_at,
               e.phone, e.department, e.position, e.start_date, e.salary
        FROM users u
        LEFT JOIN employees e ON u.id = e.user_id
        WHERE u.id = ?
      `).get(userId);

            res.json(updated);
        } catch (error) {
            res.status(500).json({ error: 'Fehler beim Aktualisieren' });
        }
    });

// DELETE EMPLOYEE (nur Admin)
app.delete('/api/employees/:id',
    authenticateToken,
    authorizeRoles(UserRole.ADMIN),
    (req: AuthRequest & express.Request<{ id: string }>, res: Response) => {
        const db = getDb();

        try {
            const userId = parseInt(req.params.id, 10);
            db.prepare('DELETE FROM users WHERE id = ?').run(userId);
            res.json({ message: 'Mitarbeiter gelöscht' });
        } catch (error) {
            res.status(500).json({ error: 'Fehler beim Löschen' });
        }
    });

app.listen(PORT, () => {
    console.log(`🚀 HRFlow Server läuft auf http://localhost:${PORT}`);
});