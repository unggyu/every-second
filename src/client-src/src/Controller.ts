import { Session, IStartEditParameter, IScriptResultPayload } from '../../session-src/src/index';

declare global {
    interface Window {
        session: Session;
    }
}

interface IEverySecondEditData extends IStartEditParameter {}

class SessionNotExistsError extends Error {
    public controller: Controller;
    constructor(controller: Controller, message?: string) {
        super(message ?? 'Session not exists.');
        this.controller = controller;
        this.name = 'SessionNotExistsError';
    }
}

/**
 * the main plugin session. This can enter the node modules as
 * well as the host
 *
 */
class Controller {
    private static instance: Controller;
    private _session: Session;

    constructor() {
        if (Controller.instance) {
            return Controller.instance;
        }

        this.init();
        Controller.instance = this;
    }

    get name(): string {
        return 'Client Controller:: ';
    }

    get session(): Session {
        return this._session;
    }

    startEdit(params: IEverySecondEditData): Promise<IScriptResultPayload> {
        if (!this.hasSession()) {
            throw new SessionNotExistsError(this);
        }

        return this.session.startEdit(params);
    }

    private init(): void {
        this.log('client controller is initing...');
        this._session = new Session();
        this.log(`do we have session ? ${this.hasSession()}`);
        this.log('client controller has inited');
    }

    /**
     * do we have access to session services ?
     *
     * @return {boolean} true/false
     */
    private hasSession(): boolean {
        return window.session !== undefined;
    }

    /**
     * log some info with session prefix
     *
     * @param  {string} val what to log
     */
    private log(val: string): void {
        console.log(`${this.name} ${val}`);
    }
}

export default Controller;
export {
    IEverySecondEditData,
    SessionNotExistsError
}