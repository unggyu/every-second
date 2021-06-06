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

    public get name(): string {
        return 'ScriptLoader:: ';
    }

    public get csInterface(): CSInterface {
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

    public evalFunction(functionName: string, param?: number | string | object): Promise<string> {
        this.log('functionScript: ' + this.makeEvalFunctionScript(functionName, param, false));
        const script = this.makeEvalFunctionScript(functionName, param);
        return this.evalScript(script);
    }

    public evalScript(script: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.csInterface.evalScript(script, (res) => {
                res = decodeURIComponent(res);
                if (!res.toLowerCase().includes('error')) {
                    resolve(res);
                } else {
                    reject(res);
                }
            });
        });
    }

    public makeEvalFunctionScript(functionName: string, param?: number | string | object, encode: boolean = true) {
        const paramtring = this.evalFunctionParamToString(param, encode);
        return `${functionName}(${paramtring})`;
    }

    private evalFunctionParamToString(param: number | string | object | undefined, encode: boolean = true): string {
        if (typeof param === 'object') {
            if (encode) {
                return `"${encodeURIComponent(JSON.stringify(param))}"`;
            } else {
                return `"${JSON.stringify(param)}"`;
            }
        } else if (typeof param === 'string') {
            if (encode) {
                return `"${encodeURIComponent(param)}"`;
            } else {
                return `"${param}"`;
            }
        } else if (typeof param === 'number') {
            return param + '';
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
