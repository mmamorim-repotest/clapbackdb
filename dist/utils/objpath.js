"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _o = function _o(obj) {
    return {
        obj,
        key(key) {
            return _o(obj[key]);
        }
    };
};
exports.default = _o;
