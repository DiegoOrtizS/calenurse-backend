"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var schedule_1 = __importDefault(require("./schedule"));
var desired_schedule_1 = __importDefault(require("./desired-schedule"));
var auth_1 = __importDefault(require("./auth"));
var router = (0, express_1.Router)();
router.use("/schedule", schedule_1.default);
router.use("/desired-schedule", desired_schedule_1.default);
router.use("/auth", auth_1.default);
exports.default = router;
