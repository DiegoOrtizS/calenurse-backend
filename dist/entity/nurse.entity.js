"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nurse = void 0;
var typeorm_1 = require("typeorm");
var bson_typings_1 = require("typeorm/driver/mongodb/bson.typings");
var area_entity_1 = require("./area.entity");
var user_entity_1 = require("./user.entity");
var desired_shift_entity_1 = require("./desired_shift.entity");
var Nurse = /** @class */ (function () {
    function Nurse() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
        __metadata("design:type", bson_typings_1.UUID)
    ], Nurse.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: false }),
        __metadata("design:type", String)
    ], Nurse.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", Number)
    ], Nurse.prototype, "age", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: false, unique: true }),
        __metadata("design:type", String)
    ], Nurse.prototype, "email", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: false, default: false }),
        __metadata("design:type", Boolean)
    ], Nurse.prototype, "isBoss", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return area_entity_1.Area; }, { eager: true, nullable: false }),
        (0, typeorm_1.JoinColumn)({ name: 'areaId' }),
        __metadata("design:type", area_entity_1.Area)
    ], Nurse.prototype, "area", void 0);
    __decorate([
        (0, typeorm_1.OneToOne)(function () { return user_entity_1.User; }, function (user) { return user.nurse; }),
        __metadata("design:type", user_entity_1.User)
    ], Nurse.prototype, "user", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return desired_shift_entity_1.DesiredShift; }, function (desiredShift) { return desiredShift.nurse; }),
        __metadata("design:type", Array)
    ], Nurse.prototype, "desiredShifts", void 0);
    Nurse = __decorate([
        (0, typeorm_1.Entity)()
    ], Nurse);
    return Nurse;
}());
exports.Nurse = Nurse;
