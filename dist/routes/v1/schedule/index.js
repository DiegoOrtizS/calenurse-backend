"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var app_data_source_1 = require("../../../app-data-source");
var desired_shift_entity_1 = require("../../../entity/desired_shift.entity");
var typeorm_1 = require("typeorm");
var exceljs_1 = __importDefault(require("exceljs"));
var path = __importStar(require("path"));
var python_shell_1 = require("python-shell");
var dotenv_1 = require("dotenv");
var fs_1 = __importDefault(require("fs"));
var shift_enum_1 = require("../../../types/shift.enum");
var entity_1 = require("../../../entity");
var entity_2 = require("../../../entity");
(0, dotenv_1.config)();
var router = (0, express_1.Router)();
function obtenerFechasSemana() {
    var fechasSemana = [];
    var date = new Date();
    if (date.getDay() === 0) {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() - 6);
    }
    for (var i = 1; i <= 7; i++) {
        fechasSemana.push(new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + i));
    }
    return fechasSemana;
}
router.post("/make", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, day, evening, night, date, monday, sunday, desiredShiftRepository, nurseRepository, generatedShiftRepository, desiredShifts, ids_1, cont, i, desiredShift, sortedDesiredShifts, groupByNurse_1, excelRows, key, excelRow, i, desiredShift, workbook, worksheet, worksheet2, worksheet3, worksheetColumns, worksheetColumns2, worksheetColumns3, excelRows3, key, excelRow, i, desiredShift, exportPath, messages, schedule, fechasSemana, reverseIds, key, _b, _c, _d, _i, day_1, date_1, _e, _f, _g, _h, shift, shiftDate, i, nurseId, generatedShift, _j, error_1;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                _k.trys.push([0, 13, , 14]);
                _a = req.body, day = _a.day, evening = _a.evening, night = _a.night;
                date = new Date();
                if (date.getDay() === 0) {
                    date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() - 6);
                }
                monday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 1);
                sunday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 7);
                desiredShiftRepository = app_data_source_1.myDataSource.getRepository(desired_shift_entity_1.DesiredShift);
                nurseRepository = app_data_source_1.myDataSource.getRepository(entity_1.Nurse);
                generatedShiftRepository = app_data_source_1.myDataSource.getRepository(entity_2.GeneratedShift);
                return [4 /*yield*/, desiredShiftRepository.find({
                        where: {
                            date: (0, typeorm_1.Between)(monday, sunday)
                        },
                        relations: ["nurse"],
                        order: {
                            date: "ASC"
                        },
                    })];
            case 1:
                desiredShifts = _k.sent();
                if (desiredShifts.length === 0) {
                    res.status(404).json({ message: "No hay turnos deseados para el area seleccionada" });
                    return [2 /*return*/];
                }
                ids_1 = {};
                cont = 1;
                for (i = 0; i < desiredShifts.length; i++) {
                    desiredShift = desiredShifts[i];
                    if (ids_1[desiredShift.nurse.id.toString()] === undefined) {
                        ids_1[desiredShift.nurse.id.toString()] = cont;
                        cont++;
                    }
                }
                sortedDesiredShifts = desiredShifts.sort(function (a, b) {
                    return ids_1[a.nurse.id.toString()] - ids_1[b.nurse.id.toString()];
                });
                groupByNurse_1 = {};
                sortedDesiredShifts.forEach(function (desiredShift) {
                    if (groupByNurse_1[desiredShift.nurse.id.toString()] === undefined) {
                        groupByNurse_1[desiredShift.nurse.id.toString()] = [];
                    }
                    groupByNurse_1[desiredShift.nurse.id.toString()].push(desiredShift);
                });
                excelRows = [];
                // recorrer el objeto groupByNurse
                for (key in groupByNurse_1) {
                    excelRow = {};
                    excelRow["Enfermera"] = ids_1[key];
                    for (i = 0; i < 7; i++) {
                        desiredShift = groupByNurse_1[key][i];
                        switch (desiredShift.shift) {
                            case "day":
                                excelRow[(i + 1).toString()] = 1;
                                break;
                            case "evening":
                                excelRow[(i + 1).toString()] = 2;
                                break;
                            case "night":
                                excelRow[(i + 1).toString()] = 3;
                                break;
                            default:
                                excelRow[(i + 1).toString()] = 0;
                                break;
                        }
                    }
                    excelRows.push(excelRow);
                }
                workbook = new exceljs_1.default.Workbook();
                worksheet = workbook.addWorksheet('Turnos');
                worksheet2 = workbook.addWorksheet('EnfermerasPorTurno');
                worksheet3 = workbook.addWorksheet('DiasLibres');
                worksheetColumns = [
                    { header: 'Enfermera', key: 'Enfermera', width: 10 },
                    { header: '1', key: '1' },
                    { header: '2', key: '2' },
                    { header: '3', key: '3' },
                    { header: '4', key: '4' },
                    { header: '5', key: '5' },
                    { header: '6', key: '6' },
                    { header: '7', key: '7' },
                ];
                worksheetColumns2 = [
                    { header: 'Mañana', key: 'day' },
                    { header: 'Tarde', key: 'evening' },
                    { header: 'Noche', key: 'night' },
                ];
                worksheetColumns3 = [
                    { header: 'Enfermera', key: 'Enfermera', width: 10 },
                    { header: 'Dia Libre', key: 'day' }
                ];
                excelRows3 = [];
                for (key in groupByNurse_1) {
                    excelRow = {};
                    excelRow["Enfermera"] = ids_1[key];
                    for (i = 0; i < 7; i++) {
                        desiredShift = groupByNurse_1[key][i];
                        if (desiredShift.shift === "free") {
                            excelRow["day"] = i + 1;
                        }
                    }
                    excelRows3.push(excelRow);
                }
                worksheet.columns = worksheetColumns;
                worksheet2.columns = worksheetColumns2;
                worksheet3.columns = worksheetColumns3;
                worksheet.addRows(excelRows);
                worksheet2.addRow({ day: day, evening: evening, night: night });
                worksheet3.addRows(excelRows3);
                exportPath = path.resolve(__dirname, "nurses-".concat(new Date().getTime().toString(), ".xlsx"));
                return [4 /*yield*/, workbook.xlsx.writeFile(exportPath)];
            case 2:
                _k.sent();
                console.log("file exported", exportPath);
                return [4 /*yield*/, python_shell_1.PythonShell.run("".concat(process.env.IA_LOCATION), {
                        args: [exportPath]
                    })];
            case 3:
                messages = _k.sent();
                console.log(messages);
                schedule = JSON.parse(messages[0]);
                fs_1.default.unlinkSync(exportPath);
                fechasSemana = obtenerFechasSemana();
                reverseIds = {};
                for (key in ids_1) {
                    reverseIds[ids_1[key]] = key;
                }
                _b = schedule;
                _c = [];
                for (_d in _b)
                    _c.push(_d);
                _i = 0;
                _k.label = 4;
            case 4:
                if (!(_i < _c.length)) return [3 /*break*/, 12];
                _d = _c[_i];
                if (!(_d in _b)) return [3 /*break*/, 11];
                day_1 = _d;
                date_1 = fechasSemana[parseInt(day_1) - 1];
                _e = schedule[day_1];
                _f = [];
                for (_g in _e)
                    _f.push(_g);
                _h = 0;
                _k.label = 5;
            case 5:
                if (!(_h < _f.length)) return [3 /*break*/, 11];
                _g = _f[_h];
                if (!(_g in _e)) return [3 /*break*/, 10];
                shift = _g;
                shiftDate = shift_enum_1.Shift.FREE;
                switch (shift) {
                    case "1":
                        shiftDate = shift_enum_1.Shift.DAY;
                        break;
                    case "2":
                        shiftDate = shift_enum_1.Shift.EVENING;
                        break;
                    case "3":
                        shiftDate = shift_enum_1.Shift.NIGHT;
                        break;
                    default:
                        shiftDate = shift_enum_1.Shift.FREE;
                        break;
                }
                i = 0;
                _k.label = 6;
            case 6:
                if (!(i < schedule[day_1][shift].length)) return [3 /*break*/, 10];
                nurseId = reverseIds[schedule[day_1][shift][i]];
                generatedShift = new entity_2.GeneratedShift();
                _j = generatedShift;
                return [4 /*yield*/, nurseRepository.findOneById(nurseId)];
            case 7:
                _j.nurse = _k.sent();
                generatedShift.date = date_1;
                generatedShift.shift = shiftDate;
                return [4 /*yield*/, generatedShiftRepository.save(generatedShift)];
            case 8:
                _k.sent();
                _k.label = 9;
            case 9:
                i++;
                return [3 /*break*/, 6];
            case 10:
                _h++;
                return [3 /*break*/, 5];
            case 11:
                _i++;
                return [3 /*break*/, 4];
            case 12:
                res.status(200).json({ message: "success", data: "Se genero el horario correctamente" });
                return [3 /*break*/, 14];
            case 13:
                error_1 = _k.sent();
                if (error_1 instanceof Error) {
                    res.status(500).json({ message: "error", data: error_1.message });
                    return [2 /*return*/];
                }
                res.status(500).json({ message: "error", data: error_1 });
                return [3 /*break*/, 14];
            case 14: return [2 /*return*/];
        }
    });
}); });
router.get("/get-id-nurses", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var nurseRepository, nurses, ids, i, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                nurseRepository = app_data_source_1.myDataSource.getRepository(entity_1.Nurse);
                return [4 /*yield*/, nurseRepository.find()];
            case 1:
                nurses = _a.sent();
                ids = [];
                for (i = 0; i < nurses.length; i++) {
                    ids.push(nurses[i].id);
                }
                res.status(200).json({ message: "success", data: ids });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(500).json({ message: "error", data: error_2 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post("/generate-desired-sfhifts", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var identificadores, matrizEnfermeras, fechasSemana, _i, fechasSemana_1, fecha, desiredShiftRepository, nurseRepository, i, enfermeraId, j, desiredShift, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                identificadores = req.body.identificadores;
                matrizEnfermeras = [
                    [1, 3, 3, 3, 1, 0, 3, 2],
                    [2, 1, 1, 1, 1, 3, 3, 0],
                    [3, 3, 1, 2, 0, 3, 2, 2],
                    [4, 3, 1, 0, 1, 1, 2, 2],
                    [5, 0, 3, 1, 3, 1, 3, 3],
                    [6, 2, 1, 1, 1, 3, 0, 1],
                    [7, 3, 2, 1, 0, 2, 3, 3],
                    [8, 1, 0, 2, 1, 3, 1, 1],
                    [9, 3, 3, 1, 1, 2, 0, 2],
                    [10, 3, 1, 2, 2, 2, 3, 0],
                    [11, 3, 1, 3, 1, 0, 1, 1],
                    [12, 1, 1, 1, 3, 0, 2, 1],
                    [13, 2, 3, 0, 2, 2, 2, 1],
                    [14, 1, 1, 0, 1, 1, 3, 3],
                    [15, 2, 1, 1, 0, 1, 1, 3],
                    [16, 0, 2, 1, 2, 1, 3, 3],
                    [17, 1, 1, 0, 1, 3, 1, 3],
                    [18, 2, 3, 1, 1, 1, 0, 3],
                    [19, 3, 1, 2, 2, 2, 0, 3]
                ];
                fechasSemana = obtenerFechasSemana();
                for (_i = 0, fechasSemana_1 = fechasSemana; _i < fechasSemana_1.length; _i++) {
                    fecha = fechasSemana_1[_i];
                    console.log(fecha.toISOString().split('T')[0]);
                }
                desiredShiftRepository = app_data_source_1.myDataSource.getRepository(desired_shift_entity_1.DesiredShift);
                nurseRepository = app_data_source_1.myDataSource.getRepository(entity_1.Nurse);
                i = 0;
                _b.label = 1;
            case 1:
                if (!(i < matrizEnfermeras.length)) return [3 /*break*/, 7];
                enfermeraId = identificadores[matrizEnfermeras[i][0] - 1];
                j = 1;
                _b.label = 2;
            case 2:
                if (!(j < matrizEnfermeras[i].length)) return [3 /*break*/, 6];
                desiredShift = new desired_shift_entity_1.DesiredShift();
                _a = desiredShift;
                return [4 /*yield*/, nurseRepository.findOneById(enfermeraId)];
            case 3:
                _a.nurse = _b.sent();
                desiredShift.date = fechasSemana[j - 1];
                switch (matrizEnfermeras[i][j]) {
                    case 1:
                        desiredShift.shift = shift_enum_1.Shift.DAY;
                        break;
                    case 2:
                        desiredShift.shift = shift_enum_1.Shift.EVENING;
                        break;
                    case 3:
                        desiredShift.shift = shift_enum_1.Shift.NIGHT;
                        break;
                    default:
                        desiredShift.shift = shift_enum_1.Shift.FREE;
                        break;
                }
                return [4 /*yield*/, desiredShiftRepository.save(desiredShift)];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                j++;
                return [3 /*break*/, 2];
            case 6:
                i++;
                return [3 /*break*/, 1];
            case 7:
                res.json({ message: "success" });
                return [2 /*return*/];
        }
    });
}); });
exports.default = router;
