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
export default class ScriptLoader {
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
    public loadJSX(fileName: string): void {
        var extensionRoot = path.join(this.csInterface.getSystemPath(SystemPath.EXTENSION), 'host');

        this.evalScript('$._ext.evalFile', path.join(extensionRoot, fileName))
            .then(res => console.log(JSON.parse(res as string)))
            .catch(err => console.log(JSON.parse(err)));
    }

    public evalScript(functionName: string, params?: string | object): Promise<string> {
        var paramsString = this.evalScriptParamsToString(params);
        var evalString = `${functionName}(${paramsString})`;
        this.log('evalString: ' + evalString);

        return new Promise((resolve, reject) => {
            this.csInterface.evalScript(evalString, res => {
                res = decodeURIComponent(res);
                if (res.toLowerCase().indexOf('error') === -1) {
                    this.log('success eval');
                    resolve(res);
                } else {
                    this.log('err eval');
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
