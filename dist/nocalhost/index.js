"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NocalhostServe = void 0;
const axios_1 = __importDefault(require("axios"));
const user_1 = __importDefault(require("./user"));
const assert_1 = __importDefault(require("assert"));
class NocalhostServe {
    constructor(info) {
        this.info = info;
        const api = axios_1.default.create({ baseURL: info.url });
        api.interceptors.request.use(async (config) => {
            config.headers = config.headers ?? {};
            if (this.token) {
                config.headers['authorization'] = 'Bearer ' + this.token;
            }
            return config;
        });
        api.interceptors.response.use(async (response) => {
            if (response.data.code !== 0) {
                throw Error(JSON.stringify(response.data));
            }
            return response.data.data;
        });
        global.api = api;
    }
    async login() {
        this.token = await user_1.default.login(this.info);
        await user_1.default.getInfo();
    }
    static single(info) {
        return new NocalhostServe(info);
    }
    async call(str) {
        const [moduleName, action] = str.split('.');
        const module = require(`./${moduleName}`);
        (0, assert_1.default)(module && action in module, `'${str}' action not found`);
        await this.login();
        await module[action]();
    }
}
exports.NocalhostServe = NocalhostServe;
