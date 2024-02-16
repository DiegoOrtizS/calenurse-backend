"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app_data_source_1 = require("./app-data-source");
var v1_1 = __importDefault(require("./routes/v1"));
// establish database connection
app_data_source_1.myDataSource
    .initialize()
    .then(function (r) {
    console.log("Data Source has been initialized!");
    //return r.synchronize()
})
    /*.then((r) => {
        console.log("Data Source has been synchronized!")
    })*/
    .catch(function (err) {
    console.error("Error during Data Source initialization:", err);
});
// create and setup express app
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/v1", v1_1.default);
// start express server
app.listen(3000);
