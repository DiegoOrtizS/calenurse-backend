"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthHeader = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var checkAuthHeader = function (req, res, next) {
    var authHeader = req.headers.authorization;
    if (authHeader) {
        jsonwebtoken_1.default.verify(authHeader, process.env.JWT_SECRET, function (err, decode) {
            if (err) {
                res.status(401).json({ message: "Unauthorized" });
            }
            else {
                req.nurseId = decode.nurseId;
                next();
            }
        });
    }
    else {
        res.status(401).json({ message: "Unauthorized" });
    }
};
exports.checkAuthHeader = checkAuthHeader;
