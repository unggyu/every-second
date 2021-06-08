import LogManager from './LogManager';

export default class DataManagers {
    private _manager_log: LogManager;

    init(): void {
        this._manager_log = new LogManager();
        this._manager_log.init();
    }

    /**
     * get log - the log manager
     *
     * @return {LogManager} the log manager
     */
    get log(): LogManager {
        return this._manager_log;
    }
}
