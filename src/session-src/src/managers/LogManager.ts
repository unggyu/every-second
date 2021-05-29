/**
 * log management
 *
 */
export default class LogManager {
    private _logs: Array<object> = [];

    init(): void {
        this.log('initing...');
        var log = console.log;

        if (console === undefined) {
            return;
        }

        var that = this;
        // override the console.log method
        console.log = function (...data: any[]) {
            // log.call(this, 'My Console!!!')
            // log.apply(this, Array.prototype.slice.call(arguments))
            // retain older console.log functionality
            log.call(this, data);
            // save the log internally
            that.addRawLog(data);
        }
    }

    /**
     * addLog - collect log
     *
     * @param  {Object} val anything
     *
     */
    addRawLog(...val: any): void {
        this._logs.push(val);
    }

    get rawLogs(): Array<object> {
        return this._logs
    }

    get name(): string {
        return 'LogManager:: ';
    }

    log(val: string | object): string {
        return `${this.name} ${val}`;
    }
}
