"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const _log = {
    ok: (text) => {
        console.log(colors_1.default.green(text));
    },
    err: (text) => {
        console.log(colors_1.default.red(text));
    },
    warn: (text) => {
        console.log(colors_1.default.yellow(text));
    }
};
exports.default = _log;
