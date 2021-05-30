// import EventEmitter from 'events'
import ScriptLoader from './ScriptLoader';
import DataManagers from './managers/DataManagers';

class ScriptPrefixes {
    static ES: string = '$._ES_.';
}

class ESScripts {
    static TEST_HOST: string = `${ScriptPrefixes.ES}testHost`;
    static TEST_HOST_WITH_PARAMS: string = `${ScriptPrefixes.ES}testHostWithParams`;
    static START_EDIT: string = `${ScriptPrefixes.ES}startEdit`;
}

class ESScriptError extends Error {
    private script: string;
    private innerError: string | object | undefined;
    constructor(script: string, innerError?: string | object, message?: string) {
        super(message ?? 'Every second script error.');
        this.name = 'ESScriptError';
        this.script = script;

        if (innerError !== undefined) {
            this.innerError = innerError;
        }
    }
}

interface IScriptParameter {

}

interface IEverySecondScriptParameter extends IScriptParameter {

}

interface ITestHostWithParamsParameter extends IEverySecondScriptParameter {
    name: string;
}

interface IStartEditParameter extends IEverySecondScriptParameter {
    interval: number;
    clipsToMultipy: number;
    toEndOfTheVideo: boolean;
}

interface IScriptResult {
    data: string | object | undefined;
}

interface IScriptResultPayload<TResult extends IScriptResult = IScriptResult> {
    name: string | undefined;
    status: string;
    result: TResult | undefined;
    error: string | object | undefined;
}

interface IEverySecondScriptResult extends IScriptResult {

}

interface ITestHostWithArgsResult extends IEverySecondScriptResult {
    parameters: string;
}

/**
 * the main plugin session. This can enter the node modules as
 * well as the host
 *
 */
class Session {
    private static instance: Session;
    private _scriptLoader: ScriptLoader;
    private _managers: DataManagers;

    constructor() {
        if (Session.instance) {
            return Session.instance;
        }

        this.init();
        Session.instance = this;
    }

    get name(): string {
        return 'Session:: ';
    }

    get scriptLoader(): ScriptLoader {
        return this._scriptLoader;
    }

    get managers(): DataManagers {
        return this._managers;
    }

    async init(): Promise<void> {
        // init before everything so I can intercept console.log
        this.log('session is initing...');
        this._managers = new DataManagers();
        this.managers.init();
        this._scriptLoader = new ScriptLoader();
        // load jsx file dynamically
        this.log('loading the main jsx file');
        await this.scriptLoader.loadJSX('main.jsx');

        // some test
        await this.test();
        this.log('session is inited');
    }

    async test(): Promise<void> {
        try {
            const result = await this.evalScript(ESScripts.TEST_HOST);
            console.log(result);
        } catch (err) {
            console.error(err);
            console.log(JSON.stringify(err, null, 2));
        }
    }

    async testWithParams(): Promise<void> {
        const args: ITestHostWithParamsParameter = {
            name: 'tomer'
        };

        try {
            const result = this.evalScript<ITestHostWithParamsParameter, ITestHostWithArgsResult>(ESScripts.TEST_HOST_WITH_PARAMS, args);
            console.log(result);
        } catch (err) {
            console.error(err);
            console.log(JSON.stringify(err, null, 2));
        }
    }

    startEdit(params: IStartEditParameter): Promise<IScriptResultPayload> {
        return this.evalScript(ESScripts.START_EDIT, params);
    }

    private async evalScript<TParameter extends IScriptParameter | string | undefined = IScriptParameter, TResult extends IScriptResult = IScriptResult>(functionName: string, params?: TParameter): Promise<IScriptResultPayload<TResult>> {
        try {
            const result = await this.scriptLoader.evalScript(functionName, params);
            return JSON.parse(result) as IScriptResultPayload<TResult>;
        } catch (err) {
            if (typeof err === 'string') {
                const errObj = JSON.parse(err) as IScriptResultPayload;
                throw new ESScriptError(functionName, errObj.error);
            } else {
                throw new ESScriptError(functionName, err);
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

export default Session;
export {
    ESScriptError,
    IScriptParameter,
    ITestHostWithParamsParameter,
    IStartEditParameter,
    IScriptResult,
    IScriptResultPayload,
    IEverySecondScriptResult,
    ITestHostWithArgsResult
}
