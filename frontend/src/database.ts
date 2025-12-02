// @ts-ignore
import Database from 'better-sqlite3';
// @ts-ignore
import bcrypt from 'bcryptjs';
import { UserRole } from './types';

let db: Database.Database;

export const initDatabase = (): void => {
    db = new Database('hrflow.db');

    // Users Tabelle
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'manager', 'employee')),
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Employees Tabelle (erweiterte Profildaten)
    db.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      phone TEXT,
      department TEXT,
      position TEXT,
      start_date DATE,
      salary DECIMAL(10, 2),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

    // Standard-Benutzer erstellen, falls noch keine existieren
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };

    if (userCount.count === 0) {
        const hashedPassword = bcrypt.hashSync('admin123', 10);

        // Admin
        db.prepare(`
      INSERT INTO users (email, password, role, first_name, last_name)
      VALUES (?, ?, ?, ?, ?)
    `).run('admin@hrflow.de', hashedPassword, UserRole.ADMIN, 'Max', 'Mustermann');

        // Manager
        const managerPassword = bcrypt.hashSync('manager123', 10);
        const managerId = db.prepare(`
      INSERT INTO users (email, password, role, first_name, last_name)
      VALUES (?, ?, ?, ?, ?)
    `).run('manager@hrflow.de', managerPassword, UserRole.MANAGER, 'Anna', 'Schmidt').lastInsertRowid;

        db.prepare(`
      INSERT INTO employees (user_id, phone, department, position, start_date, salary)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(managerId, '+49 151 12345678', 'Management', 'Team Manager', '2023-01-15', 65000);

        // Employee
        const empPassword = bcrypt.hashSync('employee123', 10);
        const empId = db.prepare(`
      INSERT INTO users (email, password, role, first_name, last_name)
      VALUES (?, ?, ?, ?, ?)
    `).run('employee@hrflow.de', empPassword, UserRole.EMPLOYEE, 'Lisa', 'Müller').lastInsertRowid;

        db.prepare(`
      INSERT INTO employees (user_id, phone, department, position, start_date, salary)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(empId, '+49 152 87654321', 'IT', 'Software Developer', '2023-06-01', 55000);

        console.log('✅ Datenbank initialisiert mit Standard-Benutzern');
        console.log('📧 Admin: admin@hrflow.de / admin123');
        console.log('📧 Manager: manager@hrflow.de / manager123');
        console.log('📧 Employee: employee@hrflow.de / employee123');
    }
};

export const getDb = (): Database.Database => {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
};