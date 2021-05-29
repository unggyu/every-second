import Session from './Session';
import ScriptLoader from './ScriptLoader';

declare global {
    interface Window {
        session: Session;
        scriptLoader: ScriptLoader;
    }
}

window.session = new Session();
window.scriptLoader = new ScriptLoader();

export { Session, ScriptLoader };
export { default as DataManagers } from './managers/DataManagers';
export { default as LogManager } from './managers/LogManager';
export {
    ESScriptError,
    IScriptParameter,
    ITestHostWithArgsParameter,
    IStartEditParameter,
    IScriptResult,
    IScriptResultPayload,
    IEverySecondScriptResult,
    ITestHostWithArgsResult
} from './Session';
