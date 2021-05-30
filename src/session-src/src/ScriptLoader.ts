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
    private name: string;
    private csInterface: CSInterface;

    constructor() {
        if (ScriptLoader.instance) {
            return ScriptLoader.instance;
        }

        this.name = 'ScriptLoader:: ';
        this.csInterface = new CSInterface();

        ScriptLoader.instance = this;
    }

    /**
     * loadJSX - load a jsx file dynamically, this
     * will also load all of it's includes which is desirable
     *
     * @param fileName the file name
     * @return description
     */
    public async loadJSX(fileName: string): Promise<string> {
        var extensionRoot = path.join(this.csInterface.getSystemPath(SystemPath.EXTENSION), 'host');
        try {
            const result = await this.evalScript('$._ext.evalFile', path.join(extensionRoot, fileName));
            console.log(JSON.parse(result));
            return result;
        } catch (err) {
            console.log(JSON.parse(err));
            throw err;
        }
    }

    public evalScript(functionName: string, params?: string | object): Promise<string> {
        var paramsString = this.evalScriptParamsToString(params);
        var evalString = `${functionName}(${paramsString})`;
        this.log('evalString: ' + evalString);

        return new Promise((resolve, reject) => {
            this.csInterface.evalScript(evalString, (res) => {
                res = decodeURIComponent(res);
                if (res.toLowerCase().indexOf('error') === -1) {
                    resolve(res);
                } else {
                    reject(res);
                }
            });
        });
    }

    private evalScriptParamsToString(params: undefined | string | object): string {
        if (typeof params === 'object') {
            return `"${encodeURIComponent(JSON.stringify(params))}"`;
        } else if (typeof params === 'string') {
            return `"${encodeURIComponent(params)}"`;
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
