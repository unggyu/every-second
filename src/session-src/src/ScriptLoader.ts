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
     * @param  {type} fileName the file name
     * @return {type}          description
     */
    loadJSX(fileName: string): void {
        var extensionRoot = path.join(this.csInterface.getSystemPath(SystemPath.EXTENSION), 'host');

        this.evalScript('$._ext.evalFile', path.join(extensionRoot, fileName))
            .then(res => console.log(JSON.parse(res as string)))
            .catch(err => console.log(JSON.parse(err)));
    }

    /**
     * evalScript - evaluate a JSX script
     *
     * @param  {string} functionName the string name of the function to invoke
     * @param  {any} params the params object
     * @return {Promise} a promise
     */
    evalScript(functionName: string, params?: any): Promise<string> {
        var paramsString = this.evalScriptParamsToString(params);
        var evalString = `${functionName}(${paramsString})`;
        this.log('evalString: ' + evalString);

        return new Promise((resolve, reject) => {
            this.csInterface.evalScript(evalString, res => {
                res = decodeURIComponent(res);
                if (res.toLowerCase().indexOf('error') != -1) {
                    this.log('err eval');
                    reject(res);
                } else {
                    this.log('success eval');
                    resolve(res);
                }
            });
        });
    }

    evalScriptParamsToString(params: undefined | string | object): string {
        return typeof params === 'undefined' ?
            '' : typeof params !== 'string' ?
                `"${encodeURIComponent(JSON.stringify(params))}"` : `"${encodeURIComponent(params)}"`;
    }

    /**
     * log some info with session prefix
     *
     * @param  {string} val what to log
     */
    log(val: string): void {
        console.log(`${this.name} ${val}`);
    }
}
