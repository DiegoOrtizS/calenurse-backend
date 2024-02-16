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
exports.Area = void 0;
var typeorm_1 = require("typeorm");
var bson_typings_1 = require("typeorm/driver/mongodb/bson.typings");
var nurse_entity_1 = require("./nurse.entity");
var Area = /** @class */ (function () {
    function Area() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
        __metadata("design:type", bson_typings_1.UUID)
    ], Area.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Area.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return nurse_entity_1.Nurse; }, function (nurse) { return nurse.area; }),
        __metadata("design:type", Array)
    ], Area.prototype, "nurses", void 0);
    Area = __decorate([
        (0, typeorm_1.Entity)()
    ], Area);
    return Area;
}());
exports.Area = Area;
