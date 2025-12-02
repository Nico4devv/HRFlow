"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = exports.initDatabase = void 0;
// @ts-ignore
var better_sqlite3_1 = require("better-sqlite3");
// @ts-ignore
var bcryptjs_1 = require("bcryptjs");
var types_1 = require("./types");
var db;
var initDatabase = function () {
    db = new better_sqlite3_1('hrflow.db');
    // Users Tabelle
    db.exec("\n    CREATE TABLE IF NOT EXISTS users (\n      id INTEGER PRIMARY KEY AUTOINCREMENT,\n      email TEXT UNIQUE NOT NULL,\n      password TEXT NOT NULL,\n      role TEXT NOT NULL CHECK(role IN ('admin', 'manager', 'employee')),\n      first_name TEXT NOT NULL,\n      last_name TEXT NOT NULL,\n      created_at DATETIME DEFAULT CURRENT_TIMESTAMP\n    )\n  ");
    // Employees Tabelle (erweiterte Profildaten)
    db.exec("\n    CREATE TABLE IF NOT EXISTS employees (\n      id INTEGER PRIMARY KEY AUTOINCREMENT,\n      user_id INTEGER UNIQUE NOT NULL,\n      phone TEXT,\n      department TEXT,\n      position TEXT,\n      start_date DATE,\n      salary DECIMAL(10, 2),\n      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE\n    )\n  ");
    // Standard-Benutzer erstellen, falls noch keine existieren
    var userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
    if (userCount.count === 0) {
        var hashedPassword = bcryptjs_1.hashSync('admin123', 10);
        // Admin
        db.prepare("\n      INSERT INTO users (email, password, role, first_name, last_name)\n      VALUES (?, ?, ?, ?, ?)\n    ").run('admin@hrflow.de', hashedPassword, types_1.UserRole.ADMIN, 'Max', 'Mustermann');
        // Manager
        var managerPassword = bcryptjs_1.hashSync('manager123', 10);
        var managerId = db.prepare("\n      INSERT INTO users (email, password, role, first_name, last_name)\n      VALUES (?, ?, ?, ?, ?)\n    ").run('manager@hrflow.de', managerPassword, types_1.UserRole.MANAGER, 'Anna', 'Schmidt').lastInsertRowid;
        db.prepare("\n      INSERT INTO employees (user_id, phone, department, position, start_date, salary)\n      VALUES (?, ?, ?, ?, ?, ?)\n    ").run(managerId, '+49 151 12345678', 'Management', 'Team Manager', '2023-01-15', 65000);
        // Employee
        var empPassword = bcryptjs_1.hashSync('employee123', 10);
        var empId = db.prepare("\n      INSERT INTO users (email, password, role, first_name, last_name)\n      VALUES (?, ?, ?, ?, ?)\n    ").run('employee@hrflow.de', empPassword, types_1.UserRole.EMPLOYEE, 'Lisa', 'Müller').lastInsertRowid;
        db.prepare("\n      INSERT INTO employees (user_id, phone, department, position, start_date, salary)\n      VALUES (?, ?, ?, ?, ?, ?)\n    ").run(empId, '+49 152 87654321', 'IT', 'Software Developer', '2023-06-01', 55000);
        console.log('✅ Datenbank initialisiert mit Standard-Benutzern');
        console.log('📧 Admin: admin@hrflow.de / admin123');
        console.log('📧 Manager: manager@hrflow.de / manager123');
        console.log('📧 Employee: employee@hrflow.de / employee123');
    }
};
exports.initDatabase = initDatabase;
var getDb = function () {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
};
exports.getDb = getDb;
