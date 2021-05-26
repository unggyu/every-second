import Session from '../session-src/src/Session';

/**
 * the main plugin session. This can enter the node modules as
 * well as the host
 *
 */
export default class Controller {
    static instance;

    constructor() {
        if (Controller.instance) {
            return Controller.instance;
        }

        this.init();
        Session.instance = this;
    }

    /**
     * init - session
     *
     */
    init() {
        this.log('client controller is initing...');
        this.session = new Session();
        this.log(`do we have session ? ${this.hasSession()}`)

        this.log('client controller has inited')
    }

    test() {
        if (!this.hasSession()) {
            return;
        }

        return this.session.test();
    }

    testWithArgs() {
        if (!this.hasSession()) {
            return;
        }

        return this.session.testWithArgs();
    }

    startEdit(params) {
        this.log('startEdit');

        if (!this.hasSession()) {
            return;
        }

        return this.session.startEdit(params);
    }

    /**
     * get logz - get raw logz from log manager
     *
     * @return {array<Object>}  description
     */
    get logz() {
        if(!this.hasSession())
            return []

        return this.session.managers.log.rawLogs
    }

    /**
     * do we have access to session services ?
     *
     * @return {boolean} true/false
     */
    hasSession() {
        return window.session !== undefined
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
        return 'Client Controller:: '
    }
}
