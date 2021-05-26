import path from 'path';

/**
 * load jsx scripts dynamically
 */
export default class ScriptLoader {
    static instance;

    constructor() {
        if (ScriptLoader.instance) {
            return ScriptLoader.instance;
        }

        this.cs = new CSInterface();
        ScriptLoader.instance = this;
    }

    get cs() {
        return this._cs
    }

    set cs(val) {
        this._cs = val
    }

    loadLibraries() {
        var libPath = path.join(this.cs.getSystemPath(SystemPath.EXTENSION), 'lib');
        this.evalScript('$._ext.evalFile', path.join(libPath, 'json3.min.js'));
    }

    /**
     * loadJSX - load a jsx file dynamically, this
     * will also load all of it's includes which is desirable
     *
     * @param  {type} fileName the file name
     * @return {type}          description
     */
    loadJSX(fileName) {
        var extensionRoot = path.join(this.cs.getSystemPath(SystemPath.EXTENSION), 'host');

        console.log('extensionRoot: ' + extensionRoot);
        this.evalScript('$._ext.evalFile', path.join(extensionRoot, fileName))
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }

    /**
     * evalScript - evaluate a JSX script
     *
     * @param  {type} functionName the string name of the function to invoke
     * @param  {type} params the params object
     * @return {Promise} a promise
     */
    evalScript(functionName, params) {
        var paramsString = this.evalScriptParamsToString(params);
        var evalString = `${functionName}(${paramsString})`;
        console.log(`${this.name} evalString: ` + evalString);

        return new Promise((resolve, reject) => {
            this.cs.evalScript(evalString, res => {
                if (typeof res === 'string' && res.toLowerCase().indexOf('error') != -1) {
                    this.log('err eval');
                    if (this.isJson(res)) {
                        reject(JSON.parse(res));
                    }
                    reject(res);
                } else {
                    this.log('success eval');
                    resolve(res);
                }
            });
        });
    }

    evalScriptParamsToString(params) {
        return typeof params === 'undefined' ?
            '' : typeof params !== 'string' ?
                `"${encodeURIComponent(JSON.stringify(params))}"` : `"${encodeURIComponent(params)}"`;
    }

    isJson(str) {
        try {
            JSON.parse(str);
        } catch (err) {
            return false;
        }

        return true;
    }

    /**
     * log some info with session prefix
     *
     * @param  {string} val what to log
     */
    log(val) {
        console.log(`${this.name} ${val}`);
    }

    get name() {
        return 'ScriptLoader:: ';
    }
}
