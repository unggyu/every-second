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
        // load libraries
        // this.log('loading libraries');
        // this.scriptLoader.loadLibraries();
        // load jsx file dynamically
        this.log('loading the main jsx file');
        this.scriptLoader.loadJSX('main.jsx');


        // some testWithArgsing
        this.test();
        // var fs = require('fs-extra')
        //console.log(fs)

        this.log('session is inited');
    }


    /**
     * get data managers
     *
     * @return {type}  description
     */
    get managers() {
        return this._managers
    }

    /**
     * scriptLoader - get the script loader
     *
     */
    scriptLoader() {
        return this.scriptLoader
    }

    test() {
        return this.scriptLoader.evalScript('test_host');
    }

    /**
     * testWithArgs - let's testWithArgs things
     *
     */
    testWithArgs() {
        var obj = {
            name: 'tomer'
        }

        return this.scriptLoader.evalScript('test_host_with_args', obj)
    }

    /**
     * invoke the plugin
     *
     * @param  {{textures:boolean, masks:boolean, info: boolean, flatten:boolean}} options for plugin
     *
     * @return {object} describes how well the execution of plugin was
     */
    invokePlugin(options) {
        const { folderPath, isFlattenChecked,
                isInfoChecked, isInspectVisibleChecked,
                isMasksChecked, isTexturesChecked,
                isMeaningfulNamesChecked, isHierarchicalChecked} = options

        // i reparse everything to detect failures
        const pluginData = {
            destinationFolder: folderPath,
            exportInfoJson: isInfoChecked,
            inspectOnlyVisibleLayers: isInspectVisibleChecked,
            exportMasks: isMasksChecked,
            exportTextures: isTexturesChecked,
            flatten: !isHierarchicalChecked,
            namePrefix: isMeaningfulNamesChecked ? 'layer' : undefined
        }

        var that = this

        return new Promise((resolve, reject) => {
            this.scriptLoader
                .evalScript('invoke_document_worker', pluginData)
                .then((res) => {
                    resolve(JSON.parse(res))
                })
                .catch(err => {
                    reject(err)
                });
        });
    }

    startEdit(params) {
        return new Promise((resolve, reject) => {
            this.scriptLoader
                .evalScript('start_edit', params)
                .then(res => {
                    resolve(JSON.parse(res));
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    /**
     * log some info with session prefix
     *
     * @param  {string} val what to log
     */
    log(val) {
        console.log(`${this.name} ${val}`)
    }

    get name() {
        return 'Session:: '
    }
}
