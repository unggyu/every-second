import { Session, IStartEditParameter, IScriptResultPayload, IAlertParameter } from '../../session-src/src/index';

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

    public get name(): string {
        return 'Client Controller:: ';
    }

    public get session(): Session {
        return this._session;
    }

    public async alert(message: IAlertParameter['message'], decorator: IAlertParameter['decorator']): Promise<void> {
        if (!this.hasSession()) {
            throw new SessionNotExistsError(this);
        }

        await this.session.alert({
            message: message,
            decorator: decorator
        });
    }

    public async isClipSelected(): Promise<boolean> {
        if (!this.hasSession()) {
            throw new SessionNotExistsError(this);
        }

        var payload = await this.session.isClipSelected();
        return payload.result ?? false;
    }

    public async getSelectedClip(): Promise<ProjectItem> {
        if (!this.hasSession()) {
            throw new SessionNotExistsError(this);
        }

        const payload = await this.session.getSelectedClip();
        const clip = payload.result;
        if (!clip) {
            throw new Error('result is undefined');
        }
        return clip;
    }

    public async startEdit(param: IEverySecondEditData): Promise<void> {
        if (!this.hasSession()) {
            throw new SessionNotExistsError(this);
        }

        const isEditablePayload = await this.session.isEditable();
        if (isEditablePayload.result?.isEditable) {
            await this.session.startEdit(param);
        } else {
            throw new Error(isEditablePayload.result?.reason);
        }
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