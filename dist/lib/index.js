"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParameters = void 0;
const assert_1 = __importDefault(require("assert"));
const core_1 = require("@actions/core");
function getParameters(required = false) {
    const parameters = process.env.CI ? ((0, core_1.getInput)("parameters")) : global.parameters;
    if (required) {
        (0, assert_1.default)(parameters, TypeError("input 'parameters' not found"));
    }
    return JSON.parse(parameters ?? '{}');
}
exports.getParameters = getParameters;
