import path from 'path';

declare global {
    interface SystemPath extends Function {
        USER_DATA: string;
        COMMON_FILES: string;
        MY_DOCUMENTS: string;
        APPLICATION: string;
        EXTENSION: string;
        HOST_APPLICATION: string;
    }

    class CSInterface extends Function {
        getSystemPath(path: string): string;
        evalScript(script: string, callback: (res: string) => void): void;
    }

    const SystemPath: SystemPath;
}

/**
 * load jsx scripts dynamically
 */
class ScriptLoader {
    private static instance: ScriptLoader;
    private _csInterface: CSInterface;

    constructor() {
        if (ScriptLoader.instance) {
            return ScriptLoader.instance;
        }

        this._csInterface = new CSInterface();

        ScriptLoader.instance = this;
    }

    get name(): string {
        return 'ScriptLoader:: ';
    }

    get csInterface(): CSInterface {
        return this._csInterface;
    }

    /**
     * loadJSX - load a jsx file dynamically, this
     * will also load all of it's includes which is desirable
     *
     * @param fileName the file name
     * @return description
     */
    public async loadJSX(fileName: string): Promise<string> {
        const extensionRoot = path.join(this.csInterface.getSystemPath(SystemPath.EXTENSION), 'host');
        try {
            const result = await this.evalFunction('$._ext.evalFile', path.join(extensionRoot, fileName));
            console.log(JSON.parse(result));
            return result;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    public evalFunction(functionName: string, params?: string | object): Promise<string> {
        const script = this.makeEvalFunctionScript(functionName, params);
        this.log('script: ' + this.makeEvalFunctionScript(functionName, params, false));

        return this.evalScript(script);
    }

    public evalScript(script: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.csInterface.evalScript(script, (res) => {
                res = decodeURIComponent(res);
                if (res.toLowerCase().indexOf('error') === -1) {
                    resolve(res);
                } else {
                    reject(res);
                }
            });
        });
    }

    private makeEvalFunctionScript(functionName: string, params?: string | object, encode: boolean = true) {
        const paramString = this.evalFunctionParamToString(params, encode);
        return `${functionName}(${paramString})`;
    }

    private evalFunctionParamToString(params: string | object | undefined, encode: boolean = true): string {
        if (typeof params === 'object') {
            if (encode) {
                return `"${encodeURIComponent(JSON.stringify(params))}"`;
            } else {
                return `"${JSON.stringify(params)}"`;
            }
        } else if (typeof params === 'string') {
            if (encode) {
                return `"${encodeURIComponent(params)}"`;
            } else {
                return `"${params}"`;
            }
        } else {
            return '';
        }
    }

    /**
     * log some info with session prefix
     *
     * @param val what to log
     */
    private log(val: string): void {
        console.log(`${this.name} ${val}`);
    }
}

export default ScriptLoader;
