"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
const fs = __importStar(require("fs"));
const console = __importStar(require("console"));
const sdk_1 = require("@testquality/sdk");
class PlaywrightReportSummary {
    constructor(options = {}) {
        this.tcRegex = /@TC\d+/g;
        this.testlist = [];
        this.resultList = [];
        if (!options.configFile) {
            throw new Error('configFile is required');
        }
        //@todo need to use secret for CI
        this.tqConfig = JSON.parse(fs.readFileSync(options.configFile).toString());
        this.credsTQ = {
            email: this.tqConfig.email,
            password: this.tqConfig.password,
        };
    }
    async onTestEnd(test) {
        this.testlist.push({
            "test": test.title,
            "location": test.location.file,
            "runResult": test.results[test.results.length - 1].status,
            "tag": (test.title.match(this.tcRegex) || []).map(t => t.substring(3))
        });
    }
    async onEnd() {
        const clientTQ = await this.getClient(this.tqConfig);
        await this.setupApi(clientTQ, this.credsTQ);
        for (const test of this.testlist) {
            const data = {
                test: test.test,
                location: test.location,
                runResult: test.runResult,
                tag: test.tag,
            };
            if (test.tag.length > 1) {
                data.decision = 'Only one tag with test id is allowed';
                data.setStatusInTQ = 'Skip';
                this.resultList.push(data);
                continue;
            }
            if (test.tag.length == 0) {
                data.decision = 'Need to add tag TCxxxx';
                data.setStatusInTQ = 'Skip';
                this.resultList.push(data);
                continue;
            }
            if (test.runResult === 'skipped') {
                data.decision = 'Test skipped';
                data.setStatusInTQ = 'Skip';
                this.resultList.push(data);
                continue;
            }
            if (test.tag.length == 1) {
                const key = parseInt(test.tag[0]);
                data.decision = 'todo';
                //tee.setStatusInTQ = 'Pass'
                //this.badTest.push(tee)
                //
                console.log(`tag TC${key}`);
                try {
                    const testId = (await (0, sdk_1.testGetMany)({ api: clientTQ.api, params: { key: key } })).data[0].id;
                    console.log('testId ', testId);
                    const resultRun = await (0, sdk_1.runResultGetMany)({
                        api: clientTQ.api,
                        params: { run_id: this.tqConfig.runIdTQ, per_page: 3, test_id: testId }
                    });
                    if (resultRun.data.length === 0) {
                        try {
                            throw Error(`Test TC${key} not found in run ${this.tqConfig.runIdTQ}`);
                        }
                        catch (e) {
                            // @ts-ignore
                            console.log('Error ', e.message);
                        }
                        //return;
                    }
                    console.log('resultRun ', resultRun.data[0].id);
                    const steps = await (0, sdk_1.runResultStepGetMany)({
                        api: clientTQ.api,
                        params: { run_result_id: resultRun.data[0].id, per_page: 15 }
                    });
                    // console.log(steps.data[0].id);
                    if (test.runResult === 'passed') {
                        for (const step of steps.data) {
                            console.log('start set to step.id ', step.id, ' result ', this.tqConfig.passTQid, ' for test ', testId, ' run ', resultRun.data[0].id);
                            await (0, sdk_1.runResultStepUpdateOne)(step.id, { 'status_id': this.tqConfig.passTQid, }, { api: clientTQ.api });
                        }
                        //@todo check final status
                        console.log('passed');
                    }
                    else {
                        await (0, sdk_1.runResultStepUpdateOne)(steps.data[0].id, { 'status_id': this.tqConfig.failTQid, }, { api: clientTQ.api });
                        //@todo check final status
                    }
                }
                catch (e) {
                    console.log('Error ', e);
                }
                //@todo add logic for check test result in TQ
            }
            this.resultList.push(data);
        }
        //@todo add logic for save result to file
    }
    getClient(conf) {
        return new sdk_1.ClientSdk({
            clientId: conf.clientId,
            clientSecret: conf.clientSecret,
            baseUrl: conf.baseUrl,
        });
    }
    async setupApi(client, creds) {
        try {
            return this.login(client, creds);
        }
        catch (err) {
            console.log('Error logging in:', err);
        }
        return true;
    }
    async login(client, creds) {
        if (creds.email === undefined) {
            throw Error('Email must be specified');
        }
        if (creds.password === undefined) {
            throw Error('Password must be specified');
        }
        return client.getAuth().login(creds.email, creds.password, false);
    }
}
exports.default = PlaywrightReportSummary;
//# sourceMappingURL=index.js.map