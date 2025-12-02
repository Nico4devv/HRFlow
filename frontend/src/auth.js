"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.JWT_SECRET = void 0;
// @ts-ignore
var jsonwebtoken_1 = require("jsonwebtoken");
// @ts-ignore
exports.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
var authenticateToken = function (req, res, next) {
    // @ts-ignore
    var authHeader = req.headers['authorization'];
    var token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Kein Token bereitgestellt' });
        return;
    }
    try {
        var decoded = jsonwebtoken_1.verify(token, exports.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(403).json({ error: 'Ungültiger Token' });
    }
};
exports.default = authenticateToken;
var authorizeRoles = function () {
    var allowedRoles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        allowedRoles[_i] = arguments[_i];
    }
    return function (req, res, next) {
        if (!req.user) {
            res.status(401).json({ error: 'Nicht authentifiziert' });
            return;
        }
        // @ts-ignore
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                error: 'Keine Berechtigung für diese Aktion',
                required: allowedRoles,
                current: req.user.role
            });
            return;
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
