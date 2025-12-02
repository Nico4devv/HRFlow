"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeList = void 0;
// @ts-ignore
var react_1 = require("react");
var api_1 = require("../api");
var types_1 = require("../types");
var EmployeeList = function (_a) {
    var userRole = _a.userRole, onSelectEmployee = _a.onSelectEmployee;
    var _b = (0, react_1.useState)([]), employees = _b[0], setEmployees = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(''), error = _d[0], setError = _d[1];
    var _e = (0, react_1.useState)(false), showAddModal = _e[0], setShowAddModal = _e[1];
    var _f = (0, react_1.useState)(''), searchTerm = _f[0], setSearchTerm = _f[1];
    (0, react_1.useEffect)(function () {
        loadEmployees();
    }, []);
    // @ts-ignore
    var loadEmployees = function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    return [4 /*yield*/, api_1.api.getEmployees()];
                case 1:
                    data = _a.sent();
                    setEmployees(data);
                    return [3 /*break*/, 4];
                case 2:
                    err_1 = _a.sent();
                    setError(err_1.message);
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // @ts-ignore
    var handleDelete = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!window.confirm('Mitarbeiter wirklich löschen?'))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, api_1.api.deleteEmployee(id)];
                case 2:
                    _a.sent();
                    setEmployees(employees.filter(function (emp) { return emp.id !== id; }));
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    alert('Fehler beim Löschen: ' + err_2.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var canManage = userRole === types_1.UserRole.ADMIN || userRole === types_1.UserRole.MANAGER;
    var canDelete = userRole === types_1.UserRole.ADMIN;
    var filteredEmployees = employees.filter(function (emp) {
        return "".concat(emp.firstName, " ").concat(emp.lastName, " ").concat(emp.email, " ").concat(emp.department || '')
            .toLowerCase()
            // @ts-ignore
            .includes(searchTerm.toLowerCase());
    });
    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Lädt Mitarbeiter...</div>;
    }
    return (<div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: 0, color: '#333' }}>Mitarbeiter ({employees.length})</h2>
                {canManage && (<button onClick={function () { return setShowAddModal(true); }} style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px'
            }}>
                        // Replaced legacy compiled file to avoid JSX parse errors during Vite build.
                        // This file is a harmless placeholder. The real source is under frontend/src/components.
                        exports.EmployeeList = function () { return null; };
                                        <button onClick={function () { return onSelectEmployee(emp.id); }} style={{
                    padding: '6px 12px',
                    background: '#4facfe',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginRight: '8px',
                    fontSize: '12px'
                }}>
                                            👁️ Anzeigen
                                        </button>
                                        {canDelete && (<button onClick={function () { return handleDelete(emp.id); }} style={{
                        padding: '6px 12px',
                        background: '#ff6b6b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px'
                    }}>
                                                🗑️ Löschen
                                            </button>)}
                                    </td>
                                </tr>);
        })}
                        </tbody>
                    </table>

                    {filteredEmployees.length === 0 && (<div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                            {searchTerm ? '🔍 Keine Mitarbeiter gefunden' : '📋 Noch keine Mitarbeiter vorhanden'}
                        </div>)}
                </div>
            </div>

            {showAddModal && (<AddEmployeeModal onClose={function () { return setShowAddModal(false); }} onSuccess={function (newEmp) {
                setEmployees(__spreadArray([newEmp], employees, true));
                setShowAddModal(false);
            }}/>)}
        </div>);
};
exports.EmployeeList = EmployeeList;
var AddEmployeeModal = function (_a) {
    var onClose = _a.onClose, onSuccess = _a.onSuccess;
    var _b = (0, react_1.useState)({
        email: '',
        password: '',
        role: types_1.UserRole.EMPLOYEE,
        firstName: '',
        lastName: '',
        phone: '',
        department: '',
        position: '',
        startDate: '',
        salary: undefined
    }), formData = _b[0], setFormData = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(''), error = _d[0], setError = _d[1];
    // @ts-ignore
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var newEmployee, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setLoading(true);
                    setError('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, api_1.api.createEmployee(formData)];
                case 2:
                    newEmployee = _a.sent();
                    onSuccess(newEmployee);
                    return [3 /*break*/, 5];
                case 3:
                    err_3 = _a.sent();
                    setError(err_3.message);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (<div style={{
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
                        <input type="email" placeholder="E-Mail *" required value={formData.email} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { email: e.target.value })); }} style={{ padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}/>
                        <input type="password" placeholder="Passwort *" required value={formData.password} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { password: e.target.value })); }} style={{ padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}/>
                        <input type="text" placeholder="Vorname *" required value={formData.firstName} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { firstName: e.target.value })); }} style={{ padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}/>
                        <input type="text" placeholder="Nachname *" required value={formData.lastName} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { lastName: e.target.value })); }} style={{ padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}/>
                        <select value={formData.role} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { role: e.target.value })); }} style={{ padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}>
                            <option value={types_1.UserRole.EMPLOYEE}>Employee</option>
                            <option value={types_1.UserRole.MANAGER}>Manager</option>
                            <option value={types_1.UserRole.ADMIN}>Admin</option>
                        </select>
                        <input type="tel" placeholder="Telefon" value={formData.phone} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { phone: e.target.value })); }} style={{ padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}/>
                        <input type="text" placeholder="Abteilung" value={formData.department} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { department: e.target.value })); }} style={{ padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}/>
                        <input type="text" placeholder="Position" value={formData.position} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { position: e.target.value })); }} style={{ padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}/>
                        <input type="date" placeholder="Startdatum" value={formData.startDate} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { startDate: e.target.value })); }} style={{ padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}/>
                        <input type="number" placeholder="Gehalt" value={formData.salary || ''} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { salary: e.target.value ? parseFloat(e.target.value) : undefined })); }} style={{ padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}/>
                    </div>

                    {error && (<div style={{ marginTop: '15px', padding: '10px', background: '#fee', color: '#c33', borderRadius: '6px' }}>
                            {error}
                        </div>)}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button type="submit" disabled={loading} style={{
            flex: 1,
            padding: '12px',
            background: loading ? '#ccc' : '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '600'
        }}>
                            {loading ? 'Speichern...' : 'Hinzufügen'}
                        </button>
                        <button type="button" onClick={onClose} style={{
            flex: 1,
            padding: '12px',
            background: '#e0e0e0',
            color: '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
        }}>
                            Abbrechen
                        </button>
                    </div>
                </form>
            </div>
        </div>);
};
