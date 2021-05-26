// import EventEmitter from 'events'
import ScriptLoader from './ScriptLoader';
import DataManagers from './managers/DataManagers';

/**
 * the main plugin session. This can enter the node modules as
 * well as the host
 *
 */
export default class Session {
    static instance;

    constructor() {
        if (Session.instance) {
            return Session.instance;
        }

        this.init();
        Session.instance = this;
    }

    get name() {
        return 'Session:: ';
    }

    /**
     * get data managers
     *
     * @return {type}  description
     */
    get managers() {
        return this._managers;
    }

    /**
     * init - session
     *
     */
    init() {
        // init before everything so I can intercept console.log
        this.log('session is initing...');
        this._managers = new DataManagers();
        this._managers.init();
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

    test() {
        return this.scriptLoader.evalScript('$._ES_.test_host');
    }

    /**
     * testWithArgs - let's testWithArgs things
     *
     */
    testWithArgs() {
        var obj = {
            name: 'tomer'
        }

        return this.scriptLoader.evalScript('$._ES_.test_host_with_args', obj)
    }

    startEdit(params) {
        return this.scriptLoader.evalScript('$._ES_.start_edit', params);
    }

    /**
     * log some info with session prefix
     *
     * @param  {string} val what to log
     */
    log(val) {
        console.log(`${this.name} ${val}`)
    }
}
