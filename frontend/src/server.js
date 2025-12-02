"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var express_1 = require("express");
// @ts-ignore
var cors_1 = require("cors");
// @ts-ignore
var bcryptjs_1 = require("bcryptjs");
// @ts-ignore
var jsonwebtoken_1 = require("jsonwebtoken");
// @ts-ignore
var database_1 = require("./database");
// @ts-ignore
var auth_1 = require("./auth");
// @ts-ignore
var types_1 = require("./types");
var app = express_1();
var PORT = 9999;
app.use(cors_1());
app.use(express_1.json());
(0, database_1.initDatabase)();
// LOGIN
app.post('/api/login', function (req, res) {
    var _a = req.body, email = _a.email, password = _a.password;
    var db = (0, database_1.getDb)();
    var user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || !bcryptjs_1.compareSync(password, user.password)) {
        res.status(401).json({ error: 'Ungültige Anmeldedaten' });
        return;
    }
    var token = jsonwebtoken_1.sign({ id: user.id, email: user.email, role: user.role }, auth_1.JWT_SECRET, { expiresIn: '8h' });
    res.json({
        token: token,
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
app.get('/api/dashboard', auth_1.default, function (req, res) {
    var db = (0, database_1.getDb)();
    var stats = db.prepare("\n    SELECT \n      COUNT(*) as total,\n      SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins,\n      SUM(CASE WHEN role = 'manager' THEN 1 ELSE 0 END) as managers,\n      SUM(CASE WHEN role = 'employee' THEN 1 ELSE 0 END) as employees\n    FROM users\n  ").get();
    var recentHires = db.prepare("\n    SELECT u.id, u.email, u.role, u.first_name, u.last_name, u.created_at,\n           e.phone, e.department, e.position, e.start_date, e.salary\n    FROM users u\n    LEFT JOIN employees e ON u.id = e.user_id\n    ORDER BY u.created_at DESC\n    LIMIT 5\n  ").all();
    res.json({
        totalEmployees: stats.total,
        totalAdmins: stats.admins,
        totalManagers: stats.managers,
        totalStaff: stats.employees,
        recentHires: recentHires
    });
});
// GET ALL EMPLOYEES
app.get('/api/employees', auth_1.default, function (req, res) {
    var db = (0, database_1.getDb)();
    var employees = db.prepare("\n    SELECT u.id, u.email, u.role, u.first_name, u.last_name, u.created_at,\n           e.phone, e.department, e.position, e.start_date, e.salary\n    FROM users u\n    LEFT JOIN employees e ON u.id = e.user_id\n    ORDER BY u.created_at DESC\n  ").all();
    res.json(employees);
});
// GET EMPLOYEE BY ID
app.delete('/api/employees/:id', auth_1.default, (0, auth_1.authorizeRoles)(types_1.UserRole.ADMIN), function (req, res) {
    var db = (0, database_1.getDb)();
    var userId = parseInt(req.params.id, 10);
    try {
        db.prepare('DELETE FROM users WHERE id = ?').run(userId);
        res.json({ message: 'Mitarbeiter gelöscht' });
    }
    catch (error) {
        res.status(500).json({ error: 'Fehler beim Löschen' });
    }
});
// CREATE EMPLOYEE (nur Admin/Manager)
app.post('/api/employees', auth_1.default, (0, auth_1.authorizeRoles)(types_1.UserRole.ADMIN, types_1.UserRole.MANAGER), function (req, res) {
    var _a = req.body, email = _a.email, password = _a.password, role = _a.role, firstName = _a.firstName, lastName = _a.lastName, phone = _a.phone, department = _a.department, position = _a.position, startDate = _a.startDate, salary = _a.salary;
    var db = (0, database_1.getDb)();
    try {
        var hashedPassword = bcryptjs_1.hashSync(password, 10);
        var result = db.prepare("\n        INSERT INTO users (email, password, role, first_name, last_name)\n        VALUES (?, ?, ?, ?, ?)\n      ").run(email, hashedPassword, role, firstName, lastName);
        var userId = result.lastInsertRowid;
        if (phone || department || position || startDate || salary) {
            db.prepare("\n          INSERT INTO employees (user_id, phone, department, position, start_date, salary)\n          VALUES (?, ?, ?, ?, ?, ?)\n        ").run(userId, phone || null, department || null, position || null, startDate || null, salary || null);
        }
        var newEmployee = db.prepare("\n        SELECT u.id, u.email, u.role, u.first_name, u.last_name, u.created_at,\n               e.phone, e.department, e.position, e.start_date, e.salary\n        FROM users u\n        LEFT JOIN employees e ON u.id = e.user_id\n        WHERE u.id = ?\n      ").get(userId);
        res.status(201).json(newEmployee);
    }
    catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            res.status(400).json({ error: 'E-Mail bereits vorhanden' });
        }
        else {
            res.status(500).json({ error: 'Fehler beim Erstellen des Mitarbeiters' });
        }
    }
});
// UPDATE EMPLOYEE
app.put('/api/employees/:id', auth_1.default, (0, auth_1.authorizeRoles)(types_1.UserRole.ADMIN, types_1.UserRole.MANAGER), function (req, res) {
    var _a, _b;
    var _c = req.body, firstName = _c.firstName, lastName = _c.lastName, phone = _c.phone, department = _c.department, position = _c.position, startDate = _c.startDate, salary = _c.salary, role = _c.role;
    var db = (0, database_1.getDb)();
    var userId = parseInt(req.params.id);
    try {
        // Update users table
        if (firstName || lastName || role) {
            var updates = [];
            var values = [];
            if (firstName) {
                updates.push('first_name = ?');
                values.push(firstName);
            }
            if (lastName) {
                updates.push('last_name = ?');
                values.push(lastName);
            }
            if (role) {
                updates.push('role = ?');
                values.push(role);
            }
            values.push(userId);
            (_a = db.prepare("UPDATE users SET ".concat(updates.join(', '), " WHERE id = ?"))).run.apply(_a, values);
        }
        // Update employees table
        if (phone || department || position || startDate || salary) {
            var empExists = db.prepare('SELECT id FROM employees WHERE user_id = ?').get(userId);
            if (empExists) {
                var updates = [];
                var values = [];
                if (phone !== undefined) {
                    updates.push('phone = ?');
                    values.push(phone);
                }
                if (department !== undefined) {
                    updates.push('department = ?');
                    values.push(department);
                }
                if (position !== undefined) {
                    updates.push('position = ?');
                    values.push(position);
                }
                if (startDate !== undefined) {
                    updates.push('start_date = ?');
                    values.push(startDate);
                }
                if (salary !== undefined) {
                    updates.push('salary = ?');
                    values.push(salary);
                }
                values.push(userId);
                (_b = db.prepare("UPDATE employees SET ".concat(updates.join(', '), " WHERE user_id = ?"))).run.apply(_b, values);
            }
            else {
                db.prepare("\n            INSERT INTO employees (user_id, phone, department, position, start_date, salary)\n            VALUES (?, ?, ?, ?, ?, ?)\n          ").run(userId, phone || null, department || null, position || null, startDate || null, salary || null);
            }
        }
        var updated = db.prepare("\n        SELECT u.id, u.email, u.role, u.first_name, u.last_name, u.created_at,\n               e.phone, e.department, e.position, e.start_date, e.salary\n        FROM users u\n        LEFT JOIN employees e ON u.id = e.user_id\n        WHERE u.id = ?\n      ").get(userId);
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: 'Fehler beim Aktualisieren' });
    }
});
// DELETE EMPLOYEE (nur Admin)
app.delete('/api/employees/:id', auth_1.default, (0, auth_1.authorizeRoles)(types_1.UserRole.ADMIN), function (req, res) {
    var db = (0, database_1.getDb)();
    try {
        var userId = parseInt(req.params.id, 10);
        db.prepare('DELETE FROM users WHERE id = ?').run(userId);
        res.json({ message: 'Mitarbeiter gelöscht' });
    }
    catch (error) {
        res.status(500).json({ error: 'Fehler beim Löschen' });
    }
});
app.listen(PORT, function () {
    console.log("\uD83D\uDE80 HRFlow Server l\u00E4uft auf http://localhost:".concat(PORT));
});
