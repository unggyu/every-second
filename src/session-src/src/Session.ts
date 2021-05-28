// import EventEmitter from 'events'
import ScriptLoader from './ScriptLoader';
import DataManagers from './managers/DataManagers';

interface EverySecondEditData {
    interval: number,
    clipsToMultipy: number,
    toEndOfTheVideo: boolean
}

class ScriptPrefixes {
    static ES: string = '$._ES_.';
}

class ESScripts {
    static TEST_HOST: string = `${ScriptPrefixes.ES}test_host`;
    static TEST_HOST_WITH_ARGS: string = `${ScriptPrefixes.ES}test_host_with_args`;
    static START_EDIT: string = `${ScriptPrefixes.ES}start_edit`;
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

    init() {
        // init before everything so I can intercept console.log
        this.log('session is initing...');
        this.managers = new DataManagers();
        this.managers.init();
        this.scriptLoader = new ScriptLoader();
        // load jsx file dynamically
        this.log('loading the main jsx file');
        this.scriptLoader.loadJSX('main.jsx');


        // some testWithArgsing
        this.test();
        // var fs = require('fs-extra')
        //console.log(fs)

        this.log('session is inited');
    }

    test(): Promise<string> {
        return this.scriptLoader.evalScript(ESScripts.TEST_HOST) as Promise<string>;
    }

    /**
     * testWithArgs - let's testWithArgs things
     *
     */
    testWithArgs(): Promise<string> {
        var obj = {
            name: 'tomer'
        };

        return this.scriptLoader.evalScript(ESScripts.TEST_HOST_WITH_ARGS, obj) as Promise<string>;
    }

    async startEdit(params: EverySecondEditData): Promise<object> {
        try {
            const resultStr = await this.scriptLoader.evalScript(ESScripts.START_EDIT, params);
            return JSON.parse(resultStr);
        } catch (err) {
            if (typeof err === 'string') {
                return JSON.parse(err);
            } else {
                return {
                    error: err
                };
            }
        }
    }

    /**
     * log some info with session prefix
     *
     * @param  {string} val what to log
     */
    log(val: string): void {
        console.log(`${this.name} ${val}`)
    }
}
