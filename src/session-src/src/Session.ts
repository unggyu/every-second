// import EventEmitter from 'events'
import ScriptLoader from './ScriptLoader';
import DataManagers from './managers/DataManagers';

class ScriptPrefixes {
    static ES: string = '$._ES_.';
}

class ESScripts {
    static TEST_HOST: string = `${ScriptPrefixes.ES}testHost`;
    static TEST_HOST_WITH_PARAMS: string = `${ScriptPrefixes.ES}testHostWithParam`;
    static GET_PROJECT_ITEMS: string = `${ScriptPrefixes.ES}getProjectItems`;
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

interface ITestHostWithParamsParameter {
    name: string;
}

interface IStartEditParameter {
    interval: number;
    clipsToMultipy: number;
    toEndOfTheVideo: boolean;
}

interface IScriptResultPayload<TResult = undefined> {
    name: string | undefined;
    status: string;
    result: TResult | undefined;
    error: string | object | undefined;
}

interface ITestHostWithArgsResult {
    parameters: string;
    data: string;
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
            const result = await this.evalFunction(ESScripts.TEST_HOST);
            console.log(result);
        } catch (err) {
            console.error(err);
            console.log(JSON.stringify(err, null, 2));
        }
    }

    async testWithParam(): Promise<void> {
        const param: ITestHostWithParamsParameter = {
            name: 'tomer'
        };

        try {
            const result = this.evalFunction<ITestHostWithParamsParameter, ITestHostWithArgsResult>(ESScripts.TEST_HOST_WITH_PARAMS, param);
            console.log(result);
        } catch (err) {
            console.error(err);
            console.log(JSON.stringify(err, null, 2));
        }
    }

    getProjectItems(): Promise<IScriptResultPayload<ProjectItemCollection>> {
        return this.evalFunction<undefined, ProjectItemCollection>(ESScripts.GET_PROJECT_ITEMS);
    }

    startEdit(params: IStartEditParameter): Promise<IScriptResultPayload> {
        return this.evalFunction(ESScripts.START_EDIT, params);
    }

    private async evalFunction<TParameter extends string | object | undefined = undefined, TResult = undefined>(functionName: string, params?: TParameter): Promise<IScriptResultPayload<TResult>> {
        try {
            const result = await this.scriptLoader.evalFunction(functionName, params);
            return JSON.parse(result) as IScriptResultPayload<TResult>;
        } catch (err) {
            if (typeof err === 'string') {
                var errObj: IScriptResultPayload<TResult>;
                try {
                    errObj = JSON.parse(err);
                    throw new ESScriptError(functionName, errObj);
                } catch (err2) {
                    throw new ESScriptError(functionName, err);
                }
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
    ITestHostWithParamsParameter,
    IStartEditParameter,
    IScriptResultPayload,
    ITestHostWithArgsResult
}
