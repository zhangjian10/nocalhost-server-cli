"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInfo = exports.login = void 0;
async function login(info) {
    const data = await api.post('/v1/login', info);
    return data.token;
}
exports.login = login;
async function getInfo() {
    const { id } = await api.get('/v1/me');
    global.uid = id;
}
exports.getInfo = getInfo;
exports.default = { getInfo, login };
