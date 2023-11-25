import { Reporter } from '@playwright/test/reporter';
import { ClientSdk } from "@testquality/sdk";
import { TestCase } from "@playwright/test/types/testReporter";
import { CredsTQ, ConfigTQ } from "./types";
declare class PlaywrightReportSummary implements Reporter {
    private tqConfig;
    private tcRegex;
    private testlist;
    private resultList;
    private credsTQ;
    constructor(options?: {
        configFile?: string;
    });
    onTestEnd(test: TestCase): Promise<void>;
    onEnd(): Promise<void>;
    getClient(conf: ConfigTQ): ClientSdk;
    setupApi(client: ClientSdk, creds: CredsTQ): Promise<true | import("@testquality/sdk").ReturnToken>;
    login(client: ClientSdk, creds: CredsTQ): Promise<import("@testquality/sdk").ReturnToken>;
}
export default PlaywrightReportSummary;
//# sourceMappingURL=index.d.ts.map