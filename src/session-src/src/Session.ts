// import EventEmitter from 'events'
import ScriptLoader from './ScriptLoader';
import DataManagers from './managers/DataManagers';

class ScriptPrefixes {
    static ES: string = '$._ES_.';
}

class ESScripts {
    static TEST_HOST: string = `${ScriptPrefixes.ES}test_host`;
    static TEST_HOST_WITH_ARGS: string = `${ScriptPrefixes.ES}test_host_with_args`;
    static START_EDIT: string = `${ScriptPrefixes.ES}start_edit`;
}

export class ESScriptError extends Error {
    private script: string;
    private innerError: string | object | undefined;
    constructor(script: string, message?: string, innerError?: string | object) {
        super(message ?? 'Every second script error.');
        this.name = 'ESScriptError';
        this.script = script;

        if (innerError !== undefined) {
            this.innerError = innerError;
        }
    }
}

export interface IScriptParameter {

}

export interface IEverySecondScriptParameter extends IScriptParameter {

}

export interface ITestHostWithArgsParameter extends IEverySecondScriptParameter {
    name: string;
}

export interface IStartEditParameter extends IEverySecondScriptParameter {
    interval: number;
    clipsToMultipy: number;
    toEndOfTheVideo: boolean;
}

export interface IScriptResult {
    data: string | object | undefined;
}

export interface IScriptResultPayload<TResult extends IScriptResult = IScriptResult> {
    name: string | undefined;
    status: string;
    result: TResult | undefined;
    error: string | object | undefined;
}

export interface IEverySecondScriptResult extends IScriptResult {

}

export interface ITestHostWithArgsResult extends IEverySecondScriptResult {
    parameters: string;
}

/**
 * the main plugin session. This can enter the node modules as
 * well as the host
 *
 */
export default class Session {
    private static instance: Session;
    private scriptLoader: ScriptLoader;
    private managers: DataManagers;
    private name: string;

    constructor() {
        if (Session.instance) {
            return Session.instance;
        }

        this.init();
        Session.instance = this;
        this.name = 'Session:: ';
    }

    init(): void {
        // init before everything so I can intercept console.log
        this.log('session is initing...');
        this.managers = new DataManagers();
        this.managers.init();
        this.scriptLoader = new ScriptLoader();
        // load jsx file dynamically
        this.log('loading the main jsx file');
        this.scriptLoader.loadJSX('main.jsx');


        // some test
        this.test();

        this.log('session is inited');
    }

    test(): Promise<IScriptResultPayload | undefined> {
        return this.evalScript(ESScripts.TEST_HOST);
    }

    testWithArgs(): Promise<IScriptResultPayload<ITestHostWithArgsResult> | undefined> {
        const args: ITestHostWithArgsParameter = {
            name: 'tomer'
        };

        return this.evalScript<ITestHostWithArgsParameter, ITestHostWithArgsResult>(ESScripts.TEST_HOST_WITH_ARGS, args);
    }

    startEdit(params: IStartEditParameter): Promise<IScriptResultPayload | undefined> {
        return this.evalScript(ESScripts.START_EDIT, params);
    }

    private async evalScript<TParameter extends IScriptParameter | string | undefined = IScriptParameter, TResult extends IScriptResult = IScriptResult>(functionName: string, params?: TParameter): Promise<IScriptResultPayload<TResult> | undefined> {
        try {
            const result = await this.scriptLoader.evalScript(functionName, params);
            return JSON.parse(result) as IScriptResultPayload<TResult>;
        } catch (err) {
            if (err === 'string') {
                const errObj = JSON.parse(err) as IScriptResultPayload;
                throw new ESScriptError(functionName, undefined, errObj.error);
            }
        }
    }

    /**
     * log some info with session prefix
     *
     * @param  {string} val what to log
     */
    private log(val: string): void {
        console.log(`${this.name} ${val}`)
    }
}
