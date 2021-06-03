// import EventEmitter from 'events'
import ScriptLoader from './ScriptLoader';
import DataManagers from './managers/DataManagers';

let SCRIPT_PREFIX_ES = '$._ES_.';

class ESScriptError<TInnerError = undefined> extends Error {
    private script: string;
    private innerError: TInnerError | undefined;
    constructor(script: string, innerError?: TInnerError, message?: string) {
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

interface IAlertParameter {
    message: string;
    decorator: 'info' | 'warning' | 'error'
}

interface IStartEditParameter {
    /**
     * Gap between clips (seconds)
     */
    interval: number;

    /**
     * Number of clips to inject
     */
    injectCount: number;

    /**
     * Until the end of the clip
     */
    untilEndOfClip: boolean;

    /**
     * Whether to trim the last part of the injected clip
     */
    trimEnd: boolean;
}

interface IScriptResultPayload<TResult = undefined> {
    status: string;
    script?: string;
    result?: TResult;
    error?: object;
}

interface ITestHostWithParamResult {
    parameter: string;
    data: string;
}

interface IIsEditableResult {
    isEditable: boolean;
    reason: string;
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

    public get name(): string {
        return 'Session:: ';
    }

    public get scriptLoader(): ScriptLoader {
        return this._scriptLoader;
    }

    public get managers(): DataManagers {
        return this._managers;
    }

    public get success(): string {
        return 'success';
    }

    public get failure(): string {
        return 'failure';
    }

    public async init(): Promise<void> {
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

    public async test(): Promise<void> {
        try {
            const functionName = this.attachPrefix('testHost');
            const result = await this.evalFunction(functionName);
            console.log(result);
        } catch (err) {
            console.error(err);
        }
    }

    public async testWithParam(): Promise<void> {
        const param: ITestHostWithParamsParameter = {
            name: 'tomer'
        };

        try {
            const functionName = this.attachPrefix('testHostWithParam');
            const result = await this.evalFunction<ITestHostWithParamsParameter, ITestHostWithParamResult>(functionName, param);
            console.log(result);
        } catch (err) {
            console.error(err);
        }
    }

    public alert(param: IAlertParameter): Promise<IScriptResultPayload> {
        const functionName = this.attachPrefix('alert');
        return this.evalFunction(functionName, param);
    }

    public isEditable(): Promise<IScriptResultPayload<IIsEditableResult>> {
        const functionName = this.attachPrefix('isEditable');
        return this.evalFunction(functionName);
    }

    public startEdit(param: IStartEditParameter): Promise<IScriptResultPayload> {
        const functionName = this.attachPrefix('startEdit');
        return this.evalFunction(functionName, param);
    }

    private async evalFunction<TParameter extends number | string | object | undefined = undefined, TResult = undefined>(functionName: string, param?: TParameter): Promise<IScriptResultPayload<TResult>> {
        const script = this.scriptLoader.makeEvalFunctionScript(functionName, param, false);
        try {
            const resultStr = await this.scriptLoader.evalFunction(functionName, param);
            const result: IScriptResultPayload<TResult> = JSON.parse(resultStr);
            result.script = script;
            return result;
        } catch (err) {
            if (typeof err === 'string') {
                var errPayload: IScriptResultPayload;

                try {
                    errPayload = JSON.parse(err);
                    errPayload.script = script;
                } catch (err2) {
                    throw new ESScriptError(script, err);
                }

                throw new ESScriptError(script, errPayload.error);
            } else {
                throw new ESScriptError(script, err);
            }
        }
    }

    private attachPrefix(functionName: string): string {
        return SCRIPT_PREFIX_ES + functionName;
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
    IAlertParameter,
    IStartEditParameter,
    IScriptResultPayload,
    ITestHostWithParamResult
}
