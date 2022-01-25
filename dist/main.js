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
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const nocalhost_1 = require("./nocalhost");
async function run() {
    try {
        const url = core.getInput('url');
        const email = core.getInput('email');
        const password = core.getInput('password');
        const action = core.getInput('action');
        const serve = nocalhost_1.NocalhostServe.single({ url, email, password });
        await serve.call(action);
        process.exit(1);
    }
    catch (error) {
        if (process.env.CI) {
            if (error instanceof Error) {
                core.setFailed(error.message);
            }
        }
        else {
            console.error(error);
            process.exit(-1);
        }
    }
}
;
(async () => {
    await run();
})();
