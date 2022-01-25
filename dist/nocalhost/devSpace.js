"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.create = exports.deleteDevSpace = void 0;
const assert_1 = __importDefault(require("assert"));
const crypto_1 = __importDefault(require("crypto"));
const promises_1 = require("timers/promises");
const lodash_1 = require("lodash");
const core = __importStar(require("@actions/core"));
const lib_1 = require("../lib");
const cluster_1 = __importDefault(require("./cluster"));
async function create() {
    let cluster_id = 1;
    const condition = (0, lib_1.getParameters)();
    if (condition.clusterName) {
        const { clusterName } = condition;
        const info = await cluster_1.default.find(clusterName);
        (0, assert_1.default)(info, `cluster '${clusterName}' not found`);
        cluster_id = info.id;
    }
    const space_name = `test-${crypto_1.default
        .randomUUID()
        .replaceAll('-', '')
        .substring(0, 6)}`;
    const spaceInfo = await api.post('/v1/dev_space', {
        cluster_id,
        cluster_admin: 0,
        user_id: global.uid,
        space_name,
        space_resource_limit: null,
        dev_space_type: 3,
        virtual_cluster: { service_type: 'NodePort', version: '0.5.2', values: null }
    });
    const { id } = spaceInfo;
    await new Promise(async (resolve, reject) => {
        global.setTimeout(reject.bind(null, `Waiting for '${id}' completion timeout`), 3000000);
        await waitingForCompletion(id);
        resolve();
    });
    const { id: space_id, kubeconfig } = await get(id);
    core.setOutput('space_id', space_id);
    core.setOutput('kubeconfig', kubeconfig);
}
exports.create = create;
async function get(id) {
    return api.get(`/v1/dev_space/${id}/detail?user_id=${global.uid}`);
}
exports.get = get;
async function waitingForCompletion(id) {
    const getStatus = async () => {
        const data = await api.get('/v1/dev_space/status', {
            params: { ids: id }
        });
        return data[id].virtual_cluster.status;
    };
    while ((await getStatus()) !== 'Ready') {
        await (0, promises_1.setTimeout)(5000);
    }
}
async function deleteDevSpace() {
    const id = (0, lib_1.getParameters)(true);
    (0, assert_1.default)(id && (0, lodash_1.isNumber)(id), TypeError("'id' is not numeric type"));
    return api.delete(`/v1/dev_space/${id}`);
}
exports.deleteDevSpace = deleteDevSpace;
