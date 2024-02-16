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
exports.DesiredShift = void 0;
var typeorm_1 = require("typeorm");
var nurse_entity_1 = require("./nurse.entity");
var bson_typings_1 = require("typeorm/driver/mongodb/bson.typings");
var shift_enum_1 = require("../types/shift.enum");
var DesiredShift = /** @class */ (function () {
    function DesiredShift() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
        __metadata("design:type", bson_typings_1.UUID)
    ], DesiredShift.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return nurse_entity_1.Nurse; }, { nullable: false }),
        (0, typeorm_1.JoinColumn)({ name: "nurseId" }),
        __metadata("design:type", nurse_entity_1.Nurse)
    ], DesiredShift.prototype, "nurse", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: false }),
        __metadata("design:type", Date)
    ], DesiredShift.prototype, "date", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "enum",
            enum: shift_enum_1.Shift,
            nullable: false
        }),
        __metadata("design:type", String)
    ], DesiredShift.prototype, "shift", void 0);
    DesiredShift = __decorate([
        (0, typeorm_1.Entity)()
    ], DesiredShift);
    return DesiredShift;
}());
exports.DesiredShift = DesiredShift;
