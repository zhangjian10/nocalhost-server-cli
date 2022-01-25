"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function list() {
    return await api.get('/v1/cluster');
}
async function find(name) {
    const data = await list();
    return data.find(item => item.name === name);
}
exports.default = { find };
