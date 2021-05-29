import { Session, IStartEditParameter, IScriptResultPayload } from '../../session-src/src/index';

declare global {
    interface Window {
        session: Session;
    }
}

export type EverySecondEditData = IStartEditParameter;

export class SessionNotExistsError extends Error {
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
export default class Controller {
    private static instance: Controller;
    private session: Session;
    private name: string;

    constructor() {
        if (Controller.instance) {
            return Controller.instance;
        }

        this.init();
        Controller.instance = this;
        this.name = 'Client Controller:: ';
    }

    init(): void {
        this.log('client controller is initing...');
        this.session = new Session();
        this.log(`do we have session ? ${this.hasSession()}`)

        this.log('client controller has inited')
    }

    startEdit(params: EverySecondEditData): Promise<IScriptResultPayload | undefined> {
        if (!this.hasSession()) {
            throw new SessionNotExistsError(this);
        }

        return this.session.startEdit(params);
    }

    /**
     * do we have access to session services ?
     *
     * @return {boolean} true/false
     */
    hasSession(): boolean {
        return window.session !== undefined;
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
